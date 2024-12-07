function checkAndSendURL() {
  const currentDomain = window.location.hostname;

  if (ALLOWED_DOMAINS.includes(currentDomain)) {
    chrome.runtime.sendMessage({
      action: "validateProblemURL",
      url: window.location.href
    });
  }
}

checkAndSendURL();