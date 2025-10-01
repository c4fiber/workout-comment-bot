# GitHub Actions CI/CD 설정 가이드

## 필수 GitHub Secrets 설정

GitHub Actions가 Vercel에 자동 배포하려면 다음 secrets를 설정해야 합니다:

### 1. VERCEL_TOKEN
Vercel 토큰을 생성하고 GitHub Secrets에 추가합니다.

**토큰 생성:**
1. https://vercel.com/account/tokens 접속
2. "Create Token" 클릭
3. 토큰 이름 입력 (예: `github-actions`)
4. Scope: Full Account
5. 생성된 토큰 복사

**GitHub Secrets에 추가:**
```bash
# 방법 1: CLI 사용
gh secret set VERCEL_TOKEN

# 방법 2: 웹 UI 사용
# https://github.com/c4fiber/workout-comment-bot/settings/secrets/actions
# New repository secret 클릭
# Name: VERCEL_TOKEN
# Value: [위에서 복사한 토큰]
```

### 2. VERCEL_ORG_ID (자동 설정됨)
```bash
gh secret set VERCEL_ORG_ID --body "team_AOjOeliXGTfQ7LMdRUwEw6V7"
```

### 3. VERCEL_PROJECT_ID (자동 설정됨)
```bash
gh secret set VERCEL_PROJECT_ID --body "prj_2aKSnHrTa3YWqQTRxI4ivofjbAjN"
```

## 자동 배포 확인

설정 완료 후:
1. 코드 수정 후 `git push origin main`
2. GitHub Actions 탭에서 워크플로우 실행 확인
3. 성공 시 자동으로 Vercel에 배포됨

## 현재 배포 URL
- Production: https://workout-comment-bi6xpfqse-c4fibers-projects.vercel.app
