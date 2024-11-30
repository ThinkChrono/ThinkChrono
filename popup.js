$('#welcome_URL').attr('href', `chrome-extension://${chrome.runtime.id}/home.html`);

$("#onoffbox").on("click", () => {
  chrome.storage.local.set({ "chronoEnable": $("#onoffbox").is(":checked") });
});

chrome.storage.local.get("chronoEnable", (result) => {
  if (result.chronoEnable === undefined) {
    $("#onoffbox").prop("checked", true);
    chrome.storage.local.set({ "chronoEnable": $("#onoffbox").is(":checked") });
  } else {
    $("#onoffbox").prop("checked", result.chronoEnable);
    chrome.storage.local.set({ "chronoEnable": $("#onoffbox").is(":checked") });
  }
});