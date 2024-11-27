// 아무 작업도 하지 않는 최소한의 백그라운드 스크립트
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});