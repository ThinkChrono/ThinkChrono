document.addEventListener('DOMContentLoaded', function () {
  const timerDisplay = document.getElementById('timer-display');
  let totalSeconds;
  let timerInterval;

  function startTimer(minutes) {
    totalSeconds = minutes * 60;

    timerInterval = setInterval(function () {
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = '시간 종료!';
        setTimeout(() => {
          timerDisplay.textContent = '00:00';
          window.close(); // 팝업 창 자동 닫기
        }, 3000);
        return;
      }

      let remainingMinutes = Math.floor(totalSeconds / 60);
      let remainingSeconds = totalSeconds % 60;

      timerDisplay.textContent =
        `${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

      totalSeconds--;
    }, 1000);
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startTimer') {
      startTimer(request.minutes);
    }
  });
});