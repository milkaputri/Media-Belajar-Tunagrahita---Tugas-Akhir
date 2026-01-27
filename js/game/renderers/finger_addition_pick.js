export function renderFingerAdditionPick({ mount, q, onAnswerChange }) {
  const wrap = document.createElement("div");
  wrap.className = "finger-wrap";

  const board = document.createElement("div");
  board.className = "finger-board";

  const leftHand = document.createElement("div");
  leftHand.className = "finger-hand left";
  leftHand.dataset.count = String(q.data?.a ?? 0);
  leftHand.innerHTML = `<img class="finger-img" alt="Jari kiri" />`;

  const plus = document.createElement("div");
  plus.className = "finger-plus";
  plus.textContent = "+";

  const rightHand = document.createElement("div");
  rightHand.className = "finger-hand right";
  rightHand.dataset.count = String(q.data?.b ?? 0);
  rightHand.innerHTML = `<img class="finger-img" alt="Jari kanan" />`;

  function applyCount(hand) {
    const n = Math.max(0, Math.min(5, Number(hand.dataset.count || 0)));
    const img = hand.querySelector(".finger-img");
    if (!img) return;
    if (n === 0) {
      img.removeAttribute("src");
      img.classList.add("hidden");
      return;
    }
    img.classList.remove("hidden");
    img.src = `../../assets/image/jari${n}.png`;
  }

  applyCount(leftHand);
  applyCount(rightHand);

  board.appendChild(leftHand);
  board.appendChild(plus);
  board.appendChild(rightHand);

  const choices = document.createElement("div");
  choices.className = "finger-choices";

  (q.data?.choices || []).forEach((num) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "finger-choice";
    btn.textContent = String(num);
    btn.addEventListener("click", () => {
      choices.querySelectorAll(".finger-choice").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      onAnswerChange(num);
    });
    choices.appendChild(btn);
  });

  wrap.appendChild(board);
  wrap.appendChild(choices);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);
  return {};
}
