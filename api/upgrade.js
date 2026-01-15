// API Route: /api/upgrade
// Claude API를 호출하여 경력기술서를 업그레이드합니다

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { template, inputText, reapplyOption = 'both', userId } = req.body;

        // 입력 검증
        if (!template || !inputText) {
            return res.status(400).json({ 
                error: '템플릿과 입력 텍스트가 필요합니다.' 
            });
        }

        if (inputText.length > 10000) {
            return res.status(400).json({ 
                error: '입력 텍스트가 너무 깁니다. (최대 10,000자)' 
            });
        }

        // 프롬프트 생성
        const prompt = generatePrompt(template, inputText, reapplyOption);

        // Claude API 호출
        const startTime = Date.now();
        
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
        
        // 응답 구성
        const upgradedText = data.content[0].text;
        const inputTokens = data.usage.input_tokens;
        const outputTokens = data.usage.output_tokens;
        const totalTokens = inputTokens + outputTokens;
        
        // 비용 계산 (Sonnet 4.5 기준)
        const inputCost = (inputTokens / 1000000) * 3;  // $3 per 1M tokens
        const outputCost = (outputTokens / 1000000) * 15; // $15 per 1M tokens
        const totalCost = inputCost + outputCost;

        // 성공 응답
        res.status(200).json({
            success: true,
            data: {
                upgraded_text: upgradedText,
                original_text: inputText,
                template: template,
                tokens_used: totalTokens,
                cost: totalCost.toFixed(4),
                processing_time: ((endTime - startTime) / 1000).toFixed(2) + 's'
            }
        });

    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({
            success: false,
            error: error.message || '업그레이드 처리 중 오류가 발생했습니다.'
        });
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
