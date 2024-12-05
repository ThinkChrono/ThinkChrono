// 타이머 DOM 생성 및 초기화
const createTimer = () => {
  if (!document.getElementById("timer-wrapper")) {
    const timerWrapper = document.createElement("div");
    timerWrapper.id = "timer-wrapper";

    const timerHeader = document.createElement("div");
    timerHeader.id = "timer-header";

    const headerText = document.createElement("span");
    headerText.textContent = "ThinkChrono";

    const closeButton = document.createElement("button");
    closeButton.id = "timer-close-button";
    closeButton.textContent = "×";
    closeButton.addEventListener("click", removeTimer);

    timerHeader.appendChild(headerText);
    timerHeader.appendChild(closeButton);

    const contentWrapper = document.createElement("div");
    contentWrapper.id = "content-wrapper";

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.id = "buttons-wrapper";

    const createButton = (label, minutes) => {
      const button = document.createElement("button");
      button.textContent = label;
      button.className = "timer-button";
      button.addEventListener("click", () => {
        startTimer(minutes * 60);
        chrome.storage.local.set({ "originalSeconds": minutes * 60 });
        buttonsWrapper.style.display = "none";
        timerDisplayContainer.style.display = "block";
      });
      return button;
    };

    const createStopButton = () => {
      const stopButton = document.createElement("button");
      stopButton.textContent = "중지";
      stopButton.id = "stop-button";
      stopButton.addEventListener("click", () => {
        stopTimer();
        createPauseModal();
      });
      return stopButton;
    };

    const displayWrapper = document.createElement("div");
    displayWrapper.id = "display-wrapper";

    const timerDisplayContainer = document.createElement("div");
    timerDisplayContainer.id = "timer-display-container";
    timerDisplayContainer.style.display = "none";

    const timerDisplay = document.createElement("div");
    timerDisplay.id = "timer-display";
    timerDisplay.textContent = "00:00:00";

    buttonsWrapper.appendChild(createButton("30분", 30));
    buttonsWrapper.appendChild(createButton("1시간", 60));

    contentWrapper.appendChild(buttonsWrapper);

    timerDisplayContainer.appendChild(timerDisplay);
    timerDisplayContainer.appendChild(createStopButton());

    displayWrapper.appendChild(timerDisplayContainer);
    contentWrapper.appendChild(displayWrapper);

    timerWrapper.appendChild(timerHeader);
    timerWrapper.appendChild(contentWrapper);

    document.body.appendChild(timerWrapper);

    makeDraggable(timerWrapper, timerHeader);
  }
};

const makeDraggable = (element, handle) => {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  handle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  const onMouseMove = (e) => {
    if (isDragging) {
      const newLeft = e.clientX - offsetX;
      const newTop = e.clientY - offsetY;
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
    }
  };

  const onMouseUp = () => {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };
};

const removeTimer = () => {
  stopTimer();
  const timerWrapper = document.getElementById("timer-wrapper");
  if (timerWrapper) {
    timerWrapper.remove();
  }
};

let timerInterval = null;
let remainingSeconds = 0;

const startTimer = (seconds) => {
  stopTimer();
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
      stopTimer();
      createEndModal();
    }
  };

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

const updateTimerDisplay = () => {
  chrome.storage.local.get("chronoEnable", (result) => {
    const isEnabled = result.chronoEnable;

    if (isEnabled) {
      createTimer();
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
