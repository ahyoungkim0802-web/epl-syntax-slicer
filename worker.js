export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }

    const { text, level } = body;
    if (!text || !level) {
      return new Response(JSON.stringify({ error: "text and level are required" }), { status: 400 });
    }

    const systemPrompt = `당신은 EPL 영어학원의 신택스 분석 어시스턴트입니다.
한국 예비중~중1 학생이 영어 문장을 의미 단위로 이해할 수 있도록,
영어 본문을 분석해 아래 정확한 JSON 형식으로만 응답합니다.

분석 규칙:
1. 입력 본문을 문장 단위로 나눈 뒤, 각 문장을 다시 의미 단위(주어/동사/목적어/보어/수식어구)로 분할합니다.
2. 의미 단위는 학생이 한 호흡에 이해할 수 있는 크기로 끊습니다. 너무 짧거나 너무 길게 자르지 마세요.
3. 각 단위의 한국어 뜻은 자연스러운 한국어 어휘로 번역합니다. "의" 남발 금지, 직역체 금지, 학생이 평소 쓰는 말투로 자연스럽게.
4. 전체 해석(translation)은 한국어 어순에 맞춰 한 문장으로 다듬어 제공합니다.
5. 5형식 패턴은 다음 중 하나로 표기: "S+V", "S+V+C", "S+V+O", "S+V+IO+DO", "S+V+O+OC"
6. 각 단위의 태그는 다음 중 하나: "S"(주어), "V"(동사), "O"(목적어), "C"(보어), "M"(수식어 — 부사구, 전치사구, 접속사 포함)
7. 어휘는 해당 레벨 학생에게 어려울 만한 단어만 2~5개 추출합니다. pos는 "n.", "v.", "adj.", "adv.", "prep.", "conj." 중 하나.
8. JSON 외 다른 텍스트(인사, 설명, 코드펜스 등)는 절대 출력하지 않습니다.

응답 형식:
{"sentences":[{"id":1,"original":"원문","pattern":"S+V+O","chunks":[{"en":"영어","ko":"한국어","tag":"S"}],"translation":"전체 해석","vocab":[{"word":"단어","meaning":"뜻","pos":"n."}]}]}`;

    const userPrompt = `레벨: ${level}\n\n본문:\n${text}\n\n위 본문을 분석해 지정된 JSON 형식으로만 응답하세요.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }]
        })
      });

      const data = await response.json();
      const aiText = data.content?.[0]?.text || "";

      return new Response(aiText, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};
