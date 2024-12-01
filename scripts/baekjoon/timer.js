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

    // 버튼 생성
    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.style.marginTop = "10px";

    const createButton = (label, minutes) => {
      const button = document.createElement("button");
      button.textContent = label;
      button.style.marginRight = "5px";
      button.addEventListener("click", () => startTimer(minutes * 60));
      return button;
    };

    buttonsWrapper.appendChild(createButton("30분", 30));
    buttonsWrapper.appendChild(createButton("1시간", 60));

    timerWrapper.appendChild(timerDisplay);
    timerWrapper.appendChild(buttonsWrapper);
    document.body.appendChild(timerWrapper);
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
let remainingSeconds = 0;

const startTimer = (seconds) => {
  stopTimer(); // 기존 타이머 정지
  remainingSeconds = seconds;

  const updateTimer = () => {
    if (remainingSeconds > 0) {
      const hours = String(Math.floor(remainingSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, "0");
      const secs = String(remainingSeconds % 60).padStart(2, "0");
      const timerDisplay = document.getElementById("timer-display");
      if (timerDisplay) {
        timerDisplay.textContent = `${hours}:${minutes}:${secs}`;
      }
      remainingSeconds--;
    } else {
      stopTimer(); // 시간이 다 되면 타이머 중지
      alert("타이머가 종료되었습니다!");
    }
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
