// Claude API 호출 함수
// 이 파일을 index.html에 포함하세요

const ANTHROPIC_CONFIG = {
    apiKey: 'YOUR_ANTHROPIC_API_KEY', // Vercel 환경변수로 대체됨
    apiUrl: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-20250514',
    maxTokens: 4000
};

/**
 * Claude API를 호출하여 경력기술서를 업그레이드합니다
 * @param {string} template - 선택한 템플릿 (minimal, creative, formal)
 * @param {string} inputText - 입력 텍스트
 * @param {string} reapplyOption - 재작업 옵션 (design, content, both)
 * @returns {Promise<Object>} 업그레이드된 결과
 */
async function upgradeWithClaude(template, inputText, reapplyOption = 'both') {
    try {
        // 1. 로그인 체크
        if (!isLoggedIn || !currentUser) {
            throw new Error('로그인이 필요합니다.');
        }

        // 2. 관리자가 아닌 경우 사용량 체크
        if (!currentUser.isAdmin) {
            const usageCheck = await checkUsageLimit(currentUser.id);
            if (!usageCheck.allowed) {
                throw new Error(usageCheck.message || '사용 한도를 초과했습니다.');
            }
        }

        // 3. 프롬프트 생성
        const prompt = generatePrompt(template, inputText, reapplyOption);

        // 4. Claude API 호출
        const startTime = Date.now();
        
        const response = await fetch(ANTHROPIC_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_CONFIG.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: ANTHROPIC_CONFIG.model,
                max_tokens: ANTHROPIC_CONFIG.maxTokens,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API 호출 실패');
        }

        const data = await response.json();
        const endTime = Date.now();
        
        // 5. 응답 파싱
        const upgradedText = data.content[0].text;
        const inputTokens = data.usage.input_tokens;
        const outputTokens = data.usage.output_tokens;
        const totalTokens = inputTokens + outputTokens;
        
        // 6. 비용 계산 (Sonnet 4.5 기준)
        const inputCost = (inputTokens / 1000000) * 3;  // $3 per 1M tokens
        const outputCost = (outputTokens / 1000000) * 15; // $15 per 1M tokens
        const totalCost = inputCost + outputCost;

        // 7. 사용량 증가 (관리자 제외)
        if (!currentUser.isAdmin) {
            await incrementUsage(currentUser.id);
        }

        // 8. 사용 로그 기록
        await logUsage(
            currentUser.id,
            template,
            inputText.length,
            upgradedText.length,
            totalTokens,
            totalCost.toFixed(4),
            'success',
            null
        );

        // 9. 결과 반환
        return {
            success: true,
            data: {
                upgraded_text: upgradedText,
                original_text: inputText,
                template: template,
                tokens_used: totalTokens,
                cost: totalCost.toFixed(4),
                processing_time: ((endTime - startTime) / 1000).toFixed(2) + 's'
            }
        };

    } catch (error) {
        console.error('Claude API error:', error);

        // 실패 로그 기록
        if (isLoggedIn && currentUser) {
            await logUsage(
                currentUser.id,
                template,
                inputText.length,
                0,
                0,
                0,
                'failed',
                error.message
            );
        }

        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 프롬프트 생성 함수
 */
function generatePrompt(template, inputText, reapplyOption) {
    const systemPrompts = {
        minimal: `당신은 전문 경력기술서 작성 전문가입니다. 미니멀하고 프로페셔널한 스타일로 경력기술서를 업그레이드해주세요.

**업그레이드 원칙:**
1. STAR 방법론 적용 (Situation, Task, Action, Result)
2. 정량적 성과 강조 (숫자, 퍼센트, 금액)
3. 명확한 행동 동사 사용
4. 불필요한 수식어 제거
5. 간결하고 임팩트 있는 문장

**금지 사항:**
- 과장하거나 사실이 아닌 내용 추가 금지
- 원본의 핵심 정보 누락 금지
- 지나치게 형식적인 표현 지양`,

        creative: `당신은 창의적인 경력기술서 작성 전문가입니다. 현대적이고 독창적인 스타일로 경력기술서를 업그레이드해주세요.

**업그레이드 원칙:**
1. 스토리텔링 기법 활용
2. 개성과 차별성 강조
3. 비주얼적 구조 (이모지 활용 가능)
4. 트렌디한 표현과 키워드
5. 독자의 관심을 끄는 도입부

**금지 사항:**
- 과도한 창의성으로 전문성 손상 금지
- 핵심 경력 정보 누락 금지`,

        formal: `당신은 고급 비즈니스 문서 작성 전문가입니다. 클래식하고 격식있는 스타일로 경력기술서를 업그레이드해주세요.

**업그레이드 원칙:**
1. 격식있는 비즈니스 용어 사용
2. 체계적이고 논리적인 구조
3. 명확한 성과 중심 서술
4. 전문적인 톤앤매너 유지
5. 산업 표준 용어 활용

**금지 사항:**
- 구어체나 캐주얼한 표현 금지
- 불필요한 감정 표현 배제`
    };

    const reapplyInstructions = {
        design: '\n\n**재작업 지시:** 디자인과 톤앤매너만 수정하고, 내용은 그대로 유지하세요.',
        content: '\n\n**재작업 지시:** 내용과 성과만 강화하고, 전체 구조는 유지하세요.',
        both: '\n\n**재작업 지시:** 디자인과 내용 모두 전면 재작업하세요.'
    };

    const systemPrompt = systemPrompts[template] || systemPrompts.minimal;
    const reapplyInstruction = reapplyInstructions[reapplyOption] || '';

    return `${systemPrompt}${reapplyInstruction}

**입력된 경력기술서:**
${inputText}

**출력 형식:**
업그레이드된 경력기술서를 직접 출력하세요. 부연 설명이나 메타 정보는 제외하고, 순수하게 업그레이드된 텍스트만 출력하세요.`;
}

/**
 * Mock 데이터 생성 (개발/테스트용)
 */
function generateMockResult(template, inputText) {
    return {
        success: true,
        data: {
            upgraded_text: `[${template.toUpperCase()} 템플릿 적용]

📊 프로젝트 매니저 | 10년+ 경력

## 핵심 역량
• 데이터 기반 의사결정 및 KPI 관리
• 크로스펀셔널 팀 리드 (50명+ 규모)
• 0→1 프로덕트 런칭 경험 다수

## 주요 성과

### 네이버 - 서비스 PM (2020-2024)
**프로젝트: 신규 커머스 플랫폼 런칭**

📈 **성과:**
- 월 GMV 120억원 달성 (론칭 6개월)
- 셀러 2,500개사 유치
- MAU 50만명 돌파

🎯 **담당 역할:**
- 서비스 전략 수립 및 로드맵 기획
- UI/UX 설계 (15개 화면)
- 데이터 분석 및 전환율 최적화

---

### 쿠팡 - 상품기획 PM (2017-2020)
**프로젝트: 추천 알고리즘 고도화**

📈 **성과:**
- 클릭율 +34% 개선
- 구매 전환율 +18% 향상
- 연간 매출 기여: 약 100억원

🎯 **담당 역할:**
- A/B 테스트 설계 및 실행 (50+ 실험)
- 데이터 사이언스팀 협업
- 알고리즘 성능 모니터링

---

## 교육
서울대학교 컴퓨터공학 학사 (2013-2017)

## 언어
한국어 (Native) | 영어 (Business Level)`,
            original_text: inputText,
            template: template,
            tokens_used: 1234,
            cost: '0.0123',
            processing_time: '2.5s'
        }
    };
}
