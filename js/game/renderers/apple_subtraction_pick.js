export function renderAppleSubtractionPick({ mount, q, onAnswerChange }) {
  const baseCount = Number(q.data?.baseCount || 0);
  const subCount = Number(q.data?.subCount || 0);
  const appleStay = "../../assets/image/apple1.png";
  const appleRemoved = "../../assets/image/apple.png";
  const walkerImg = "../../assets/image/anakjalan.png";
  const sfxEat = new Audio("../../assets/sounds/makan.mp3");

  let remaining = subCount;
  let targetPointer = 0;
  let targetOrder = [];
  let isMoving = false;
  let moveTimer = null;

  const wrap = document.createElement("div");
  wrap.className = "apple-sub-wrap";

  const board = document.createElement("div");
  board.className = "apple-sub-board";

  const appleArea = document.createElement("div");
  appleArea.className = "apple-area";

  const appleGrid = document.createElement("div");
  appleGrid.className = "apple-grid";

  const apples = [];
  for (let i = 0; i < baseCount; i++) {
    const img = document.createElement("img");
    img.className = "apple-item";
    img.src = appleStay;
    img.alt = "Apel";
    appleGrid.appendChild(img);
    apples.push(img);
  }

  appleArea.appendChild(appleGrid);
  const walker = document.createElement("img");
  walker.className = "apple-walker";
  walker.src = walkerImg;
  walker.alt = "Anak jalan";
  appleArea.appendChild(walker);

  const side = document.createElement("div");
  side.className = "apple-sub-side";

  const mathRow = document.createElement("div");
  mathRow.className = "apple-sub-math";

  const baseLabel = document.createElement("div");
  baseLabel.className = "apple-base-label";
  baseLabel.textContent = String(baseCount);

  const minus = document.createElement("div");
  minus.className = "apple-sub-minus";
  minus.textContent = "-";

  const subButton = document.createElement("button");
  subButton.type = "button";
  subButton.className = "apple-sub-btn";
  subButton.textContent = String(remaining);

  mathRow.appendChild(baseLabel);
  mathRow.appendChild(minus);
  mathRow.appendChild(subButton);

  const hint = document.createElement("div");
  hint.className = "apple-sub-hint";
  hint.textContent = "Klik tombol minus untuk mengambil apel";

  const choices = document.createElement("div");
  choices.className = "apple-sub-choices";

  const choiceButtons = (q.data?.choices || []).map((num) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "apple-sub-choice";
    btn.textContent = String(num);
    btn.disabled = true;
    btn.addEventListener("click", () => {
      choices.querySelectorAll(".apple-sub-choice").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      onAnswerChange(num);
    });
    choices.appendChild(btn);
    return btn;
  });

  function setButtonState() {
    subButton.textContent = String(Math.max(remaining, 0));
    if (remaining <= 0) {
      subButton.disabled = true;
      subButton.classList.add("disabled");
      choiceButtons.forEach(btn => { btn.disabled = false; });
      hint.textContent = "Pilih jawaban yang benar";
    }
  }

  function getCenter(el) {
    const rect = el.getBoundingClientRect();
    const parentRect = appleArea.getBoundingClientRect();
    return {
      x: rect.left - parentRect.left + rect.width / 2,
      y: rect.top - parentRect.top + rect.height / 2
    };
  }

  function getGap() {
    const list = apples.map((a) => a.getBoundingClientRect());
    for (let i = 0; i < list.length - 1; i++) {
      const a = list[i];
      for (let j = i + 1; j < list.length; j++) {
        const b = list[j];
        if (Math.abs(a.top - b.top) < 4) {
          const gap = b.left - a.right;
          if (gap > 0) return gap;
        }
      }
    }
    return 10;
  }

  const walkerOffsetY = 8;

  function placeWalkerAt(index) {
    const apple = apples[index];
    if (!apple) return;
    const pos = getCenter(apple);
    const w = walker.getBoundingClientRect();
    walker.style.left = `${pos.x - w.width / 2}px`;
    walker.style.top = `${pos.y - w.height / 2 + walkerOffsetY}px`;
  }

  function placeWalkerAfterLast() {
    const last = apples[apples.length - 1];
    if (!last) return;
    const rect = last.getBoundingClientRect();
    const parentRect = appleArea.getBoundingClientRect();
    const gap = getGap();
    const w = walker.getBoundingClientRect();
    const centerX = rect.left - parentRect.left + rect.width / 2 + rect.width + gap;
    const centerY = rect.top - parentRect.top + rect.height / 2;
    walker.style.left = `${centerX - w.width / 2}px`;
    walker.style.top = `${centerY - w.height / 2 + walkerOffsetY}px`;
  }

  function moveWalkerTo(index) {
    const apple = apples[index];
    if (!apple) return;
    const pos = getCenter(apple);
    const w = walker.getBoundingClientRect();
    walker.classList.add("moving");
    walker.style.left = `${pos.x - w.width / 2}px`;
    walker.style.top = `${pos.y - w.height / 2 + walkerOffsetY}px`;
  }

  function computeTargets() {
    const start = Math.max(0, baseCount - subCount);
    targetOrder = [];
    for (let i = baseCount - 1; i >= start; i--) {
      targetOrder.push(i);
    }
  }

  subButton.addEventListener("click", () => {
    if (remaining <= 0 || isMoving) return;
    const targetIndex = targetOrder[targetPointer];
    targetPointer += 1;
    remaining -= 1;
    setButtonState();

    if (typeof targetIndex === "number") {
      isMoving = true;
      subButton.disabled = true;
      moveWalkerTo(targetIndex);
      const finalizeMove = () => {
        if (moveTimer) {
          clearTimeout(moveTimer);
          moveTimer = null;
        }
        walker.classList.remove("moving");
        isMoving = false;
        sfxEat.currentTime = 0;
        sfxEat.play().catch(() => {});
        const eatenApple = apples[targetIndex];
        if (eatenApple) {
          eatenApple.classList.add("apple-removed");
          eatenApple.src = appleRemoved;
        }
        if (remaining > 0) subButton.disabled = false;
      };
      walker.addEventListener("transitionend", finalizeMove, { once: true });
      moveTimer = setTimeout(finalizeMove, 520);
    }
  });

  computeTargets();
  requestAnimationFrame(() => {
    if (targetOrder.length) placeWalkerAfterLast();
  });
  window.addEventListener("resize", () => {
    if (remaining <= 0) return;
    if (isMoving) return;
    if (targetPointer === 0) {
      placeWalkerAfterLast();
      return;
    }
    const currentIndex = targetOrder[Math.max(0, targetPointer - 1)];
    if (typeof currentIndex === "number") placeWalkerAt(currentIndex);
  });

  setButtonState();

  side.appendChild(mathRow);
  side.appendChild(hint);

  board.appendChild(appleArea);
  board.appendChild(side);

  wrap.appendChild(board);
  wrap.appendChild(choices);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);
  return {};
}
