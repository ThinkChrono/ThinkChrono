importScripts("./allowedDomain.js");

let problemURL = null;
let propmtText = null;

const prepareResponse = async (step, callback) => {
  try {
    const result = await chrome.storage.local.get("Gemini_API_Key");
    const apiKey = result.Gemini_API_Key;

    if (!apiKey) {
      throw new Error("No Gemini API Key");
    }

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    if (step === "First Request") {
      propmtText = `
        다음은 코딩 테스트 문제에 대한 접근법을 제시하는 요청입니다.

        문제 링크: ${problemURL}

        이 문제를 해결하기 위한 알고리즘과 방법론을 설명해주세요. 단, 코드를 직접적으로 제공하지 말고, 아래의 요구사항을 충족해주세요:
        1. 문제 해결을 위한 주요 알고리즘 및 데이터 구조를 제안하세요.
        2. 제안한 알고리즘을 사용하여 어떤 방식으로 문제를 해결할 수 있는지 단계별로 설명하세요.

        힌트는 다음과 같은 형식을 따릅니다:
        - 사용해야 하는 알고리즘/방법론: 다익스트라 알고리즘
        - 해결 과정:
          1. 그래프의 모든 정점과 간선을 초기화합니다.
          2. 시작 정점에서부터 최단 거리를 계산하며 방문하지 않은 정점을 탐색합니다.
          3. 모든 정점의 최단 거리를 업데이트한 후, 결과를 출력합니다.

        문제를 정확히 이해하고, 유익하고 간결한 접근법을 제시해주세요.
      `;
    } else if (step === "Second Request") {
      propmtText = `
        다음은 동일한 코딩 테스트 문제에 대한 더 상세한 접근법 요청입니다.

        문제 링크: ${problemURL}

        첫 번째 요청에서 제공된 접근법을 기반으로, 다음을 포함하여 더 자세히 설명해주세요:
        1. 접근법에 사용되는 알고리즘의 핵심 원리와 동작 방식을 단계별로 설명하세요.
        2. 각 단계에서 필요한 데이터 구조와 그 역할을 설명하세요.
        3. 문제를 해결할 때 발생할 수 있는 일반적인 오류나 주의해야 할 점을 함께 제시하세요.

        힌트는 다음과 같은 형식을 따릅니다:
        - 알고리즘 설명: 다익스트라 알고리즘은 그래프에서 시작 정점에서 다른 모든 정점까지의 최단 거리를 찾는 알고리즘입니다. 
        - 상세한 해결 과정:
          1. **초기화**: 모든 정점의 최단 거리를 무한대로 설정하고, 시작 정점의 거리를 0으로 설정합니다.
          2. **우선순위 큐 사용**: 최소 비용 정점을 찾기 위해 우선순위 큐를 사용합니다.
          3. **최단 거리 갱신**: 큐에서 꺼낸 정점과 인접한 정점들의 거리를 계산하여 더 짧은 경로가 발견되면 업데이트합니다.
          4. **종료 조건**: 큐가 빌 때까지 과정을 반복하고 최단 거리를 출력합니다.
        - 주의사항: 
          - 음수 간선이 있을 경우 다익스트라 알고리즘은 올바르게 동작하지 않으므로 다른 알고리즘을 고려해야 합니다.
          - 우선순위 큐의 성능은 그래프의 크기에 따라 최적화해야 합니다.

        문제를 정확히 이해하고, 상세하면서 유익한 접근법을 제시해주세요.
      `;
    }

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: propmtText }]
        }]
      })
    });

    const data = await response.json();

    await chrome.storage.local.set({
      tokenUsage: data.usageMetadata.totalTokenCount
    });

    const cachedResponse = {
      reply: data["candidates"][0]["content"]["parts"][0]["text"],
      token: [
        data.usageMetadata.promptTokenCount,
        data.usageMetadata.candidatesTokenCount
      ]
    };

    await chrome.storage.local.set({
      "cachedGeminiResponse": cachedResponse
    });

    callback(cachedResponse);
  } catch (error) {
    console.error('API 준비 중 오류:', error);
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "validateProblemURL") {
    problemURL = request.url;
    const isValid = ALLOWED_DOMAINS.includes(new URL(problemURL).hostname)
    sendResponse({ isValid });
    return true;
  }

  if (request.action === "sendGeminiRequest") {
    prepareResponse(request.step, (cachedResponse) => {
      sendResponse({
        prepared: true,
        reply: cachedResponse.reply,
        token: cachedResponse.token
      });
    });
    return true;
  }
});