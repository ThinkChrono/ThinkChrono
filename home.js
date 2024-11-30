const apiKey = () => {
  return $("#key").val().trim();
};

const isValidApiKey = (key) => {
  const pattern = /^[a-zA-Z0-9]{39}$/;
  return pattern.test(key);
};

$("#key").on("input", () => {
  const key = apiKey();
  $("#hook_button").prop("disabled", !key);
});

$("#hook_button").on("click", () => {
  const key = apiKey();
  if (!key) {
    $("#error").text("No Gemini API key added - Enter the your API key").show();
    $("#key").focus();
  } else if (!isValidApiKey(key)) {
    $("#error").text("No Gemini API key pattern - Enter the your API key").show();
    $("#key").focus();
  } else {
    $("#error").hide();
    $("#success").text("Attempting to connect Gemini... Please wait.").show();
  }

  // chrome.storage.local.set({ "Gemini_API_Key": key }, () => {
  //   console.log(`Gemini API Key: ${key}`);
  // });

  // chrome.storage.local.get("Gemini_API_Key", (result) => {
  //   console.log(result.Gemini_API_Key);
  // })

  chrome.storage.local.set({ "Gemini_API_Key": key }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error saving API Key:", chrome.runtime.lastError);
    } else {
      console.log(`Gemini API Key saved: ${key}`);
      chrome.storage.local.get("Gemini_API_Key", (result) => {
        console.log("Retrieved Gemini API Key:", result.Gemini_API_Key);
      });
    }
  });
});