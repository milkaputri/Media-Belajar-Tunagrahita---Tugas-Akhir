export function renderObjectsAdditionPick({ mount, q, onAnswerChange }) {
  const wrap = document.createElement("div");
  wrap.className = "obj-add-wrap";

  const board = document.createElement("div");
  board.className = "obj-add-board";

  const left = document.createElement("div");
  left.className = "obj-add-group";

  const plus = document.createElement("div");
  plus.className = "obj-add-plus";
  plus.textContent = "+";

  const right = document.createElement("div");
  right.className = "obj-add-group";

  const makeItems = (count, emoji) => {
    for (let i = 0; i < count; i++) {
      const it = document.createElement("div");
      it.className = "obj-add-item";
      it.textContent = emoji;
      left.appendChild(it);
    }
  };

  makeItems(q.data?.leftCount || 0, q.data?.leftEmoji || "🍎");
  for (let i = 0; i < (q.data?.rightCount || 0); i++) {
    const it = document.createElement("div");
    it.className = "obj-add-item";
    it.textContent = q.data?.rightEmoji || "🍌";
    right.appendChild(it);
  }

  board.appendChild(left);
  board.appendChild(plus);
  board.appendChild(right);

  const choices = document.createElement("div");
  choices.className = "obj-add-choices";

  (q.data?.choices || []).forEach((num) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "obj-add-choice";
    btn.textContent = String(num);
    btn.addEventListener("click", () => {
      choices.querySelectorAll(".obj-add-choice").forEach(b => b.classList.remove("selected"));
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
