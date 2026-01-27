export function renderImagePlaceValuePick({ mount, q, onAnswerChange }) {
  const wrap = document.createElement("div");
  wrap.className = "imgpv-wrap";

  const header = document.createElement("div");
  header.className = "imgpv-header";

  const symbols = q.data?.symbols || ["⭐","⚪","△","⬜"];
  const labels = q.data?.labels || ["1.000","100","10","1"];

  symbols.forEach((sym, i) => {
    const cell = document.createElement("div");
    cell.className = "imgpv-head-cell";
    cell.innerHTML = `
      <div class="imgpv-head-symbol">${sym}</div>
      <div class="imgpv-head-value">${labels[i] || ""}</div>
    `;
    header.appendChild(cell);
  });

  const board = document.createElement("div");
  board.className = "imgpv-board";

  const counts = q.data?.counts || [0,0,0,0];
  counts.forEach((c, i) => {
    const box = document.createElement("div");
    box.className = "imgpv-box";
    for (let k = 0; k < c; k++) {
      const it = document.createElement("div");
      it.className = "imgpv-item";
      it.textContent = symbols[i] || "⭐";
      box.appendChild(it);
    }
    board.appendChild(box);
  });

  const choices = document.createElement("div");
  choices.className = "imgpv-choices";

  (q.data?.choices || []).forEach((val) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "imgpv-choice";
    btn.textContent = String(val);
    btn.addEventListener("click", () => {
      choices.querySelectorAll(".imgpv-choice").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      onAnswerChange(val);
    });
    choices.appendChild(btn);
  });

  wrap.appendChild(header);
  wrap.appendChild(board);
  wrap.appendChild(choices);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);
  return {};
}
