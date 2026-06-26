#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const defaultOutFile = ".generated/natural-copy-surface.txt";
const defaultSources = ["src/content/site-copy.jsonc", "index.html", "pricing.html"];
const ignoredKeys = new Set(["route", "fragment", "kind", "style", "odId", "tone", "anchor"]);

function usage() {
  return [
    "Usage:",
    "  node copy-surface.mjs --source <file> [--source <file> ...] [--out <file>]",
    "  node copy-surface.mjs <file> [file ...] [--out <file>]",
  ].join("\n");
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = {
    outFile: defaultOutFile,
    sources: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--out") {
      const next = argv[index + 1];
      if (!next) {
        throw new Error("--out 값이 필요함");
      }
      args.outFile = next;
      index += 1;
      continue;
    }

    if (current === "--source") {
      const next = argv[index + 1];
      if (!next) {
        throw new Error("--source 값이 필요함");
      }
      args.sources.push(next);
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

  if (args.sources.length === 0) {
    args.sources = defaultSources.filter((source) => existsSync(source));
  }

  return args;
}

function stripJsonc(content) {
  let output = "";
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (inString) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
        quote = "";
      }
      continue;
    }

    if (char === "\"" || char === "'") {
      inString = true;
      quote = char;
      output += char;
      continue;
    }

    if (char === "/" && next === "/") {
      while (index < content.length && content[index] !== "\n") {
        index += 1;
      }
      output += "\n";
      continue;
    }

    if (char === "/" && next === "*") {
      index += 2;
      while (index < content.length && !(content[index] === "*" && content[index + 1] === "/")) {
        index += 1;
      }
      index += 1;
      continue;
    }

    output += char;
  }

  return output.replace(/,\s*([}\]])/g, "$1");
}

function parseJsonLike(content, file) {
  try {
    return JSON.parse(stripJsonc(content));
  } catch (error) {
    throw new Error(`JSON/JSONC parse 실패: ${file}\n${error.message}`);
  }
}

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function shouldCollectString(path, value) {
  const key = path.at(-1) ?? "";
  if (ignoredKeys.has(key)) {
    return false;
  }

  if (/^(?:src|href|url|canonicalUrl|email)$/i.test(key)) {
    return false;
  }

  if (/^(?:https?:|mailto:|\/assets\/|#)/.test(value)) {
    return false;
  }

  return value.trim().length > 0;
}

export function collectCopyStrings(value, path = []) {
  if (typeof value === "string") {
    return shouldCollectString(path, value)
      ? [
          {
            path: path.join("."),
            text: normalizeText(value),
          },
        ]
      : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectCopyStrings(item, [...path, String(index)]));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => collectCopyStrings(child, [...path, key]));
  }

  return [];
}

function extractVisibleHtmlLines(content, file) {
  const entries = [];
  let ignoredBlock = false;

  content.split(/\r?\n/).forEach((rawLine, index) => {
    if (/<(?:script|style|svg)\b/i.test(rawLine)) {
      ignoredBlock = true;
    }

    if (!ignoredBlock) {
      const text = normalizeText(decodeEntities(rawLine).replace(/<[^>]+>/g, " "));
      if (text.length > 0) {
        entries.push({
          path: `${file}:${index + 1}`,
          text,
        });
      }
    }

    if (/<\/(?:script|style|svg)>/i.test(rawLine)) {
      ignoredBlock = false;
    }
  });

  return entries;
}

function extractTextLines(content, file) {
  return content
    .split(/\r?\n/)
    .map((line, index) => ({
      path: `${file}:${index + 1}`,
      text: normalizeText(line.replace(/^#+\s*/, "").replace(/^[-*]\s*/, "")),
    }))
    .filter((entry) => entry.text.length > 0);
}

function readEntriesFromFile(file) {
  if (!existsSync(file)) {
    throw new Error(`파일을 찾을 수 없음: ${file}`);
  }

  const content = readFileSync(file, "utf8");
  const ext = extname(file).toLowerCase();

  if (ext === ".json" || ext === ".jsonc") {
    return collectCopyStrings(parseJsonLike(content, file)).map((entry) => ({
      path: `${file}#${entry.path}`,
      text: entry.text,
    }));
  }

  if (ext === ".html" || ext === ".htm") {
    return extractVisibleHtmlLines(content, file);
  }

  return extractTextLines(content, file);
}

export function buildCopySurface(sources) {
  const entries = sources.flatMap((source) => readEntriesFromFile(source));
  return {
    entries,
    surface: entries.map((entry) => `${entry.path}: ${entry.text}`).join("\n").concat(entries.length ? "\n" : ""),
  };
}

export function writeCopySurface({ sources, outFile = defaultOutFile } = {}) {
  if (!sources || sources.length === 0) {
    throw new Error("분석할 source 파일이 필요함");
  }

  const result = buildCopySurface(sources);
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, result.surface, "utf8");
  return {
    ...result,
    outFile,
  };
}

export function runCli(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    console.log(usage());
    return 0;
  }

  if (args.sources.length === 0) {
    throw new Error(`분석할 source 파일이 없습니다.\n${usage()}`);
  }

  const result = writeCopySurface({
    sources: args.sources,
    outFile: args.outFile,
  });

  console.log(`Copy surface 생성: ${result.outFile}`);
  console.log(`대상: ${args.sources.join(", ")}`);
  console.log(`문구: ${result.entries.length}건`);
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
