let timerInterval = null;
let remainingSeconds = 0;

const startTimer = async (seconds) => {
  stopTimer();
  const isValid = await checkAndSendURL();
  console.log("timer.js", isValid)

  remainingSeconds = seconds;
  const halfTime = Math.floor(seconds / 2);
  const quarterTime = Math.floor(seconds / 4);

  const updateTimer = () => {
    if (remainingSeconds >= 0) {
      const hours = String(Math.floor(remainingSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, "0");
      const secs = String(remainingSeconds % 60).padStart(2, "0");
      const timerDisplay = document.getElementById("timer-display");

      if (timerDisplay) {
        timerDisplay.textContent = `${hours}:${minutes}:${secs}`;
      }

      if (remainingSeconds === halfTime && isValid) {
        chrome.runtime.sendMessage({
          action: "sendGeminiRequest",
          step: "First Request",
        });
      }

      if (remainingSeconds === quarterTime && isValid) {
        chrome.runtime.sendMessage({
          action: "sendGeminiRequest",
          step: "Second Request",
        });
      }

      remainingSeconds--;
    } else {
      stopTimer();
      createEndModal();
    }
  };

  updateTimer();

  if (!timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);
  }
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const resumeTimer = () => {
  if (!timerInterval && remainingSeconds > 0) {
    startTimer(remainingSeconds);
  }
};

const removeTimer = () => {
  stopTimer();
  const timerWrapper = document.getElementById("timer-wrapper");
  if (timerWrapper) {
    timerWrapper.remove();
  }
};

const updateTimerDisplay = () => {
  chrome.storage.local.get("chronoEnable", (result) => {
    const isEnabled = result.chronoEnable;

    if (isEnabled) {
      TimerDesign.createTimer();
    } else {
      removeTimer();
    }
  });
};

updateTimerDisplay();

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateTimerDisplay") {
    updateTimerDisplay();
  }
});
