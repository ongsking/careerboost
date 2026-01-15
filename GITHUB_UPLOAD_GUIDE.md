# 🚀 GitHub 업로드 상세 가이드 (STEP 3)

## 📍 목표
CareerBoost 프로젝트를 GitHub 저장소에 업로드합니다.

---

## 🎯 전체 흐름

```
로컬 폴더 → Git 초기화 → GitHub 저장소 생성 → 연결 → 업로드
```

---

## 📋 사전 준비

### ✅ 체크리스트
- [ ] GitHub 계정 있음
- [ ] Git 설치됨 (터미널에서 `git --version` 확인)
- [ ] 프로젝트 폴더 다운로드 완료

### Git 설치 확인

**Windows:**
```cmd
git --version
```

**Mac/Linux:**
```bash
git --version
```

**출력 예시:**
```
git version 2.39.0
```

**Git이 없다면?**
- Windows: https://git-scm.com/download/win
- Mac: `brew install git` 또는 Xcode 설치
- Linux: `sudo apt install git` (Ubuntu/Debian)

---

## 🌐 STEP 1: GitHub 저장소 생성

### **1-1. GitHub 웹사이트 접속**

1. https://github.com 접속
2. 로그인

### **1-2. 새 저장소 만들기**

1. 우측 상단 **"+"** 버튼 클릭
2. **"New repository"** 선택

### **1-3. 저장소 설정**

```
Repository name: careerboost
Description: AI-powered career document upgrade service
```

**중요 설정:**
```
☑️ Public (무료, 권장)
또는
☐ Private (비공개)

☐ Add a README file     ← 체크 해제!
☐ Add .gitignore        ← 체크 해제!
☐ Choose a license      ← None
```

**왜 체크 해제?**
→ 프로젝트에 이미 README.md와 .gitignore가 있기 때문입니다!

### **1-4. Create repository 클릭**

**생성 완료!** 🎉

다음과 같은 화면이 나타납니다:

```
Quick setup — if you've done this kind of thing before

HTTPS  [복사 버튼]
https://github.com/YOUR_USERNAME/careerboost.git

...or create a new repository on the command line
...or push an existing repository from the command line
```

**중요: 이 URL을 복사해두세요!**
```
https://github.com/YOUR_USERNAME/careerboost.git
```

---

## 💻 STEP 2: 로컬에서 Git 초기화

### **2-1. 터미널/명령 프롬프트 열기**

**Windows:**
1. 프로젝트 폴더(`careerboost-vercel`) 열기
2. 주소창에 `cmd` 입력 → Enter
3. 또는 폴더 내에서 우클릭 → "Git Bash Here"

**Mac:**
1. Finder에서 프로젝트 폴더 열기
2. 우클릭 → "서비스" → "폴더에서 터미널 열기"
3. 또는 터미널 열고 `cd ~/Downloads/careerboost-vercel`

**Linux:**
1. 파일 관리자에서 폴더 열기
2. 우클릭 → "터미널에서 열기"
3. 또는 터미널에서 `cd ~/Downloads/careerboost-vercel`

### **2-2. 현재 위치 확인**

```bash
pwd
```

**출력 예시:**
```
/Users/woosang/Downloads/careerboost-vercel
또는
C:\Users\woosang\Downloads\careerboost-vercel
```

**파일 목록 확인:**
```bash
ls
```

**출력 예시:**
```
README.md
index.html
api/
lib/
images/
package.json
vercel.json
.gitignore
```

✅ 올바른 폴더에 있습니다!

---

## 🔧 STEP 3: Git 초기화 및 커밋

### **3-1. Git 저장소 초기화**

```bash
git init
```

**출력:**
```
Initialized empty Git repository in /Users/woosang/Downloads/careerboost-vercel/.git/
```

✅ `.git` 폴더가 생성되었습니다 (숨김 폴더)

### **3-2. Git 사용자 정보 설정** (최초 1회만)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**예시:**
```bash
git config --global user.name "Woosang Jo"
git config --global user.email "woosang87@example.com"
```

**확인:**
```bash
git config --global user.name
git config --global user.email
```

### **3-3. 파일 추가**

```bash
git add .
```

**의미:** 현재 폴더의 모든 파일을 Git에 추가

**확인:**
```bash
git status
```

**출력 예시:**
```
On branch main

Initial commit

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

        new file:   .gitignore
        new file:   README.md
        new file:   index.html
        new file:   api/config.js
        new file:   api/upgrade.js
        new file:   lib/claude-api.js
        new file:   lib/supabase-client.js
        ...
```

✅ 모든 파일이 추가되었습니다!

### **3-4. 커밋 (저장)**

```bash
git commit -m "Initial commit: CareerBoost with API integration"
```

**출력 예시:**
```
[main (root-commit) a1b2c3d] Initial commit: CareerBoost with API integration
 15 files changed, 3500 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 README.md
 create mode 100644 index.html
 ...
```

✅ 첫 번째 커밋 완료!

---

## 🔗 STEP 4: GitHub 저장소 연결

### **4-1. 원격 저장소 추가**

**중요: YOUR_USERNAME을 본인의 GitHub 사용자명으로 변경!**

```bash
git remote add origin https://github.com/YOUR_USERNAME/careerboost.git
```

**예시:**
```bash
git remote add origin https://github.com/woosang87/careerboost.git
```

**확인:**
```bash
git remote -v
```

**출력:**
```
origin  https://github.com/YOUR_USERNAME/careerboost.git (fetch)
origin  https://github.com/YOUR_USERNAME/careerboost.git (push)
```

✅ 원격 저장소 연결 완료!

### **4-2. 기본 브랜치 이름 설정**

```bash
git branch -M main
```

**의미:** 현재 브랜치 이름을 `main`으로 변경

---

## 📤 STEP 5: GitHub에 업로드 (Push)

### **5-1. 업로드 실행**

```bash
git push -u origin main
```

### **5-2. GitHub 로그인 (최초 1회)**

**방법 1: 브라우저 팝업** (권장)
```
브라우저가 열리면서 GitHub 로그인 요청
→ 로그인 완료
→ 자동으로 터미널로 돌아옴
```

**방법 2: 터미널 직접 입력**
```
Username for 'https://github.com': YOUR_USERNAME
Password for 'https://YOUR_USERNAME@github.com': [Personal Access Token]
```

**Personal Access Token이 필요한 경우:**

1. GitHub → 우측 상단 프로필 → **Settings**
2. 좌측 하단 → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token** → **Generate new token (classic)**
5. Note: `CareerBoost Deploy`
6. Expiration: `90 days`
7. Select scopes:
   - ✅ **repo** (전체 체크)
8. **Generate token** 클릭
9. **토큰 복사** (다시 볼 수 없습니다!)
10. 터미널에서 비밀번호 대신 토큰 입력

### **5-3. 업로드 진행**

**출력 예시:**
```
Enumerating objects: 20, done.
Counting objects: 100% (20/20), done.
Delta compression using up to 8 threads
Compressing objects: 100% (15/15), done.
Writing objects: 100% (20/20), 125.45 KiB | 8.36 MiB/s, done.
Total 20 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (2/2), done.
To https://github.com/YOUR_USERNAME/careerboost.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **업로드 완료!** 🎉

---

## 🔍 STEP 6: GitHub에서 확인

### **6-1. GitHub 저장소 확인**

1. 브라우저에서 https://github.com/YOUR_USERNAME/careerboost 접속
2. 다음 파일들이 보여야 합니다:

```
careerboost/
├── 📄 README.md
├── 📄 index.html
├── 📁 api/
│   ├── config.js
│   └── upgrade.js
├── 📁 lib/
│   ├── claude-api.js
│   └── supabase-client.js
├── 📁 images/
├── 📄 package.json
├── 📄 vercel.json
└── 📄 .gitignore
```

### **6-2. 파일 내용 확인**

1. **index.html** 클릭
2. 코드가 제대로 보이는지 확인
3. **api/upgrade.js** 클릭
4. Claude API 코드 확인

✅ 모든 파일이 정상적으로 업로드되었습니다!

---

## ⚠️ 자주 발생하는 문제

### **문제 1: "fatal: not a git repository"**

**원인:** `.git` 폴더가 없음

**해결:**
```bash
git init
```

### **문제 2: "remote origin already exists"**

**원인:** 원격 저장소가 이미 추가됨

**해결:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/careerboost.git
```

### **문제 3: "failed to push some refs"**

**원인:** GitHub 저장소에 이미 내용이 있음

**해결:**
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### **문제 4: "Permission denied"**

**원인:** 인증 실패

**해결:**
1. Personal Access Token 재생성
2. 또는 SSH 키 설정

### **문제 5: "large file" 경고**

**원인:** 100MB 이상 파일

**해결:**
```bash
# 큰 파일 확인
find . -type f -size +100M

# .gitignore에 추가
echo "big-file.zip" >> .gitignore
git rm --cached big-file.zip
```

---

## 🎯 다음 단계

GitHub 업로드가 완료되었다면:

✅ **STEP 3 완료!**

→ **STEP 4: Vercel 배포**로 이동

---

## 📸 스크린샷 가이드

### **GitHub 저장소 생성 화면**

```
┌──────────────────────────────────────┐
│ Create a new repository              │
├──────────────────────────────────────┤
│ Repository name                      │
│ [careerboost                     ]   │
│                                      │
│ Description (optional)               │
│ [AI career document upgrade      ]   │
│                                      │
│ ○ Public  ○ Private                 │
│                                      │
│ ☐ Add a README file                 │
│ ☐ Add .gitignore                    │
│ ☐ Choose a license                  │
│                                      │
│        [Create repository]           │
└──────────────────────────────────────┘
```

### **업로드 성공 화면**

```
GitHub 저장소 페이지:
┌──────────────────────────────────────┐
│ YOUR_USERNAME / careerboost          │
│ ○ Public                             │
├──────────────────────────────────────┤
│ 📄 README.md                         │
│ 📄 index.html                        │
│ 📁 api                               │
│ 📁 lib                               │
│ 📁 images                            │
│                                      │
│ 15 files · 3,500 lines               │
│ Latest commit: Initial commit        │
└──────────────────────────────────────┘
```

---

## 💡 유용한 Git 명령어

### **상태 확인**
```bash
git status
```

### **변경 사항 확인**
```bash
git diff
```

### **커밋 이력 보기**
```bash
git log --oneline
```

### **파일 삭제 (Git에서)**
```bash
git rm filename
git commit -m "Remove filename"
git push
```

### **브랜치 확인**
```bash
git branch
```

---

## 🔄 코드 수정 후 다시 업로드하는 방법

나중에 코드를 수정한 후:

```bash
# 1. 변경사항 추가
git add .

# 2. 커밋
git commit -m "Update: 기능 추가"

# 3. 업로드
git push origin main
```

**간단하죠?** 😊

---

## ✅ 완료 체크리스트

- [ ] GitHub 저장소 생성
- [ ] Git 초기화 (`git init`)
- [ ] 파일 추가 (`git add .`)
- [ ] 커밋 (`git commit`)
- [ ] 원격 저장소 연결 (`git remote add`)
- [ ] 업로드 (`git push`)
- [ ] GitHub에서 확인

---

## 📞 추가 도움

### **Git 기본 개념**

```
Working Directory → Staging Area → Repository → GitHub
    (작업 폴더)     (git add)      (git commit)  (git push)
```

### **Git 용어**

- **Repository (저장소)**: 프로젝트 폴더
- **Commit**: 변경사항 저장
- **Push**: GitHub에 업로드
- **Pull**: GitHub에서 다운로드
- **Branch**: 작업 분기
- **Merge**: 브랜치 병합

---

## 🎉 성공!

GitHub 업로드가 완료되었습니다!

**확인 방법:**
→ https://github.com/YOUR_USERNAME/careerboost 접속
→ 모든 파일이 보이면 성공! ✅

**다음 단계:**
→ DEPLOYMENT_GUIDE.md의 **STEP 4 (Vercel 배포)**로 이동

---

**작성자**: Claude  
**버전**: 1.0  
**날짜**: 2026-01-15

**질문이 있으면 언제든 물어보세요!** 💬
