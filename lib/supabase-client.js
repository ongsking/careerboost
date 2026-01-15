// Supabase Client 초기화
// 이 파일을 index.html의 <script> 태그 안에 포함하세요

const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL', // Vercel 환경변수로 대체됨
    anonKey: 'YOUR_SUPABASE_ANON_KEY' // Vercel 환경변수로 대체됨
};

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
);

// 인증 상태 변화 감지
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event);
    if (event === 'SIGNED_IN') {
        handleAuthChange(session);
    } else if (event === 'SIGNED_OUT') {
        handleSignOut();
    }
});

// 로그인 처리
async function handleSupabaseLogin(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        // 사용자 정보 가져오기
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userError) throw userError;

        // 전역 상태 업데이트
        currentUser = {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            isAdmin: userData.is_admin
        };
        isLoggedIn = true;

        // localStorage에 저장
        localStorage.setItem('careerboost_user', JSON.stringify(currentUser));
        localStorage.setItem('careerboost_token', data.session.access_token);

        return { success: true, user: currentUser };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

// 회원가입 처리
async function handleSupabaseSignup(email, username, password) {
    try {
        // 1. Supabase Auth에 사용자 생성
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (authError) throw authError;

        // 2. users 테이블에 사용자 정보 저장
        const passwordHash = await bcryptHash(password); // bcrypt 필요

        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([
                {
                    id: authData.user.id,
                    email: email,
                    username: username,
                    password_hash: passwordHash,
                    is_admin: false
                }
            ])
            .select()
            .single();

        if (userError) throw userError;

        // 3. usage_limits 초기화
        const { error: limitError } = await supabase
            .from('usage_limits')
            .insert([
                {
                    user_id: authData.user.id,
                    daily_limit: 5,
                    monthly_limit: 50,
                    daily_count: 0,
                    monthly_count: 0
                }
            ]);

        if (limitError) throw limitError;

        return { success: true, user: userData };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
    }
}

// 사용량 체크
async function checkUsageLimit(userId) {
    try {
        const { data, error } = await supabase
            .from('usage_limits')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().toISOString().substring(0, 7);

        // 날짜 리셋 체크
        if (data.last_reset_date !== today) {
            // 일일 카운트 리셋
            const { error: resetError } = await supabase
                .from('usage_limits')
                .update({
                    daily_count: 0,
                    last_reset_date: today
                })
                .eq('user_id', userId);

            if (resetError) throw resetError;
            data.daily_count = 0;
        }

        if (data.last_reset_month.substring(0, 7) !== thisMonth) {
            // 월간 카운트 리셋
            const { error: resetError } = await supabase
                .from('usage_limits')
                .update({
                    monthly_count: 0,
                    last_reset_month: thisMonth + '-01'
                })
                .eq('user_id', userId);

            if (resetError) throw resetError;
            data.monthly_count = 0;
        }

        // 제한 체크
        if (data.daily_count >= data.daily_limit) {
            return {
                allowed: false,
                reason: 'daily_limit',
                message: `일일 사용 한도(${data.daily_limit}회)를 초과했습니다.`
            };
        }

        if (data.monthly_count >= data.monthly_limit) {
            return {
                allowed: false,
                reason: 'monthly_limit',
                message: `월간 사용 한도(${data.monthly_limit}회)를 초과했습니다.`
            };
        }

        return {
            allowed: true,
            dailyRemaining: data.daily_limit - data.daily_count,
            monthlyRemaining: data.monthly_limit - data.monthly_count
        };
    } catch (error) {
        console.error('Usage check error:', error);
        return { allowed: false, error: error.message };
    }
}

// 사용량 증가
async function incrementUsage(userId) {
    try {
        const { data, error } = await supabase.rpc('increment_usage', {
            p_user_id: userId
        });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Increment usage error:', error);
        return { success: false, error: error.message };
    }
}

// 사용 로그 기록
async function logUsage(userId, template, inputLength, outputLength, tokensUsed, cost, status, errorMessage = null) {
    try {
        const { error } = await supabase
            .from('usage_logs')
            .insert([
                {
                    user_id: userId,
                    template: template,
                    input_length: inputLength,
                    output_length: outputLength,
                    tokens_used: tokensUsed,
                    cost: cost,
                    status: status,
                    error_message: errorMessage
                }
            ]);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Log usage error:', error);
        return { success: false, error: error.message };
    }
}

// 간단한 bcrypt 대체 (프로덕션에서는 서버 사이드 처리 권장)
async function bcryptHash(password) {
    // Web Crypto API 사용
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
