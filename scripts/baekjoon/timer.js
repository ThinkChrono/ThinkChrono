// 타이머 DOM 생성 및 초기화
const createTimer = () => {
  if (!document.getElementById("timer-wrapper")) {
    const timerWrapper = document.createElement("div");
    timerWrapper.id = "timer-wrapper";
    timerWrapper.style.position = "fixed";
    timerWrapper.style.bottom = "20px";
    timerWrapper.style.right = "20px";
    timerWrapper.style.backgroundColor = "#fff";
    timerWrapper.style.border = "1px solid #ccc";
    timerWrapper.style.padding = "10px";
    timerWrapper.style.borderRadius = "5px";
    timerWrapper.style.zIndex = "9999";

    const timerDisplay = document.createElement("span");
    timerDisplay.id = "timer-display";
    timerDisplay.style.fontSize = "16px";
    timerDisplay.style.fontWeight = "bold";
    timerDisplay.textContent = "00:00:00";

    timerWrapper.appendChild(timerDisplay);
    document.body.appendChild(timerWrapper);

    // 타이머 시작
    startTimer();
  }
};

// 타이머 DOM 제거
const removeTimer = () => {
  stopTimer(); // 타이머 중지
  const timerWrapper = document.getElementById("timer-wrapper");
  if (timerWrapper) {
    timerWrapper.remove(); // DOM 제거
  }
};

// 타이머 시작 로직
let timerInterval = null;
const startTimer = () => {
  let seconds = 0;

  const updateTimer = () => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    const timerDisplay = document.getElementById("timer-display");
    if (timerDisplay) {
      timerDisplay.textContent = `${hours}:${minutes}:${secs}`;
    }
    seconds++;
  };

  if (!timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);
  }
};

// 타이머 중지
const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

// chronoEnable 상태에 따라 타이머 표시/숨기기
const updateTimerDisplay = () => {
  chrome.storage.local.get("chronoEnable", (result) => {
    const isEnabled = result.chronoEnable;

    if (isEnabled) {
      createTimer(); // 타이머 활성화
    } else {
      removeTimer(); // 타이머 제거
    }
  });
};

// 초기 상태 확인 및 타이머 표시/숨기기
updateTimerDisplay();

// popup.js에서 메시지를 받아 타이머 상태를 업데이트
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateTimerDisplay") {
    updateTimerDisplay();
  }
});
