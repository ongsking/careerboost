# CareerBoost - AI 경력기술서 업그레이드 서비스

AI를 활용하여 평범한 경력을 전문적인 포트폴리오로 변환하는 웹 서비스입니다.

## 🚀 Vercel 배포 가이드

### 1. 사전 준비
- GitHub 계정
- Vercel 계정 (https://vercel.com)
- Git 설치

### 2. GitHub에 코드 업로드

```bash
# 1. GitHub에서 새 저장소 생성 (예: careerboost)

# 2. 로컬에서 Git 초기화
cd careerboost-vercel
git init
git add .
git commit -m "Initial commit: CareerBoost v2.0"

# 3. GitHub 저장소와 연결
git remote add origin https://github.com/YOUR_USERNAME/careerboost.git
git branch -M main
git push -u origin main
```

### 3. Vercel 배포

#### 방법 1: Vercel 웹사이트에서 배포 (추천)

1. https://vercel.com 접속 및 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택 (careerboost)
4. 프로젝트 설정:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (비워두기)
   - **Output Directory**: (비워두기)
5. "Deploy" 클릭
6. 배포 완료! (약 1-2분 소요)

#### 방법 2: Vercel CLI로 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 4. 커스텀 도메인 연결 (선택)

1. Vercel 프로젝트 대시보드 → "Settings" → "Domains"
2. 도메인 입력 (예: careerboost.com)
3. DNS 설정 안내에 따라 도메인 제공업체에서 설정

## 📁 프로젝트 구조

```
careerboost-vercel/
├── index.html          # 메인 HTML 파일
├── images/             # 이미지 리소스
│   ├── before-after.png
│   ├── template-detail.png
│   └── template-thumb.png
├── vercel.json         # Vercel 설정
├── package.json        # 프로젝트 메타데이터
├── .gitignore         # Git 제외 파일
└── README.md          # 이 파일
```

## 🎨 주요 기능

- ✅ **STEP 1**: 3가지 템플릿 선택 (미니멀 프로페셔널, 모던 크리에이티브, 클래식 포멀)
- ✅ **STEP 2**: 경력 정보 입력 (최대 4,000자)
- ✅ **STEP 3**: AI 처리 (Claude Sonnet 4.5)
- ✅ **STEP 4**: 결과 확인 및 재작업
- ✅ **STEP 5**: PDF 다운로드 (프리미엄 기능)

## 🔧 로컬 개발

```bash
# Python 서버로 실행
python -m http.server 8000

# 브라우저에서 열기
http://localhost:8000
```

## 🔐 관리자 계정

개발/테스트용 관리자 계정:
```
아이디: woosang87
비밀번호: whdntkd12#
```

**⚠️ 주의**: 프로덕션 배포 시 반드시 변경하세요!

## 📊 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Design**: Brutalist Tech Style
- **AI**: Claude Sonnet 4.5 (Anthropic API)
- **Deployment**: Vercel
- **Future**: Supabase (인증/데이터베이스)

## 🔄 업데이트 배포

```bash
# 코드 수정 후
git add .
git commit -m "Update: 설명"
git push origin main

# Vercel이 자동으로 재배포합니다!
```

## 📈 로드맵

- [ ] Supabase 인증 통합
- [ ] 사용량 제한 시스템
- [ ] 실제 Claude API 연동
- [ ] PDF 생성 기능
- [ ] 결제 시스템 (Stripe)
- [ ] 템플릿 추가 (모던 크리에이티브, 클래식 포멀)

## 📝 라이선스

MIT License

## 👨‍💻 개발자

Woosang Jo (woosang87)

---

**Version**: 2.0.0  
**Last Updated**: 2026-01-14
