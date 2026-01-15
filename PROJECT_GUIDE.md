# 📦 CareerBoost 프로젝트 저장 및 관리 가이드

## 🎯 목차

1. [Claude 프로젝트로 저장하기](#1-claude-프로젝트로-저장하기)
2. [로컬 컴퓨터에 저장하기](#2-로컬-컴퓨터에-저장하기)
3. [GitHub에 업로드하기](#3-github에-업로드하기)
4. [Vercel에 배포하기](#4-vercel에-배포하기)
5. [프로젝트 업데이트 관리](#5-프로젝트-업데이트-관리)

---

## 1. Claude 프로젝트로 저장하기

### 📌 Claude 프로젝트란?

Claude 프로젝트는 대화 내용과 파일을 함께 저장하여 나중에 이어서 작업할 수 있는 기능입니다.

### ✅ 저장 방법

#### 방법 A: 현재 대화를 프로젝트로 변환

1. **Claude 채팅 화면 상단** 오른쪽의 **"⋮" (더보기 메뉴)** 클릭
2. **"Add to Project"** 또는 **"프로젝트에 추가"** 선택
3. **"Create new project"** 선택
4. 프로젝트 이름 입력:
   ```
   CareerBoost - AI 경력기술서 서비스
   ```
5. 설명 추가 (선택):
   ```
   AI 경력기술서 업그레이드 웹사이트
   - HTML/CSS/JS 단일 페이지
   - Claude Sonnet 4.5 연동
   - Vercel 배포 준비 완료
   ```
6. **"Create"** 클릭

#### 방법 B: 새 프로젝트 생성 후 파일 업로드

1. Claude 좌측 사이드바에서 **"Projects"** 클릭
2. **"New Project"** 버튼 클릭
3. 프로젝트 이름과 설명 입력
4. 프로젝트 생성 후, 다음 파일들을 업로드:
   - `index.html` (메인 파일)
   - `images/` 폴더 전체
   - `README.md`
   - `vercel.json`

### 💡 프로젝트에 포함할 파일

```
✅ 필수 파일:
- index.html (메인 HTML)
- images/ 폴더 (3개 이미지)
- README.md (문서)
- vercel.json (Vercel 설정)

📝 선택 파일:
- package.json (메타데이터)
- .gitignore (Git 설정)
- 이 가이드 문서
```

### 🔄 프로젝트 활용

프로젝트로 저장하면:
- ✅ **컨텍스트 유지**: 프로젝트 파일이 자동으로 대화에 포함
- ✅ **이어서 작업**: "이전 작업 이어서 진행해줘"
- ✅ **버전 관리**: 파일 수정 이력 확인 가능
- ✅ **협업**: 팀원과 프로젝트 공유 가능

---

## 2. 로컬 컴퓨터에 저장하기

### 📥 방법 1: 파일 직접 다운로드

1. Claude가 제공한 파일 링크 클릭
2. 각 파일을 다운로드:
   - `index.html`
   - `before-after.png`
   - `template-detail.png`
   - `template-thumb.png`

3. 폴더 구조 생성:
```
내문서/
└── careerboost/
    ├── index.html
    └── images/
        ├── before-after.png
        ├── template-detail.png
        └── template-thumb.png
```

### 📥 방법 2: ZIP 파일로 다운로드 (추천)

Claude에게 요청:
```
"전체 프로젝트를 ZIP 파일로 만들어줘"
```

→ 압축 파일을 다운로드하여 압축 해제

### 🖥️ 로컬에서 실행

#### Windows:
```bash
cd careerboost
python -m http.server 8000
```

#### Mac/Linux:
```bash
cd careerboost
python3 -m http.server 8000
```

→ 브라우저에서 `http://localhost:8000` 접속

---

## 3. GitHub에 업로드하기

### 📌 왜 GitHub?

- ✅ 버전 관리
- ✅ 백업
- ✅ Vercel 배포 연동
- ✅ 포트폴리오

### 🔧 단계별 가이드

#### STEP 1: GitHub 저장소 생성

1. https://github.com 로그인
2. 우측 상단 **"+"** → **"New repository"**
3. 저장소 정보 입력:
   ```
   Repository name: careerboost
   Description: AI-powered career document upgrade service
   Visibility: Public (또는 Private)
   ✅ Add a README file: 체크 안 함 (이미 있음)
   ```
4. **"Create repository"** 클릭

#### STEP 2: Git 초기화 및 업로드

```bash
# 1. 프로젝트 폴더로 이동
cd careerboost

# 2. Git 초기화
git init

# 3. 파일 추가
git add .

# 4. 첫 커밋
git commit -m "Initial commit: CareerBoost v2.0"

# 5. GitHub와 연결 (YOUR_USERNAME을 본인 계정으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/careerboost.git

# 6. 메인 브랜치로 변경
git branch -M main

# 7. 업로드
git push -u origin main
```

#### 인증이 필요한 경우:

```bash
# Personal Access Token 생성:
# GitHub → Settings → Developer settings → Personal access tokens → Generate new token

# 업로드 시 비밀번호 대신 토큰 입력
```

---

## 4. Vercel에 배포하기

### 🚀 배포 준비 (이미 완료!)

다음 파일들이 이미 준비되어 있습니다:
- ✅ `vercel.json` - Vercel 설정
- ✅ `package.json` - 프로젝트 정보
- ✅ `.gitignore` - Git 제외 파일
- ✅ `README.md` - 문서

### 📦 Vercel 배포 (웹 UI 방식 - 추천)

#### STEP 1: Vercel 계정 생성

1. https://vercel.com 접속
2. **"Sign Up"** 클릭
3. **"Continue with GitHub"** 선택 (추천)
4. GitHub 계정으로 로그인

#### STEP 2: 프로젝트 배포

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. **"Import Git Repository"** 섹션에서 GitHub 저장소 검색
3. **"careerboost"** 저장소 선택 → **"Import"** 클릭
4. 프로젝트 설정:
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: (비워두기)
   Output Directory: (비워두기)
   Install Command: (비워두기)
   ```
5. **"Deploy"** 클릭
6. 배포 완료! (약 30초~1분)

#### STEP 3: 배포 확인

- 배포 URL: `https://careerboost-XXXX.vercel.app`
- 자동 생성된 URL로 접속하여 확인

### 🌐 커스텀 도메인 연결 (선택)

#### 도메인이 있다면:

1. Vercel 프로젝트 → **"Settings"** → **"Domains"**
2. 도메인 입력 (예: `careerboost.com`)
3. DNS 설정 안내에 따라 도메인 제공업체에서 설정:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

#### 무료 도메인 (Vercel 제공):

- 기본 제공: `프로젝트명.vercel.app`
- 변경 가능: Settings → Domains에서 수정

---

## 5. 프로젝트 업데이트 관리

### 🔄 코드 수정 → 자동 배포

Vercel은 GitHub와 연동되어 **자동 배포**됩니다!

```bash
# 1. 코드 수정
code index.html

# 2. 변경사항 확인
git status

# 3. 변경사항 추가
git add .

# 4. 커밋
git commit -m "Update: 헤더 디자인 개선"

# 5. GitHub에 푸시
git push origin main

# 6. Vercel이 자동으로 재배포! (약 30초)
```

### 📊 배포 상태 확인

- Vercel 대시보드 → Deployments
- 실시간 배포 로그 확인 가능
- 이전 버전으로 롤백 가능

### 🔀 브랜치 전략 (고급)

```bash
# 개발 브랜치 생성
git checkout -b develop

# 기능 브랜치 생성
git checkout -b feature/new-template

# 작업 후 병합
git checkout main
git merge feature/new-template

# 푸시
git push origin main
```

---

## 📋 체크리스트

### ✅ Claude 프로젝트 저장

- [ ] 프로젝트 생성
- [ ] 파일 업로드 (index.html, images/)
- [ ] 설명 추가
- [ ] 컨텍스트 확인

### ✅ 로컬 저장

- [ ] 폴더 구조 생성
- [ ] 파일 다운로드
- [ ] 로컬 실행 테스트

### ✅ GitHub 업로드

- [ ] GitHub 계정 생성
- [ ] 저장소 생성
- [ ] Git 초기화
- [ ] 코드 업로드
- [ ] 저장소 확인

### ✅ Vercel 배포

- [ ] Vercel 계정 생성 (GitHub 연동)
- [ ] 프로젝트 import
- [ ] 배포 설정
- [ ] 배포 완료
- [ ] 사이트 접속 확인

---

## 🆘 문제 해결

### Q1: Git 업로드가 안 돼요!

```bash
# 원격 저장소 확인
git remote -v

# 없다면 다시 추가
git remote add origin https://github.com/YOUR_USERNAME/careerboost.git

# 강제 푸시 (주의!)
git push -f origin main
```

### Q2: Vercel 배포가 실패해요!

- **Build Failed**: `vercel.json` 파일 확인
- **404 Error**: `index.html` 파일 위치 확인 (루트 디렉토리)
- **Images 404**: `images/` 폴더가 포함되었는지 확인

### Q3: 이미지가 안 보여요!

```html
<!-- 경로 확인 -->
<img src="images/before-after.png">   ✅ 정확
<img src="/images/before-after.png">  ✅ 정확
<img src="before-after.png">          ❌ 틀림
```

### Q4: 관리자 로그인이 안 돼요!

- 로컬 실행: `file://` 프로토콜에서 동작
- Vercel 배포: 아직 실제 API 연동 전이라 안 됨
- 향후 Supabase 연동 필요

---

## 📚 추가 자료

- [Git 기초 가이드](https://git-scm.com/book/ko/v2)
- [GitHub 시작하기](https://docs.github.com/ko/get-started)
- [Vercel 문서](https://vercel.com/docs)
- [Claude Projects 가이드](https://support.anthropic.com/ko/articles/projects)

---

## 💬 다음 단계 추천

1. **백업 3종 세트 완성**:
   - ✅ Claude 프로젝트
   - ✅ GitHub 저장소
   - ✅ Vercel 배포

2. **기능 추가 작업**:
   - Supabase 인증 구현
   - 실제 Claude API 연동
   - PDF 생성 기능
   - 결제 시스템

3. **마케팅 준비**:
   - 커스텀 도메인 구매
   - SEO 최적화
   - 소셜 미디어 공유

---

**문서 버전**: 1.0  
**작성일**: 2026-01-14  
**작성자**: Claude (Anthropic)
