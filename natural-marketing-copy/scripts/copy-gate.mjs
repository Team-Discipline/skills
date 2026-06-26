#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { writeCopySurface } from "./copy-surface.mjs";

const defaultSurfaceFile = ".generated/natural-copy-surface.txt";
const defaultSources = ["src/content/site-copy.jsonc", "index.html", "pricing.html"];
const defaultMaxScore = 15;

const ruleGroups = [
  {
    label: "내부 추상어",
    reason: "고객-facing 카피가 아니라 내부 전략어처럼 읽힌다.",
    patterns: [/운영\s*자산/, /개인기/, /자산화|워크스페이스화/, /상위\s*분석\s*레이어/],
  },
  {
    label: "번역투/AI풍 표현",
    reason: "한국어 B2B 문맥에서 생성형 SaaS 소개 문장처럼 읽힌다.",
    patterns: [
      /당신(?:은|이|의|에게|을|를)?/,
      /에 의해/,
      /을 가지고 있|를 가지고 있/,
      /중 하나/,
      /다음과 같습니다/,
      /제공합니다|활용 가능합니다|사용자 친화적/,
      /효율성을 극대화|최적화된/,
    ],
  },
  {
    label: "근거 없는 과장",
    reason: "증명되지 않은 마케팅 과장 표현이다.",
    patterns: [/혁신적인|획기적인|차세대|새로운 패러다임|완벽한|무제한/],
  },
  {
    label: "자동화/확정 claim",
    reason: "제품이 보장하지 못하는 완전 자동화나 확정 결과를 암시한다.",
    patterns: [/자동으로 해결|확정 RCA|완전 자동 RCA|AI가 모든 장애|즉시 모든 문제 해결/],
  },
];

const heroTitleJargonPattern =
  /telemetry|observability|Incident|Trace|Service Map|War Room|RCA|Gateway|OpenTelemetry|Prometheus|ClickHouse/i;
const timeAdverbPattern = /이미|아직|매번|계속|곧|벌써|여전히|이제/g;
const timeAdverbRoles = new Map([
  ["이미", "완료 상태"],
  ["벌써", "완료 상태"],
  ["아직", "현재 사실"],
  ["여전히", "현재 사실"],
  ["이제", "현재 사실"],
  ["매번", "반복 행동"],
  ["계속", "반복 행동"],
  ["곧", "미래 약속"],
]);
const suspiciousPresentVerbs = ["쌓입니다", "모입니다", "남깁니다", "이어집니다", "확인합니다", "검증합니다", "기록합니다"];
const repeatedProblemPattern = /문제는[^.?!。]*점입니다/g;
const completedStateConflictPattern = new RegExp(
  `(이미|벌써)[^.?!。\\n]{0,60}(${suspiciousPresentVerbs.join("|")})`,
);
const hardSeverityPattern = /\b(?:high|critical)\b|(?:높음|치명)/i;
const mediumSeverityPattern = /\bmedium\b|중간/i;
const allowedMediumPattern =
  /3의 법칙|구조적 반복|불필요한 외래어|외래어|카드|Step 1-3|Pricing\s*\/\s*Demo|Problem|Roles|Product|Gateway|Monitoring|request|token|provider|metadata|latency|usage|retention|cluster|private deployment/i;

function usage() {
  return [
    "Usage:",
    "  node copy-gate.mjs --surface <copy-surface.txt> [--patina]",
    "  node copy-gate.mjs --source <file> [--source <file> ...] [--patina]",
    "  node copy-gate.mjs <file> [file ...]",
  ].join("\n");
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = {
    sources: [],
    surfaceFile: "",
    generatedSurfaceFile: defaultSurfaceFile,
    runPatina: false,
    patinaConfig: ".patina.yaml",
    patinaBin: join("node_modules", ".bin", process.platform === "win32" ? "patina.cmd" : "patina"),
    maxScore: Number.parseInt(process.env.PATINA_MAX_SCORE ?? String(defaultMaxScore), 10),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--surface") {
      args.surfaceFile = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (current === "--source") {
      args.sources.push(argv[index + 1] ?? "");
      index += 1;
      continue;
    }
    if (current === "--out") {
      args.generatedSurfaceFile = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (current === "--patina") {
      args.runPatina = true;
      continue;
    }
    if (current === "--patina-config") {
      args.patinaConfig = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (current === "--patina-bin") {
      args.patinaBin = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (current === "--max-score") {
      args.maxScore = Number.parseInt(argv[index + 1] ?? "", 10);
      index += 1;
      continue;
    }
    if (current === "--help" || current === "-h") {
      args.help = true;
      continue;
    }
    if (current.startsWith("--")) {
      throw new Error(`알 수 없는 인자: ${current}`);
    }
    args.sources.push(current);
  }

  args.sources = args.sources.filter(Boolean);
  if (!args.surfaceFile && args.sources.length === 0) {
    args.sources = defaultSources.filter((source) => existsSync(source));
  }

  return args;
}

function countEojeol(text) {
  return text
    .replace(/[.,!?;:()[\]{}"“”‘’]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?。])\s*|(?<=다\.)|(?<=요\.)/g)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function parseSurface(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const separator = line.indexOf(": ");
      if (separator === -1) {
        return {
          path: `line:${index + 1}`,
          text: line,
        };
      }

      return {
        path: line.slice(0, separator),
        text: line.slice(separator + 2),
      };
    });
}

function buildIssue({ severity = "block", path, text, message }) {
  return {
    severity,
    path,
    text,
    message,
  };
}

function isTitlePath(path) {
  return /(?:^|\.|#)(?:title|headline)$/.test(path) || /\.title$/.test(path);
}

function isHeroTitlePath(path) {
  return /hero.*title|title.*hero/i.test(path);
}

function isCtaPath(path) {
  return /(?:actions?\.\d+\.label|cta\.label|button|cta|finalCta)/i.test(path);
}

function analyzeEntries(entries) {
  const blocking = [];
  const reports = [];
  const verbCounts = new Map();
  let problemStructureCount = 0;

  for (const entry of entries) {
    const { path, text } = entry;

    for (const group of ruleGroups) {
      for (const pattern of group.patterns) {
        if (pattern.test(text)) {
          blocking.push(
            buildIssue({
              path,
              text,
              message: `${group.label}: ${group.reason}`,
            }),
          );
          break;
        }
      }
    }

    if (isHeroTitlePath(path) && heroTitleJargonPattern.test(text)) {
      blocking.push(
        buildIssue({
          path,
          text,
          message: "Hero title은 고객 장면을 먼저 보여줘야 하므로 도메인 영어를 앞세우지 않는다.",
        }),
      );
    }

    if (isTitlePath(path) && countEojeol(text) > 16) {
      blocking.push(
        buildIssue({
          path,
          text,
          message: "제목은 16어절 이하로 유지한다.",
        }),
      );
    }

    if (isCtaPath(path) && countEojeol(text) > 8) {
      blocking.push(
        buildIssue({
          path,
          text,
          message: "CTA는 8어절 이하로 줄인다.",
        }),
      );
    }

    for (const sentence of splitSentences(text)) {
      const eojeol = countEojeol(sentence);
      if (eojeol > 34) {
        blocking.push(
          buildIssue({
            path,
            text: sentence,
            message: "한 문장이 34어절을 넘는다. 한 문장에는 한 생각만 둔다.",
          }),
        );
      } else if (eojeol >= 28) {
        reports.push(
          buildIssue({
            severity: "warn",
            path,
            text: sentence,
            message: `긴 문장 후보: ${eojeol}어절`,
          }),
        );
      }
    }

    const completedStateConflict = text.match(completedStateConflictPattern);
    if (completedStateConflict) {
      blocking.push(
        buildIssue({
          path,
          text,
          message: `시간 부사와 동사 충돌: '${completedStateConflict[1]}'는 완료된 상태를 요구하므로 '${completedStateConflict[2]}'와 함께 쓰지 않는다.`,
        }),
      );
    }

    const timeAdverbs = [...text.matchAll(timeAdverbPattern)].map((match) => match[0]);
    for (const adverb of timeAdverbs) {
      reports.push(
        buildIssue({
          severity: "info",
          path,
          text,
          message: `시간 부사 후보: ${adverb}(${timeAdverbRoles.get(adverb) ?? "검토 필요"})`,
        }),
      );
    }

    for (const verb of suspiciousPresentVerbs) {
      if (text.includes(verb)) {
        verbCounts.set(verb, (verbCounts.get(verb) ?? 0) + 1);
      }
    }

    problemStructureCount += [...text.matchAll(repeatedProblemPattern)].length;
  }

  if (problemStructureCount > 1) {
    blocking.push(
      buildIssue({
        path: "copy-surface",
        text: "",
        message: "'문제는 ... 점입니다' 구조가 반복된다. 고객 장면을 직접 말하는 문장으로 바꾼다.",
      }),
    );
  }

  for (const [verb, count] of verbCounts) {
    if (count > 1) {
      reports.push(
        buildIssue({
          severity: "info",
          path: "copy-surface",
          text: verb,
          message: `반복 동사 후보: ${count}회`,
        }),
      );
    }
  }

  return { blocking, reports };
}

function formatIssue(issue) {
  return [`${issue.path}`, `  유형: ${issue.message}`, issue.text ? `  원문: ${issue.text}` : ""]
    .filter(Boolean)
    .join("\n");
}

function runPatina({ surfaceFile, patinaBin, patinaConfig, maxScore }) {
  if (!existsSync(patinaBin)) {
    throw new Error(`patina 실행 파일을 찾을 수 없음: ${patinaBin}`);
  }

  if (!existsSync(patinaConfig)) {
    throw new Error(`patina config를 찾을 수 없음: ${patinaConfig}`);
  }

  if (!Number.isFinite(maxScore) || maxScore < 0 || maxScore > 100) {
    throw new Error("--max-score는 0-100 사이 정수여야 함");
  }

  const commonArgs = [
    "--config",
    patinaConfig,
    "--quiet",
    "--lang",
    "ko",
    "--profile",
    "marketing",
    "--backend",
    "codex-cli",
    "--batch",
    surfaceFile,
  ];

  const score = spawnSync(
    patinaBin,
    ["--score", "--exit-on", String(maxScore), "--format", "json", ...commonArgs],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  const scoreOutput = [score.stdout, score.stderr].filter(Boolean).join("\n");
  if (score.status !== 0) {
    throw new Error(`patina score gate 실패\n${scoreOutput.trim()}`);
  }

  const audit = spawnSync(patinaBin, ["--audit", ...commonArgs], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const auditOutput = [audit.stdout, audit.stderr].filter(Boolean).join("\n");
  if (audit.status !== 0) {
    throw new Error(`patina audit 실행 실패\n${auditOutput.trim()}`);
  }

  const blocking = [];
  const reviewed = [];
  for (const line of auditOutput.split("\n")) {
    if (!line.includes("|")) {
      continue;
    }
    if (hardSeverityPattern.test(line)) {
      blocking.push(line.trim());
    } else if (mediumSeverityPattern.test(line)) {
      if (allowedMediumPattern.test(line)) {
        reviewed.push(line.trim());
      } else {
        blocking.push(line.trim());
      }
    }
  }

  if (blocking.length > 0) {
    throw new Error(`patina audit 차단 경고\n${blocking.join("\n")}`);
  }

  return {
    scoreOutput: scoreOutput.trim(),
    auditOutput: auditOutput.trim(),
    reviewed,
  };
}

export function runCli(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    console.log(usage());
    return 0;
  }

  let surfaceFile = args.surfaceFile;
  if (!surfaceFile) {
    if (args.sources.length === 0) {
      throw new Error(`분석할 source 파일이 없습니다.\n${usage()}`);
    }
    const generated = writeCopySurface({
      sources: args.sources,
      outFile: args.generatedSurfaceFile,
    });
    surfaceFile = generated.outFile;
    console.log(`Copy surface 생성: ${surfaceFile} (${generated.entries.length}건)`);
  }

  if (!existsSync(surfaceFile)) {
    throw new Error(`copy surface를 찾을 수 없음: ${surfaceFile}`);
  }

  const entries = parseSurface(readFileSync(surfaceFile, "utf8"));
  const result = analyzeEntries(entries);

  if (result.blocking.length > 0) {
    console.error("Natural copy gate 실패");
    console.error(result.blocking.map(formatIssue).join("\n\n"));
    if (result.reports.length > 0) {
      console.error("\n검토 후보");
      console.error(result.reports.map(formatIssue).join("\n\n"));
    }
    return 1;
  }

  console.log(`Natural copy gate 통과: ${basename(surfaceFile)} (${entries.length}건)`);
  if (result.reports.length > 0) {
    console.log("\n검토 후보");
    console.log(result.reports.map(formatIssue).join("\n\n"));
  }

  if (args.runPatina) {
    const patina = runPatina({
      surfaceFile,
      patinaBin: args.patinaBin,
      patinaConfig: args.patinaConfig,
      maxScore: args.maxScore,
    });
    if (patina.reviewed.length > 0) {
      console.log(`\nPatina audit 검토 경고: ${patina.reviewed.length}건은 허용 목록으로 확인됨`);
    }
    console.log(`Patina gate 통과: score <= ${args.maxScore}, 차단 audit 경고 없음`);
  }

  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = runCli();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
