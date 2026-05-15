# Staging Recipes

단일 파일 안에 여러 의도의 변경이 섞여 있을 때 사용하는 hunk-splitting 패턴.

## When to Split a Single File

하나의 파일에 다음과 같은 변경이 섞여 있다면 `git add -p`로 분리해야 한다:

```diff
 # src/services/user.py

-  def get_user(id):              # ← 리팩터링: 타입 힌트 추가
+  def get_user(id: int):

-      return db.query(id)        # ← 버그픽스: None 체크 누락
+      if not id:
+          return None
+      return db.query(id)

-  def old_name():                # ← 리팩터링: 함수명 변경
+  def new_name():
```

→ 3가지 의도(refactor + fix + refactor)가 하나의 파일에 혼재 → `git add -p`로 분할

## Hunk-Splitting Recipe

### Step 1: 대화형 staging 시작

```bash
git add -p src/services/user.py
```

### Step 2: hunk별 분류 템플릿

각 hunk에 대해 유저에게 질문:

> 이 hunk는 어떤 의도인가요?
>
> 1. **Prep** — 포매팅, rename, import 정리
> 2. **Core** — 기능 변경, 리팩터링 (Prep 완료 후)
> 3. **Fix** — 버그 수정
> 4. **Polish** — 테스트, 문서
> 5. **건너뜀** — 다른 커밋에 포함

### Step 3: hunk 쪼개기

하나의 hunk 안에 여러 의도가 섞여 있으면 `git add -p`의 `s` (split) 명령으로 더 잘게 나눈다:

```bash
Stage this hunk [y,n,q,a,d,s,e,?]? s
```

분할이 안 될 정도로 변경이 가까이 있으면 `e` (edit)로 직접 편집:

```bash
Stage this hunk [y,n,q,a,d,s,e,?]? e
```

## Common Patterns

### 패턴 1: "기능 추가 + 포매팅이 섞인 파일"

```
의도 1 (Core):  새 함수 추가, if/else 로직 변경
의도 2 (Polish): 주석 정리, 빈 줄 제거
```

→ Core 먼저, Polish는 Core commit 이후에 따로 staging

### 패턴 2: "버그픽스 + 리팩터링이 섞인 파일"

```
의도 1 (Fix):    null 체크 추가, 에러 핸들링
의도 2 (Refactor): 변수명 변경, 함수 추출
```

→ Fix 먼저 커밋 (급선무), Refactor는 별도 커밋

### 패턴 3: "리팩터링 중 발견한 다른 버그"

```
의도 1 (Refactor): 함수 추출, 변수 인라인
의도 2 (Fix):     추출 과정에서 발견한 기존 버그
```

→ Fix를 먼저 commit (가능하면 `git stash`로 Refactor 변경을 잠시 치워둠)

```bash
git stash -- src/services/user.py       # Refactor 변경만 stash
git add -p src/services/user.py         # Fix hunk만 staging
git commit -m "fix(user): handle edge case"
git stash pop                           # Refactor 변경 복원
git add -p src/services/user.py         # Refactor hunk만 staging
git commit -m "refactor(user): extract validation logic"
```

### 패턴 4: "테스트 코드와 프로덕션 코드 동시 변경"

```
의도 1 (Fix + Test): 버그 수정 + 그 검증 테스트 → 같은 커밋
의도 2 (Test):       기존 기능에 대한 테스트 보강 → 별도 커밋 (Polish)
```

```bash
# Fix + 해당 테스트를 같이 커밋
git add src/services/search.py tests/test_search.py
git commit -m "fix(search): prevent NPE on empty query"

# 이후 추가 테스트만 따로 커밋
git add tests/test_search.py
git commit -m "test(search): add remaining edge cases"
```

### 패턴 5: "import 정리 + 실제 변경"

```diff
- import os, sys, json, httpx
+ import httpx                     # 실제 변경과 무관한 import 정리
  import asyncio

-  result = old_api(data)          # ← 실제 변경
+  result = new_api(data)
```

→ Prep 커밋에서 import만 정리하고, Core에서 실제 변경을 별도 커밋

```bash
git add -p src/handler.py          # import 정리 hunk만 yes
git commit -m "chore: clean up unused imports"

git add -p src/handler.py          # 실제 변경 hunk만 yes
git commit -m "feat(handler): migrate to new_api"
```

## Rollback-Safe Staging Checklist

Staging 전 확인:

- [ ] 이 stage에 포함된 모든 변경이 **같은 의도**인가?
- [ ] 이 stage를 revert해도 다른 변경이 깨지지 않는가?
- [ ] 만약 이 stage만 cherry-pick 하면 동작하는가?
- [ ] 같은 파일을 건드리는 다른 stage가 남아 있지 않은가? (충돌 위험)
