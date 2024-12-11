// background.js
importScripts("./allowedDomain.js");

let problemURL = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "validateProblemURL") {
    problemURL = request.url;
    const isValid = ALLOWED_DOMAINS.includes(new URL(problemURL).hostname)
    sendResponse({ isValid });
    return true;
  }

  if (request.action === "sendGeminiRequest") {
    const fetchGeminiResponse = async () => {
      try {
        const result = await chrome.storage.local.get("Gemini_API_Key");
        const apiKey = result.Gemini_API_Key;

        if (!apiKey) {
          throw new Error("No Gemini API Key");
        }

        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(GEMINI_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `인사해줘.` }]
            }]
          })
        });

        const data = await response.json();

        await chrome.storage.local.set({
          tokenUsage: data.usageMetadata.totalTokenCount
        });

        sendResponse({
          success: true,
          reply: data["candidates"][0]["content"]["parts"][0]["text"],
          token: [
            data.usageMetadata.promptTokenCount,
            data.usageMetadata.candidatesTokenCount
          ]
        });
      } catch (error) {
        console.error('API 호출 중 오류:', error);
        sendResponse({ success: false, error: error.message });
      }
    };

    fetchGeminiResponse();
    return true;
  }
});