const createReplyModal = (reply, token) => {
  if (document.getElementById("reply-modal")) return;

  const modal = document.createElement("div");
  modal.id = "reply-modal";

  const modalContent = document.createElement("div");
  modalContent.id = "reply-content";

  const modalToken = document.createElement("p");
  modalToken.id = "modal-token";
  modalToken.textContent = `입력 토큰: ${token[0]} 출력 토큰: ${token[1]}`;

  const modalText = document.createElement("p");
  modalText.id = "reply-text";
  modalText.textContent = reply || "답변을 불러올 수 없습니다.";

  const modalButtonWrapper = document.createElement("div");
  modalButtonWrapper.id = "modal-button-wrapper";

  const closeButton = document.createElement("button");
  closeButton.textContent = "닫기";
  closeButton.className = "modal-button close-button";
  closeButton.addEventListener("click", () => {
    resumeTimer();
    removeGeminiModal();
  });

  modalButtonWrapper.appendChild(closeButton);
  modalContent.appendChild(modalToken);
  modalContent.appendChild(modalText);
  modalContent.appendChild(modalButtonWrapper);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};

const removeGeminiModal = () => {
  const modal = document.getElementById("reply-modal");
  if (modal) {
    modal.remove();
  }
};