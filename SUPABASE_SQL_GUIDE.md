# 🗄️ Supabase 데이터베이스 설정 상세 가이드

## 📍 STEP 2-6: SQL 실행 상세 안내

### 🎯 목표
CareerBoost에서 사용할 데이터베이스 테이블을 생성합니다.

---

## 📋 단계별 가이드

### **1. SQL Editor 열기**

1. Supabase 프로젝트 대시보드에서
2. 좌측 메뉴 → **"SQL Editor"** 클릭
3. 화면 중앙에 SQL 입력 창이 나타납니다

![SQL Editor 위치]
```
왼쪽 메뉴:
┌─────────────────┐
│ 🏠 Home         │
│ 🔧 Table Editor │
│ ⚡ SQL Editor   │ ← 여기 클릭!
│ 🔐 Auth         │
│ 📦 Storage      │
└─────────────────┘
```

---

### **2. 새 Query 시작**

1. SQL Editor 화면에서 **"New query"** 버튼 클릭
2. 또는 기존 쿼리 창이 있으면 그대로 사용

---

### **3. SQL 코드 복사 & 붙여넣기**

아래 전체 SQL 코드를 **한 번에** 복사하여 붙여넣으세요:

```sql
-- ==============================================
-- CareerBoost 데이터베이스 스키마
-- ==============================================

-- 1. 사용자 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 사용량 로그 테이블
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

-- 3. 사용량 제한 테이블
CREATE TABLE usage_limits (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_limit INTEGER DEFAULT 5,
  monthly_limit INTEGER DEFAULT 50,
  daily_count INTEGER DEFAULT 0,
  monthly_count INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  last_reset_month DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)
);

-- 4. 인덱스 생성 (성능 최적화)
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX idx_usage_logs_status ON usage_logs(status);

-- 5. RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

-- 6. RLS 정책: 사용자는 자신의 데이터만 볼 수 있음
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own usage logs"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs"
  ON usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own limits"
  ON usage_limits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own limits"
  ON usage_limits FOR UPDATE
  USING (auth.uid() = user_id);

-- 7. 자동 타임스탬프 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. 타임스탬프 트리거 설정
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. 사용량 증가 함수 (원자적 업데이트)
CREATE OR REPLACE FUNCTION increment_usage(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE usage_limits
  SET 
    daily_count = daily_count + 1,
    monthly_count = monthly_count + 1
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- 완료!
SELECT 'CareerBoost 데이터베이스 설정 완료!' AS message;
```

---

### **4. SQL 실행하기**

1. 위 SQL 코드를 전부 선택 (Ctrl+A 또는 Cmd+A)
2. **"Run"** 버튼 클릭 (또는 Ctrl+Enter / Cmd+Enter)
3. 실행 시간: 약 2-3초

---

### **5. 성공 확인**

실행이 성공하면 화면 하단에 다음과 같이 표시됩니다:

```
✅ Success. No rows returned

또는

✅ Success
   message
   ─────────────────────────────────────
   CareerBoost 데이터베이스 설정 완료!
```

---

### **6. 생성된 테이블 확인**

1. 좌측 메뉴 → **"Table Editor"** 클릭
2. 다음 테이블들이 보여야 합니다:
   ```
   ├── 📋 users           (3개 행)
   ├── 📋 usage_logs      (0개 행)
   └── 📋 usage_limits    (0개 행)
   ```

3. **users** 테이블 클릭하면 다음 컬럼들이 보입니다:
   ```
   id              (UUID)
   email           (TEXT)
   username        (TEXT)
   password_hash   (TEXT)
   is_admin        (BOOLEAN)
   created_at      (TIMESTAMP)
   updated_at      (TIMESTAMP)
   ```

---

## 🔍 각 테이블 설명

### **1. users 테이블**
사용자 계정 정보를 저장합니다.

| 컬럼 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `id` | UUID | 고유 ID (자동생성) | `a1b2c3d4-...` |
| `email` | TEXT | 이메일 (중복 불가) | `user@example.com` |
| `username` | TEXT | 사용자명 (중복 불가) | `woosang87` |
| `password_hash` | TEXT | 비밀번호 해시 | `$2b$10$...` |
| `is_admin` | BOOLEAN | 관리자 여부 | `true` / `false` |
| `created_at` | TIMESTAMP | 생성 일시 | `2026-01-14 10:30:00` |
| `updated_at` | TIMESTAMP | 수정 일시 | `2026-01-14 10:30:00` |

### **2. usage_logs 테이블**
AI 업그레이드 사용 기록을 저장합니다.

| 컬럼 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `id` | UUID | 로그 ID | `x1y2z3...` |
| `user_id` | UUID | 사용자 ID | `a1b2c3...` |
| `template` | TEXT | 템플릿 종류 | `minimal` |
| `input_length` | INTEGER | 입력 글자 수 | `1500` |
| `output_length` | INTEGER | 출력 글자 수 | `2300` |
| `tokens_used` | INTEGER | 사용 토큰 수 | `1234` |
| `cost` | DECIMAL | 비용 (USD) | `0.0456` |
| `status` | TEXT | 상태 | `success` / `failed` |
| `error_message` | TEXT | 에러 메시지 (실패 시) | `API key invalid` |
| `created_at` | TIMESTAMP | 실행 시각 | `2026-01-14 15:20:30` |

### **3. usage_limits 테이블**
사용자별 사용량 제한을 관리합니다.

| 컬럼 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `user_id` | UUID | 사용자 ID | `a1b2c3...` |
| `daily_limit` | INTEGER | 일일 제한 | `5` |
| `monthly_limit` | INTEGER | 월간 제한 | `50` |
| `daily_count` | INTEGER | 오늘 사용 횟수 | `3` |
| `monthly_count` | INTEGER | 이번 달 사용 횟수 | `12` |
| `last_reset_date` | DATE | 마지막 일일 리셋 | `2026-01-14` |
| `last_reset_month` | DATE | 마지막 월간 리셋 | `2026-01-01` |

---

## ⚠️ 자주 발생하는 오류

### **오류 1: "relation already exists"**

**원인:** 테이블이 이미 존재함

**해결:**
```sql
-- 기존 테이블 삭제 (주의: 데이터도 삭제됨)
DROP TABLE IF EXISTS usage_logs CASCADE;
DROP TABLE IF EXISTS usage_limits CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 그리고 다시 위의 전체 SQL 실행
```

### **오류 2: "permission denied"**

**원인:** 권한 부족

**해결:**
1. Supabase 프로젝트 대시보드 확인
2. 본인이 Owner인지 확인
3. 다른 사람이 만든 프로젝트는 권한 요청 필요

### **오류 3: "syntax error"**

**원인:** SQL 코드 일부만 복사됨

**해결:**
1. 위의 전체 SQL 코드를 **처음부터 끝까지** 모두 복사
2. 특수문자나 주석(`--`)도 포함
3. 다시 실행

---

## ✅ 확인 체크리스트

SQL 실행 후 다음을 확인하세요:

- [ ] "Success" 메시지 표시
- [ ] Table Editor에 3개 테이블 생성 (users, usage_logs, usage_limits)
- [ ] users 테이블에 7개 컬럼 존재
- [ ] RLS가 활성화되어 있음 (테이블 옆에 🔒 아이콘)

---

## 🎯 다음 단계

SQL 실행이 성공했다면:

1. ✅ **STEP 2-6 완료!**
2. → DEPLOYMENT_GUIDE.md의 **STEP 3**으로 이동
3. → GitHub에 코드 업로드

---

## 💡 추가 팁

### **테이블 구조 확인 SQL**

```sql
-- users 테이블 구조 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users';

-- 모든 테이블 목록
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### **테스트 데이터 삽입 (선택)**

```sql
-- 테스트 사용자 추가
INSERT INTO users (email, username, password_hash, is_admin)
VALUES (
  'test@example.com',
  'testuser',
  '$2b$10$abcdefghijklmnopqrstuvwxyz', -- 임시 해시
  false
);

-- 생성 확인
SELECT * FROM users;
```

---

## 🔧 문제 해결

### "아무것도 안 보여요!"

1. **새로고침** (F5 또는 Cmd+R)
2. Table Editor 다시 열기
3. 프로젝트 재선택

### "Run 버튼이 안 보여요!"

1. SQL 코드가 입력 창에 있는지 확인
2. 마우스로 SQL 코드 일부를 선택
3. 화면 우측 상단에 "Run" 또는 "▶️" 버튼 확인

### "실행했는데 에러가 나요!"

에러 메시지를 복사해서 Claude에게 질문:
```
"Supabase SQL 실행 중 다음 에러가 발생했어요:
[에러 메시지 붙여넣기]
어떻게 해결하나요?"
```

---

## 📸 스크린샷 가이드

### 1. SQL Editor 위치
```
Supabase Dashboard
┌──────────────────────────────────────┐
│ ≡ Menu                               │
│                                      │
│ 🏠 Home                              │
│ 📊 Database                          │
│ 🔧 Table Editor                      │
│ ⚡ SQL Editor        ← 여기 클릭!    │
│ 🔐 Authentication                    │
│ 📦 Storage                           │
│ ⚙️  Settings                         │
└──────────────────────────────────────┘
```

### 2. SQL 입력 창
```
┌────────────────────────────────────────┐
│ New Query                              │
├────────────────────────────────────────┤
│ -- SQL 코드를 여기에 붙여넣으세요      │
│ CREATE TABLE users (                   │
│   id UUID PRIMARY KEY...               │
│ );                                     │
│                                        │
└────────────────────────────────────────┘
     [Run ▶️]  [Save 💾]  [Format 📐]
```

### 3. 성공 메시지
```
┌────────────────────────────────────────┐
│ ✅ Success. No rows returned           │
│                                        │
│ Execution time: 0.234s                 │
│ Rows affected: 0                       │
└────────────────────────────────────────┘
```

---

## 🎉 완료!

SQL 실행이 성공했다면 데이터베이스 설정이 완료되었습니다!

**다음 단계:**
→ DEPLOYMENT_GUIDE.md의 **STEP 3 (GitHub 업로드)** 로 이동

---

**작성자**: Claude  
**버전**: 1.0  
**날짜**: 2026-01-15

**질문이 있으면 언제든 물어보세요!** 💬
