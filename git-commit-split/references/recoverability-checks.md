# Recoverability Checks

커밋 분할이 끝난 후 각 커밋이 **독립적으로 안전한지** 검증하는 절차.

## Per-Commit Checklist

각 커밋에 대해 다음을 확인한다:

```bash
# 1. 이 커밋의 변경 내역 확인
git show --stat HEAD

# 2. 이 커밋이 의존하는 파일이 모두 포함되었는가?
git diff HEAD~1..HEAD --name-only
```

### 1. Import Completeness

```
[x] 새로 추가된 import가 모두 이 커밋에 포함되었는가?
[x] 제거된 import의 사용처가 모두 이 커밋에서 정리되었는가?
```

**검사 명령어:**

```bash
# 새로 추가된 import 찾기
git diff HEAD~1..HEAD | grep '^+import\|^+from'

# 해당 import가 실제로 사용되는지 확인
git show HEAD | grep '^+' | grep -E '(import|from)\s'
```

### 2. API Contract Integrity

```
[x] 함수/클래스 시그니처가 변경되었다면 모든 호출처가 이 커밋에 포함되었는가?
[x] 새로운 public 함수가 추가되었다면 (적어도) 테스트에서 호출하는가?
[x] 삭제된 함수를 참조하는 코드가 남아 있지 않은가?
```

**검사 명령어:**

```bash
# 한 커밋 안에서 함수 정의와 호출의 균형 확인 (언어별)
# 예) "def foo"가 변경되었는데 "foo(" 호출이 누락되면 경고
git diff HEAD~1..HEAD -U0 | grep '^[+-]' | sort | uniq -c | sort -rn
```

### 3. Revert Isolation

```
[x] 이 커밋만 revert 해도 프로젝트가 동작하는가?
[x] revert 시 다른 커밋과 충돌이 예상되지 않는가?
```

**검사 명령어 (시뮬레이션):**

```bash
# revert를 실제로 수행하지 않고 예측만
git revert --no-commit HEAD
git diff --stat
git revert --abort  # 되돌리기
```

### 4. Cherry-Pick Compatibility

```
[x] 이 커밋을 다른 브랜치로 cherry-pick 할 때 필요한 선행 커밋이 무엇인지 명확한가?
[x] cherry-pick 후 충돌이 예상되지 않는가?
```

**체크 기준:** 커밋 메시지에 명시적 의존성이 기록되어 있어야 함.

> 예: `depends on commit abc123 (type definition change)`

## Post-Split Validation Script

모든 커밋이 완료된 후 실행:

```bash
echo "=== Recoverability Report ==="
git log --oneline -n 20
echo ""
echo "=== 각 커밋이 독립적인가? ==="
for sha in $(git log --reverse --format=%H -n 20); do
  echo "--- $sha $(git log --oneline -1 $sha) ---"
  git diff-tree --no-commit-id -r $sha | awk '{print $NF}' | sort | uniq -c
done
```

## 커밋 안전성 등급

| 등급 | 기준 | 조치 |
|------|------|------|
| 🟢 안전 | 모든 체크 통과, revert 시뮬레이션 이상 없음 | PR 생성 가능 |
| 🟡 주의 | 1-2개 체크 실패 (예: test 누락) | 메시지에 TODO 기록, 진행 가능 |
| 🔴 위험 | revert 시뮬레이션에서 충돌 또는 import 깨짐 | 커밋 재분할 필요 |

## 유저에게 보고 포맷

모든 커밋 분할이 끝나면 다음 형식으로 요약:

```
✅ 4개 커밋 생성 완료. 안전성 등급: 🟢 안전

 1. refactor(core): move source files to src/
 2. feat(users): add profile endpoint
 3. fix(search): handle empty response
 4. test(users): add profile endpoint tests

복구 가이드:
- revert: git revert <hash> (각 커밋 개별 revert 가능)
- cherry-pick: git cherry-pick <hash> (선별 적용 가능)
- 전체 되돌리기: git reset --hard HEAD~4
```
