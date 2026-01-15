# 🔧 CareerBoost API 통합 가이드

## 📝 개요

이 가이드는 현재 HTML 파일에 Supabase와 Claude API를 통합하는 방법을 설명합니다.

---

## 🎯 통합 방법 (3가지 옵션)

### **옵션 1: 완전 자동화 (추천)** ⭐

Claude에게 요청:
```
"index.html에 Supabase와 Claude API 연동 코드를 추가해줘.
lib/supabase-client.js와 lib/claude-api.js를 <script> 태그로 포함하고,
handleLogin, handleSignup, upgradeWithClaude 함수를 실제 API 호출로 변경해줘."
```

### **옵션 2: 수동 통합**

1. **Supabase 스크립트 추가** (이미 완료 ✅)
```html
<head>
    ...
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
```

2. **API 스크립트 포함**
```html
<body>
    ...
    <script src="lib/supabase-client.js"></script>
    <script src="lib/claude-api.js"></script>
    <script>
        // 기존 스크립트
    </script>
</body>
```

3. **환경 변수 설정**

`lib/supabase-client.js`에서:
```javascript
const SUPABASE_CONFIG = {
    url: 'https://xxxxx.supabase.co',  // 실제 URL로 변경
    anonKey: 'eyJhbGc...'  // 실제 키로 변경
};
```

`lib/claude-api.js`에서:
```javascript
const ANTHROPIC_CONFIG = {
    apiKey: 'sk-ant-api03-xxxxx',  // 실제 키로 변경
    ...
};
```

4. **기존 함수 교체**

```javascript
// 기존
async function handleLogin(event) {
    // Mock 로그인 코드...
}

// 변경 후
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginId').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = await handleSupabaseLogin(email, password);
    if (result.success) {
        updateUIForLoggedIn();
        closeModal('loginModal');
    } else {
        showError(result.error);
    }
}
```

### **옵션 3: Vercel 환경 변수 사용 (프로덕션)** 🏆

#### STEP 1: Vercel API Route 생성

`api/config.js`:
```javascript
export default function handler(req, res) {
    res.status(200).json({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });
}
```

`api/upgrade.js`:
```javascript
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { template, inputText, reapplyOption, userId } = req.body;
    
    try {
        // Claude API 호출
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4000,
                messages: [{
                    role: 'user',
                    content: `업그레이드 프롬프트...`
                }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
```

#### STEP 2: 프론트엔드 수정

```javascript
async function upgradeWithClaude(template, inputText, reapplyOption) {
    const response = await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            template,
            inputText,
            reapplyOption,
            userId: currentUser.id
        })
    });
    
    const result = await response.json();
    return result;
}
```

---

## 🔐 보안 최선책

### ❌ 절대 하지 말 것

```javascript
// 프론트엔드에 API 키 직접 노출 (위험!)
const apiKey = 'sk-ant-api03-xxxxx';  // ❌ ❌ ❌
```

### ✅ 올바른 방법

```javascript
// Vercel Serverless Function 사용
const response = await fetch('/api/upgrade', {
    method: 'POST',
    body: JSON.stringify(data)
});
```

---

## 📋 체크리스트

### 개발 환경 (로컬)
- [ ] Supabase CDN 추가
- [ ] `lib/supabase-client.js` 포함
- [ ] `lib/claude-api.js` 포함
- [ ] API 키를 코드에 직접 입력
- [ ] 로컬에서 테스트

### 프로덕션 환경 (Vercel)
- [ ] Vercel Serverless Functions 생성
- [ ] 환경 변수 설정
- [ ] API 키를 코드에서 제거
- [ ] `/api/upgrade` 엔드포인트 호출
- [ ] 배포 및 테스트

---

## 🚀 빠른 시작 (자동화)

### 단계 1: Claude에게 요청

```
"CareerBoost 프로젝트에 다음을 통합해줘:

1. Supabase 인증 (로그인/회원가입)
2. Claude API 호출 (실제 업그레이드)
3. 사용량 제한 체크
4. Vercel 환경 변수 사용

모든 Mock 코드를 실제 API 호출로 변경하고,
Vercel Serverless Functions을 생성해줘."
```

### 단계 2: 환경 변수 설정

Vercel Dashboard → Project → Settings → Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 단계 3: 배포

```bash
git add .
git commit -m "Add API integration"
git push origin main
```

Vercel이 자동으로 배포합니다!

---

## 💡 권장 아키텍처

```
사용자 브라우저
    ↓
[Vercel Serverless Function]
    ↓
[Anthropic API] + [Supabase]
```

### 장점:
- ✅ API 키 보안 (서버 사이드)
- ✅ Rate Limiting 가능
- ✅ 에러 처리 중앙화
- ✅ 로깅/모니터링 가능

---

## 🎯 다음 단계

1. **개발 환경 테스트**
   ```bash
   # 로컬에서 실행
   python -m http.server 8000
   ```

2. **Vercel Functions 생성**
   ```bash
   mkdir api
   # api/upgrade.js 생성
   ```

3. **배포 및 테스트**
   ```bash
   git push
   # Vercel 자동 배포
   ```

4. **모니터링**
   - Anthropic Console: 사용량
   - Supabase Dashboard: DB 로그
   - Vercel Logs: 에러 추적

---

## 📞 도움말

문제가 발생하면 Claude에게 다음과 같이 요청하세요:

```
"API 통합 중 [문제 설명] 에러가 발생했어요.
[에러 메시지]
어떻게 해결할 수 있을까요?"
```

---

**작성자**: Claude  
**버전**: 1.0  
**날짜**: 2026-01-14
