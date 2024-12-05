// 타이머 DOM 생성 및 초기화
const createTimer = () => {
  if (!document.getElementById("timer-wrapper")) {
    const timerWrapper = document.createElement("div");
    timerWrapper.id = "timer-wrapper";

    // 헤더 생성
    const timerHeader = document.createElement("div");
    timerHeader.id = "timer-header";

    // 헤더 텍스트
    const headerText = document.createElement("span");
    headerText.textContent = "ThinkChrono";

    // 닫기 버튼
    const closeButton = document.createElement("button");
    closeButton.id = "timer-close-button";
    closeButton.textContent = "×"; // 닫기 버튼 표시
    closeButton.addEventListener("click", removeTimer); // 클릭 시 타이머 제거

    // 헤더 구성
    timerHeader.appendChild(headerText);
    timerHeader.appendChild(closeButton);

    // 버튼 및 타이머 표시 영역을 감싸는 컨테이너
    const contentWrapper = document.createElement("div");
    contentWrapper.id = "content-wrapper";

    // 버튼 생성
    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.id = "buttons-wrapper";

    const createButton = (label, minutes) => {
      const button = document.createElement("button");
      button.textContent = label;
      button.className = "timer-button"; // 버튼 스타일 적용
      button.addEventListener("click", () => {
        startTimer(minutes);
        chrome.storage.local.set({ "originalSeconds": minutes * 60 });
        buttonsWrapper.style.display = "none"; // 버튼 숨김
        timerDisplayContainer.style.display = "block"; // 타이머 표시
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

    // 드래그 가능하도록 이벤트 리스너 추가
    makeDraggable(timerWrapper, timerHeader);
  }
};

// 드래그 가능 로직 추가 함수
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
