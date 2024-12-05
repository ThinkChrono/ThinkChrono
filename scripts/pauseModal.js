// 모달 생성 및 추가
const createPauseModal = () => {
  // 모달이 이미 있으면 생성하지 않음
  if (document.getElementById("timer-modal")) return;

  const modal = document.createElement("div");
  modal.id = "timer-modal";

  const modalContent = document.createElement("div");
  modalContent.id = "modal-content";

  const modalText = document.createElement("h2");
  modalText.textContent = "타이머가 중지됩니다.";
  modalText.id = "modal-text";

  const modalButtonWrapper = document.createElement("div");
  modalButtonWrapper.id = "modal-button-wrapper";

  // 초기화 버튼
  const resetButton = document.createElement("button");
  resetButton.textContent = "초기화";
  resetButton.className = "modal-button reset-button";
  resetButton.addEventListener("click", () => {
    resetTimer();
    removePauseModal();
  });

  // 취소 버튼
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "취소";
  cancelButton.className = "modal-button cancel-button";
  cancelButton.addEventListener("click", () => {
    resumeTimer();
    removePauseModal();
  });

  modalButtonWrapper.appendChild(resetButton);
  modalButtonWrapper.appendChild(cancelButton);

  modalContent.appendChild(modalText);
  modalContent.appendChild(modalButtonWrapper);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      removePauseModal();
    }
  });
};

const resetTimer = () => {
  chrome.storage.local.get("originalSeconds", (result) => {
    if (result.originalSeconds > 0) {
      startTimer(result.originalSeconds);
    }
  });
};

const removePauseModal = () => {
  const modal = document.getElementById("timer-modal");
  if (modal) {
    modal.remove();
  }
};

