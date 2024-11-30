$('#welcome_URL').attr('href', `chrome-extension://${chrome.runtime.id}/home.html`);

$("#onoffbox").on("click", () => {
  chrome.storage.local.set({ "chronoEnable": $("#onoffbox").is(":checked") });
});