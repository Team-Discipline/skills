# Skills

[![skills.sh](https://skills.sh/b/Team-Discipline/skills)](https://skills.sh/Team-Discipline/skills)

AI Agent용 Skill 정의 저장소입니다. Skills는 특정 작업을 수행하는 재사용 가능한 지침(instruction) 모음으로, AI 어시스턴트가 더 효과적으로 작업할 수 있도록 돕습니다.

## Available Skills

### git-commit-split

파일 변경사항을 의미 단위로 그룹화하여 작고 집중된 git 커밋과 명확한 메시지를 생성합니다.

**사용 시점:**
- 커밋을 분할해 달라고 요청할 때
- 변경사항을 선별하여 커밋하고 싶을 때
- 저장소에 혼합된 변경사항이 있고 정리된 히스토리가 필요할 때

### quality-check

저장소 코드 품질을 점검하고 한국어로 간결한 결과를 보고합니다. 부분 변경, 최근 커밋, 전체 저장소의 세 가지 모드를 지원합니다.

**사용 시점:**
- 변경된 파일의 코드 품질을 검사할 때
- 최근 n개 커밋을 리뷰할 때
- 전체 저장소 감사가 필요할 때

## Installation

```bash
npx skills add Team-Discipline/skills
```

## Usage

설치 후 AI 에이전트가 관련 작업을 감지하면 자동으로 skill을 사용합니다.

직접 호출할 수도 있습니다:
- `커밋을 분할해줘` — git-commit-split 활성화
- `코드 품질을 검사해줘` — quality-check 활성화

## License

MIT
