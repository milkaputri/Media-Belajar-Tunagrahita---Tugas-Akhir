export function renderAppleSubtractionPick({ mount, q, onAnswerChange }) {
  const baseCount = Number(q.data?.baseCount || 0);
  const subCount = Number(q.data?.subCount || 0);
  const appleStay = "../../assets/image/apple1.png";
  const appleRemoved = "../../assets/image/apple.png";

  let remaining = subCount;

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

  subButton.addEventListener("click", () => {
    if (remaining <= 0) return;
    const index = baseCount - remaining;
    const apple = apples[index];
    if (apple) {
      apple.classList.remove("apple-removed");
      apple.classList.add("apple-shake");
      apple.addEventListener("animationend", () => {
        apple.classList.remove("apple-shake");
        apple.classList.add("apple-removed");
        apple.src = appleRemoved;
      }, { once: true });
    }
    remaining -= 1;
    setButtonState();
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
