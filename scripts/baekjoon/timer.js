let timerInterval = null;
let remainingSeconds = 0;

const startTimer = async (seconds) => {
  stopTimer();
  TimerDesign.stopButtonActive();

  const isValid = await checkAndSendURL();

  remainingSeconds = seconds;

  const result = await chrome.storage.local.get("originalSeconds");
  const halfTime = Math.floor(result.originalSeconds / 2);
  const quarterTime = Math.floor(result.originalSeconds / 4);

  const updateTimer = () => {
    if (remainingSeconds >= 0) {
      const hours = String(Math.floor(remainingSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, "0");
      const secs = String(remainingSeconds % 60).padStart(2, "0");
      const timerDisplay = document.getElementById("timer-display");

      if (timerDisplay) {
        timerDisplay.textContent = `${hours}:${minutes}:${secs}`;
      }

      if (isValid) {
        if (remainingSeconds === halfTime) {
          stopTimer();
          sendGeminiRequest("First Request");
        }

        if (remainingSeconds === quarterTime) {
          stopTimer();
          sendGeminiRequest("Second Request");
        }
      }

      remainingSeconds--;
    } else {
      stopTimer();
      createEndModal();
      TimerDesign.stopButtonDisabled();
    }
  };

  const sendGeminiRequest = (step) => {
    showLoadingIndicator();
    playSound();
    chrome.runtime.sendMessage(
      { action: "sendGeminiRequest", step },
      (response) => {
        if (response && response.prepared) {
          hideLoadingIndicator();
          createReplyModal(response.reply, response.token);
        }
      }
    );
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
  TimerDesign.stopButtonDisabled();
};

const resumeTimer = () => {
  if (!timerInterval && remainingSeconds > 0) {
    startTimer(remainingSeconds);
    TimerDesign.stopButtonActive();
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
