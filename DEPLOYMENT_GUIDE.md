# 🚀 CareerBoost 완전 배포 가이드 (API 연동 포함)

## 📋 목차

1. [사전 준비](#1-사전-준비)
2. [Anthropic API 설정](#2-anthropic-api-설정)
3. [Supabase 설정](#3-supabase-설정)
4. [환경 변수 구성](#4-환경-변수-구성)
5. [코드 수정](#5-코드-수정)
6. [Vercel 배포](#6-vercel-배포)
7. [관리자 계정 생성](#7-관리자-계정-생성)
8. [테스트 및 검증](#8-테스트-및-검증)

---

## 1. 사전 준비

### ✅ 필요한 것들

- [ ] GitHub 계정
- [ ] Vercel 계정
- [ ] Anthropic 계정 (Claude API)
- [ ] Supabase 계정
- [ ] 신용카드 (API 사용량 결제용)

### 💰 예상 비용

| 서비스 | 무료 플랜 | 유료 플랜 시작가 |
|--------|-----------|------------------|
| **Vercel** | ✅ 무제한 | $0 |
| **Supabase** | ✅ 50GB DB | $25/월 |
| **Anthropic API** | ❌ 없음 | 사용량 기준 |

**Claude API 비용 (Sonnet 4.5):**
- Input: $3 / 1M tokens
- Output: $15 / 1M tokens
- 평균 1회 업그레이드: 약 $0.05~0.10

**예상 월 비용 (100명 사용자):**
- API 비용: ~$10-20
- 서버: $0 (Vercel 무료)
- DB: $0 (Supabase 무료)
- **총: ~$10-20/월**

---

## 2. Anthropic API 설정

### STEP 1: Anthropic 계정 생성

1. https://console.anthropic.com 접속
2. "Sign Up" 클릭
3. 이메일/비밀번호 입력
4. 이메일 인증

### STEP 2: API 키 발급

1. 로그인 후 https://console.anthropic.com/settings/keys
2. "Create Key" 클릭
3. 키 이름 입력:
   ```
   CareerBoost Production
   ```
4. **API 키 복사** (다시 볼 수 없습니다!)
   ```
   sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
5. 안전한 곳에 저장 (비밀번호 관리 앱 추천)

### STEP 3: 크레딧 충전

1. https://console.anthropic.com/settings/billing
2. "Add Payment Method" 클릭
3. 신용카드 정보 입력
4. 초기 크레딧 충전:
   ```
   추천: $10 (약 100-200회 업그레이드)
   ```

### STEP 4: 사용량 제한 설정 (중요!)

1. https://console.anthropic.com/settings/limits
2. "Monthly Spending Limit" 설정:
   ```
   추천: $50/월 (예산 초과 방지)
   ```
3. 알림 이메일 설정

---

## 3. Supabase 설정

### STEP 1: Supabase 프로젝트 생성

1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub로 로그인
4. "New project" 클릭
5. 프로젝트 정보 입력:
   ```
   Name: careerboost
   Database Password: [강력한 비밀번호 생성]
   Region: Northeast Asia (Seoul) - 한국 서버
   Pricing Plan: Free
   ```
6. "Create new project" 클릭 (약 2분 소요)

### STEP 2: 데이터베이스 테이블 생성

1. 좌측 메뉴에서 **"SQL Editor"** 클릭
2. 다음 SQL 실행:

```sql
-- 사용자 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용량 테이블
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template TEXT NOT NULL,
  input_length INTEGER NOT NULL,
  output_length INTEGER,
  tokens_used INTEGER,
  cost DECIMAL(10, 4),
  status TEXT NOT NULL, -- 'success', 'failed', 'pending'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용량 제한 테이블
CREATE TABLE usage_limits (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_limit INTEGER DEFAULT 5,
  monthly_limit INTEGER DEFAULT 50,
  daily_count INTEGER DEFAULT 0,
  monthly_count INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  last_reset_month DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)
);

-- 인덱스 생성
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 데이터만 볼 수 있음
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view own usage logs"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own limits"
  ON usage_limits FOR SELECT
  USING (auth.uid() = user_id);
```

3. "Run" 클릭

### STEP 3: API 키 확인

1. 좌측 메뉴에서 **"Project Settings"** 클릭
2. **"API"** 탭 선택
3. 다음 정보 복사:
   ```
   Project URL: https://xxxxx.supabase.co
   anon (public) key: eyJhbGc...
   service_role key: eyJhbGc... (⚠️ 비밀!)
   ```

### STEP 4: 인증 설정

1. 좌측 메뉴에서 **"Authentication"** 클릭
2. **"Providers"** 탭 선택
3. **"Email"** 활성화
4. 설정:
   ```
   Enable Email Confirmations: OFF (간편 가입)
   Enable Email OTP: OFF
   ```

---

## 4. 환경 변수 구성

### STEP 1: .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# App Settings
NEXT_PUBLIC_APP_URL=https://careerboost.vercel.app
NODE_ENV=production

# Rate Limits
DAILY_FREE_LIMIT=5
MONTHLY_FREE_LIMIT=50
ADMIN_UNLIMITED=true
```

### STEP 2: .gitignore 업데이트

`.env.local`이 Git에 포함되지 않도록:

```bash
# Environment variables
.env.local
.env.production
.env*.local
```

---

## 5. 코드 수정

### 변경 사항 요약

1. ✅ Supabase 클라이언트 초기화
2. ✅ 실제 로그인/회원가입 구현
3. ✅ Claude API 호출 구현
4. ✅ 사용량 제한 체크
5. ✅ 관리자 권한 체크
6. ✅ 환경 변수 사용

### 필요한 파일

```
careerboost-vercel/
├── index.html (수정)
├── api/
│   ├── auth.js (신규)
│   ├── upgrade.js (신규)
│   └── usage.js (신규)
├── lib/
│   └── supabase.js (신규)
└── .env.local (신규)
```

---

## 6. Vercel 배포

### STEP 1: GitHub 업로드

```bash
cd careerboost-vercel

# Git 초기화
git init
git add .
git commit -m "Initial commit with API integration"

# GitHub 저장소 연결
git remote add origin https://github.com/YOUR_USERNAME/careerboost.git
git branch -M main
git push -u origin main
```

### STEP 2: Vercel 프로젝트 생성

1. https://vercel.com 접속
2. "Continue with GitHub" 로그인
3. "Add New..." → "Project" 클릭
4. "Import" careerboost 저장소

### STEP 3: 환경 변수 설정 (매우 중요!)

**Vercel 프로젝트 설정 화면에서:**

1. "Environment Variables" 섹션에서 추가:

```
ANTHROPIC_API_KEY = sk-ant-api03-xxxxx
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
NEXT_PUBLIC_APP_URL = https://careerboost.vercel.app
DAILY_FREE_LIMIT = 5
MONTHLY_FREE_LIMIT = 50
```

2. Environment: **Production, Preview, Development** 모두 체크

### STEP 4: 배포 설정

```
Framework Preset: Other
Root Directory: ./
Build Command: (비워두기)
Output Directory: (비워두기)
Install Command: (비워두기)
```

### STEP 5: 배포 시작

1. "Deploy" 클릭
2. 배포 진행 (약 1-2분)
3. 완료!

**배포 URL:**
```
https://careerboost-xxxxx.vercel.app
```

---

## 7. 관리자 계정 생성

### 방법 1: Supabase Dashboard에서 직접 생성 (추천)

1. Supabase 프로젝트 → **"Table Editor"** 클릭
2. **"users"** 테이블 선택
3. "Insert" → "Insert row" 클릭
4. 데이터 입력:

```sql
email: woosang87@example.com
username: woosang87
password_hash: $2b$10$... (bcrypt 해시)
is_admin: true
```

**비밀번호 해시 생성:**

Node.js로 생성:
```javascript
const bcrypt = require('bcrypt');
const password = 'whdntkd12#';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
// $2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

또는 온라인 도구:
- https://bcrypt-generator.com
- 비밀번호: `whdntkd12#`
- Rounds: 10
- 해시 복사

5. "Save" 클릭

### 방법 2: API로 생성

배포된 사이트에서 회원가입 후 DB에서 `is_admin = true` 변경

---

## 8. 테스트 및 검증

### ✅ 체크리스트

#### 배포 확인
- [ ] Vercel 배포 성공
- [ ] 사이트 접속 가능
- [ ] 환경 변수 적용 확인

#### 인증 테스트
- [ ] 회원가입 동작
- [ ] 로그인 동작
- [ ] 로그아웃 동작
- [ ] 관리자 로그인 동작

#### AI 업그레이드 테스트
- [ ] 텍스트 입력
- [ ] 파일 업로드
- [ ] AI 처리 시작
- [ ] 실제 결과 반환 (Mock 아님)
- [ ] Before/After 비교

#### 사용량 제한 테스트
- [ ] 5회 사용 후 제한 메시지
- [ ] 관리자는 무제한 사용

#### 에러 처리
- [ ] API 키 오류 시 메시지
- [ ] 네트워크 오류 시 메시지
- [ ] 사용량 초과 시 메시지

### 🧪 테스트 시나리오

#### 시나리오 1: 일반 사용자
```
1. 사이트 접속
2. 템플릿 선택
3. 경력 입력 (1,000자)
4. AI 업그레이드 시작
5. 로그인 요청 모달 표시 ✅
6. 회원가입 (이메일/비밀번호)
7. 다시 AI 업그레이드 시작
8. 실제 Claude API 호출 ✅
9. 업그레이드된 결과 표시 ✅
10. 사용 횟수 1/5 표시 ✅
```

#### 시나리오 2: 관리자
```
1. 관리자 계정으로 로그인
2. AI 업그레이드 6회 실행
3. 사용량 제한 없음 확인 ✅
4. 무제한 표시 확인 ✅
```

#### 시나리오 3: 사용량 초과
```
1. 일반 사용자로 5회 사용
2. 6번째 시도 시 제한 메시지 ✅
3. 프리미엄 안내 표시 ✅
```

---

## 9. 모니터링 및 유지보수

### Anthropic API 모니터링

1. https://console.anthropic.com/settings/usage
2. 일일/월간 사용량 확인
3. 비용 추적

### Supabase 모니터링

1. Supabase Dashboard → "Database"
2. `usage_logs` 테이블 확인
3. 사용 패턴 분석

### Vercel 로그 확인

1. Vercel Dashboard → 프로젝트 선택
2. "Logs" 탭
3. 실시간 에러 추적

---

## 10. 문제 해결

### Q1: API 키 오류

**증상:** "Invalid API key" 에러

**해결:**
1. Vercel → Settings → Environment Variables
2. `ANTHROPIC_API_KEY` 값 재확인
3. Redeploy

### Q2: Supabase 연결 오류

**증상:** "Failed to initialize Supabase client"

**해결:**
1. Supabase URL/Key 재확인
2. Supabase 프로젝트 활성 상태 확인
3. 환경 변수 재설정

### Q3: CORS 에러

**증상:** "CORS policy blocked"

**해결:**
Vercel의 `vercel.json`에 헤더 추가:
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

### Q4: 사용량이 증가하지 않음

**해결:**
1. Supabase → SQL Editor
2. 다음 쿼리 실행:
```sql
SELECT * FROM usage_logs ORDER BY created_at DESC LIMIT 10;
```
3. 로그 확인

---

## 11. 보안 고려사항

### ✅ 필수 보안 조치

1. **API 키 보호**
   - ❌ 절대 GitHub에 커밋하지 않기
   - ✅ Vercel Environment Variables만 사용
   - ✅ .gitignore에 .env.local 추가

2. **Supabase RLS**
   - ✅ Row Level Security 활성화 (완료)
   - ✅ 사용자는 자신의 데이터만 접근

3. **Rate Limiting**
   - ✅ 일일 5회 제한
   - ✅ 월간 50회 제한
   - ✅ IP 기반 제한 (향후 추가)

4. **비밀번호 해싱**
   - ✅ bcrypt 사용 (rounds=10)
   - ❌ 평문 저장 금지

---

## 12. 다음 단계

### 즉시 구현 가능

- [ ] 이메일 인증 활성화
- [ ] 비밀번호 재설정 기능
- [ ] 사용 이력 조회 기능
- [ ] 프로필 페이지

### 향후 계획

- [ ] 결제 시스템 (Stripe)
- [ ] 프리미엄 플랜
- [ ] PDF 생성 기능
- [ ] 템플릿 추가 (모던/클래식)
- [ ] 다국어 지원

---

## 📞 지원

- **Anthropic 문서**: https://docs.anthropic.com
- **Supabase 문서**: https://supabase.com/docs
- **Vercel 문서**: https://vercel.com/docs

---

**배포 소요 시간**: 약 30-45분  
**난이도**: ⭐⭐⭐☆☆ (중급)  
**예상 비용**: $10-20/월

**준비되셨나요? 시작하세요!** 🚀
