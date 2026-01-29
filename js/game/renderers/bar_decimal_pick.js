export function renderBarDecimalPick({ mount, q, onAnswerChange }) {
  const fill = Number(q.data?.fill || 0);
  const choices = q.data?.choices || [0.3, 0.5, 0.8];

  const wrap = document.createElement("div");
  wrap.className = "bar-dec-wrap";

  const board = document.createElement("div");
  board.className = "bar-dec-board";

  const bar = document.createElement("div");
  bar.className = "bar-dec-bar";

  const barImg = document.createElement("img");
  barImg.className = "bar-dec-img";
  barImg.src = "../../assets/image/pipa2.png";
  barImg.alt = "Pipa";

  const slices = document.createElement("div");
  slices.className = "bar-dec-slices";

  const labels = document.createElement("div");
  labels.className = "bar-dec-labels";

  for (let i = 0; i < 10; i++) {
    const slice = document.createElement("div");
    slice.className = "bar-dec-slice";
    if (i < fill) slice.classList.add("filled");
    slices.appendChild(slice);

    const label = document.createElement("div");
    label.className = "bar-dec-label";
    label.textContent = "0.1";
    labels.appendChild(label);
  }

  bar.appendChild(barImg);
  bar.appendChild(slices);
  bar.appendChild(labels);

  const choicesWrap = document.createElement("div");
  choicesWrap.className = "bar-dec-choices";

  choices.forEach((val) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bar-dec-choice";
    btn.textContent = String(val).replace(".", ",");
    btn.addEventListener("click", () => {
      choicesWrap.querySelectorAll(".bar-dec-choice").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      onAnswerChange(val);
    });
    choicesWrap.appendChild(btn);
  });

  board.appendChild(bar);
  board.appendChild(choicesWrap);
  wrap.appendChild(board);

  mount.innerHTML = "";
  mount.appendChild(wrap);
  onAnswerChange(null);

  return {};
}
