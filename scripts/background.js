importScripts("./allowedDomain.js");

let problemURL = null;

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "validateProblemURL") {
    problemURL = request.url;
    if (ALLOWED_DOMAINS.includes(new URL(problemURL).hostname)) {
      sendResponse({ isValid: true })
    } else {
      sendResponse({ isValid: false });
    }
  }

  if (request.action === "sendGeminiRequest") {
    try {
      const step = request.step;
      console.log(`Gemini Request Step: ${step}`);

      chrome.storage.local.get("Gemini_API_Key", (result) => {
        const apiKey = result.Gemini_API_Key;
        if (!apiKey) {
          console.error("Not save Gemini API Key");
        }
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        fetch(GEMINI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `인사해줘.`
              }]
            }]
          })
        }).then((response) => {
          return response.json()
        }).then((result) => {
          console.log(result.usageMetadata.totalTokenCount)
          chrome.storage.local.set({ tokenUsage: result.usageMetadata.totalTokenCount });
          // chrome.runtime.sendMessage({
          //   action: "geminiTokenUsage",
          //   tokenUsage: {
          //     promptTokenCount: result.usageMetadata.promptTokenCount,
          //     candidatesTokenCount: result.usageMetadata.candidatesTokenCount,
          //     totalTokenCount: result.usageMetadata.totalTokenCount
          //   }
          // });
          // console.log(result["candidates"][0]["content"]["parts"][0]["text"])
        }).catch((error) => {
          console.error('API 호출 중 오류:', error);
        });
      });
    } catch (error) {
      console.error('API 호출 중 오류:', error);
    }
  }
});

