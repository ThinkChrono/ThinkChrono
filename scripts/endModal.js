const createEndModal = () => {
  if (document.getElementById("end-modal")) return;

  const modal = document.createElement("div");
  modal.id = "end-modal";

  const endContent = document.createElement("div");
  endContent.id = "end-content";

  const endText = document.createElement("h2");
  endText.textContent = "타이머가 종료되었습니다!";
  endText.id = "end-text";

  const endButtonWrapper = document.createElement("div");
  endButtonWrapper.id = "end-button-wrapper";

  const endButton = document.createElement("button");
  endButton.textContent = "처음으로";
  endButton.className = "modal-button end-button";
  endButton.addEventListener("click", () => {
    removeTimer();
    if (!document.getElementById("timer-wrapper")) {
      createTimer();
    }
    removeEndModal();
  });

  endButtonWrapper.appendChild(endButton);

  endContent.appendChild(endText);
  endContent.appendChild(endButtonWrapper);
  modal.appendChild(endContent);

  document.body.appendChild(modal);

  playSound();
};

const removeEndModal = () => {
  const modal = document.getElementById("end-modal");
  if (modal) {
    modal.remove();
  }
};

function playSound() {
  try {
    const audio = new Audio(chrome.runtime.getURL("assets/sound/alarm.mp3"));
    audio.volume = 0.5;
    audio.play().catch((error) => console.error("오디오 재생 실패:", error));
  } catch (error) {
    console.error("playSound function error: ", error);
  }
}