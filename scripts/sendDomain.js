function checkAndSendURL() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      action: "validateProblemURL",
      url: window.location.href
    }, (response) => {
      resolve(response.isValid);
    });
  });
};