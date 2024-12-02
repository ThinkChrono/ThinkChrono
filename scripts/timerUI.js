// 타이머 UI 생성 함수
const createTimerUI = (startTimer, stopTimer, removeTimer) => {
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

  // 타이머 표시 영역 (초기에는 숨김)
  const timerDisplay = document.createElement("span");
  timerDisplay.id = "timer-display";
  timerDisplay.textContent = "00:00:00";
  timerDisplay.style.display = "none"; // 초기에는 숨김

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

  buttonsWrapper.appendChild(createButton("30minute", 30));
  buttonsWrapper.appendChild(createButton("1hour", 60));

  // 요소 추가
  timerWrapper.appendChild(timerHeader);
  timerWrapper.appendChild(buttonsWrapper);
  timerWrapper.appendChild(timerDisplay);

  return timerWrapper;
};
