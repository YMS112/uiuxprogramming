const serviceName = "Random Match";
let isSubscribed = false;
let submitCount = 0;

function makeSubscribeMessage(email, subscribed) {
    if (subscribed == true) {
        return email + "로 신청이 완료되었습니다.";
    }
    return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
    event.preventDefault();

    const subscriberEmail = emailInput.value.trim();

    if (subscriberEmail === "") {
        subscribeMessage.textContent = "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;

    subscribeMessage.textContent = makeSubscribeMessage(subscriberEmail, isSubscribed);
    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");
  themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput() {
  const maxLength = nicknameInput.maxLength;
  const currentLength = Math.min(nicknameInput.value.length, maxLength);
  nicknameCount.textContent = currentLength + " / " + maxLength;
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
  const agreed = agreeCheck.checked;

  startButton.disabled = !agreed;
  agreeMessage.textContent = agreed
    ? "배정 설정을 시작할 수 있습니다."
    : "동의 후 서비스 설정을 시작할 수 있습니다.";

  if (agreed) {
    agreeMessage.classList.add("is-ready");
  } else {
    agreeMessage.classList.remove("is-ready");
  }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
  tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });
  panels.forEach(function (panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

function activateTab(clickedTab) {
    const targetId = clickedTab.dataset.target;
    const targetPanel = document.getElementById(targetId);

    if (!targetPanel) return;

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
});

// 다단계 폼(Multi-step Flow) 로직
const trainingFlow = document.querySelector("#training-flow");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress_item");
const titleInput = document.querySelector("#presentation-title");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");
const durationRange = document.querySelector("#duration-range");
const durationValue = document.querySelector("#duration-value");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna");
const durationValues = ["2명", "4명", "6명"];

const formData = {
  title: "", 
  duration: "4명", 
  qna: false, 
  qnaCount: "2명 추가"
};

function showStep(index) {
  flowSteps.forEach((step, i) => { step.hidden = i !== index; });
  progressItems.forEach((item, i) => {
    item.classList.toggle("is-active", i === index);
  });
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement() {
  agreeCheck.checked = false;
  trainingFlow.hidden = true;
  handleAgreeChange();
  agreeCheck.focus();
}

startButton.addEventListener("click", () => {
  if (!agreeCheck.checked) return;
  recordingDialog.showModal();
});

recordingCancel.addEventListener("click", () => {
  recordingDialog.close();
  revokeRecordingAgreement();
});

recordingDialog.addEventListener("cancel", revokeRecordingAgreement);

recordingConfirm.addEventListener("click", () => {
  if (!agreeCheck.checked) return;
  recordingDialog.close();
  trainingFlow.hidden = false;
  showStep(0);
  trainingFlow.scrollIntoView({ behavior: "smooth" });
  titleInput.focus();
});

function validateTitle() {
    const value = titleInput.value.trim();
    if (!value) {
        titleError.textContent = "모임 이름을 입력해 주세요.";
        titleInput.classList.add("has-error");
        titleInput.focus();
        return false;
    }
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    formData.title = value;
    return true;
}

titleNext.addEventListener("click", () => {
    if (!validateTitle()) return;
    showStep(1);
});

durationRange.addEventListener("input", () => {
    durationValue.value = durationValues[durationRange.value];
});

qnaOption.addEventListener("change", () => {
    qnaOptions.hidden = !qnaOption.checked;
});

optionPrev.addEventListener("click", () => showStep(0));
optionNext.addEventListener("click", () => {
    formData.duration = durationValues[durationRange.value];
    formData.qna = qnaOption.checked;
    const count = document.querySelector('input[name="qna-count"]:checked');
    formData.qnaCount = count ? count.value + "명 추가" : "2명 추가";
    
    summaryTitle.textContent = formData.title;
    summaryDuration.textContent = formData.duration;
    summaryQna.textContent = formData.qna ? formData.qnaCount : "미적용";
    showStep(2);
});

summaryPrev.addEventListener("click", () => showStep(1));
finishButton.addEventListener("click", () => showStep(3));
restartButton.addEventListener("click", () => {
    formData.title = "";
    formData.duration = "4명";
    formData.qna = false;
    formData.qnaCount = "2명 추가";
    titleInput.value = "";
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    durationRange.value = "1";
    durationValue.value = "4명";
    qnaOption.checked = false;
    qnaOptions.hidden = true;
    document.querySelector('input[name="qna-count"][value="2"]').checked = true;
    summaryTitle.textContent = "";
    summaryDuration.textContent = "";
    summaryQna.textContent = "";
    showStep(0);
});

// ==========================================
// [새로운 기능] 무작위 짝 배정 및 히스토리 관리 로직
// ==========================================
const participantInput = document.querySelector("#participant-input");
const runMatchingBtn = document.querySelector("#run-matching-btn");
const matchErrorMsg = document.querySelector("#match-error-msg");
const matchResultContainer = document.querySelector("#match-result-container");
const matchResultList = document.querySelector("#match-result-list");
const saveMatchBtn = document.querySelector("#save-match-btn");
const emptyHistoryMsg = document.querySelector("#empty-history-msg");
const historyList = document.querySelector("#history-list");

let currentPairs = [];
let savedMatchHistory = [];

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

runMatchingBtn.addEventListener("click", () => {
    const rawText = participantInput.value.trim();
    if (!rawText) {
        matchErrorMsg.textContent = "참여자 명단을 입력해 주세요. (예: 김철수, 이영희)";
        participantInput.classList.add("has-error");
        participantInput.focus();
        matchResultContainer.hidden = true;
        return;
    }

    matchErrorMsg.textContent = "";
    participantInput.classList.remove("has-error");

    let names = rawText.split(/[,,\s]+/).map(name => name.trim()).filter(name => name.length > 0);
    
    if (names.length < 2) {
        matchErrorMsg.textContent = "최소 2명 이상의 참여자를 입력해야 짝을 배정할 수 있습니다.";
        participantInput.focus();
        matchResultContainer.hidden = true;
        return;
    }

    shuffleArray(names);
    currentPairs = [];

    for (let i = 0; i < names.length; i += 2) {
        if (i + 1 < names.length) {
            currentPairs.push(`${names[i]} & ${names[i+1]}`);
        } else {
            currentPairs.push(`${names[i]} (혼자 남음)`);
        }
    }

    matchResultList.innerHTML = "";
    currentPairs.forEach((pair, index) => {
        const li = document.createElement("li");
        li.textContent = `조 ${index + 1}: ${pair}`;
        matchResultList.appendChild(li);
    });

    matchResultContainer.hidden = false;
});

saveMatchBtn.addEventListener("click", () => {
    if (currentPairs.length === 0) return;

    const timestamp = new Date().toLocaleTimeString();
    const historyItem = {
        id: Date.now(),
        title: `배정 결과 (${timestamp})`,
        pairs: [...currentPairs]
    };

    savedMatchHistory.push(historyItem);
    renderHistoryList();

    matchResultContainer.hidden = true;
    participantInput.value = "";
    matchErrorMsg.textContent = "성공적으로 결과가 히스토리 목록에 저장되었습니다!";
    matchErrorMsg.style.color = "#245c3a";
});

function renderHistoryList() {
    if (savedMatchHistory.length === 0) {
        emptyHistoryMsg.hidden = false;
        historyList.innerHTML = "";
        return;
    }

    emptyHistoryMsg.hidden = true;
    historyList.innerHTML = "";

    savedMatchHistory.forEach((item) => {
        const li = document.createElement("li");
        
        const span = document.createElement("span");
        span.textContent = `${item.title} (${item.pairs.length}개 조)`;
        
        const btnGroup = document.createElement("div");
        btnGroup.style.display = "flex";
        btnGroup.style.gap = "8px";

        const viewBtn = document.createElement("button");
        viewBtn.textContent = "다시 보기";
        viewBtn.className = "history-item-btn";
        viewBtn.addEventListener("click", () => {
            alert(`[${item.title}]\n` + item.pairs.join("\n"));
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "삭제";
        deleteBtn.className = "history-item-btn";
        deleteBtn.style.backgroundColor = "#9d243d";
        deleteBtn.addEventListener("click", () => {
            savedMatchHistory = savedMatchHistory.filter(h => h.id !== item.id);
            renderHistoryList();
        });

        btnGroup.appendChild(viewBtn);
        btnGroup.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(btnGroup);
        historyList.appendChild(li);
    });
}