$('#welcome_URL').attr('href', `chrome-extension://${chrome.runtime.id}/home.html`);

$('#onoffbox').on("click", () => {
  const isChecked = $("#onoffbox").is(":checked");
  chrome.storage.local.set({ "chronoEnable": isChecked }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "updateTimerDisplay" });
      }
    });
  });
});

chrome.storage.local.get("chronoEnable", (result) => {
  if (result.chronoEnable === undefined) {
    $("#onoffbox").prop("checked", true);
    chrome.storage.local.set({ "chronoEnable": $("#onoffbox").is(":checked") });
  } else {
    $("#onoffbox").prop("checked", result.chronoEnable);
  }
});

const tokenUsageElement = document.getElementById("token-usage");
chrome.storage.local.get("tokenUsage", (result) => {
  if (result.tokenUsage) {
    tokenUsageElement.textContent = `${result.tokenUsage.toLocaleString("ko-KR")} / 1,000,000`;
  }
});