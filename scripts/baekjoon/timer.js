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
        startTimer(minutes * 60);
        buttonsWrapper.style.display = "none"; // 버튼 숨김
        timerDisplay.style.display = "block"; // 타이머 표시
      });
      return button;
    };

    const timerDisplay = document.createElement("span");
    timerDisplay.id = "timer-display";
    timerDisplay.textContent = "00:00:00";
    timerDisplay.style.display = "none";

    buttonsWrapper.appendChild(createButton("half", 30));
    buttonsWrapper.appendChild(createButton("1hour", 60));

    contentWrapper.appendChild(buttonsWrapper);
    contentWrapper.appendChild(timerDisplay);

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
