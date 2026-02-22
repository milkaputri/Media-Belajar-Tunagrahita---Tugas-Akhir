export function renderUkurCompareSignPick({ mount, q, onAnswerChange }){
  let selected = null;
  const choices = q.data?.choices || [">", "=", "<"];

  const wrap = document.createElement("div");
  wrap.className = "ukurcmp-wrap";

  const board = document.createElement("div");
  board.className = "ukurcmp-board";

  const visual = document.createElement("div");
  visual.className = "ukurcmp-visual";

  const leftBox = document.createElement("div");
  leftBox.className = "ukurcmp-item";
  const leftImg = document.createElement("img");
  leftImg.className = "ukurcmp-img";
  leftImg.src = q.data?.left?.image || "";
  leftImg.alt = `${q.data?.left?.name || "Benda"} kiri`;
  leftBox.appendChild(leftImg);

  const dots = document.createElement("div");
  dots.className = "ukurcmp-dots";
  dots.textContent = ".....";
  dots.setAttribute("aria-hidden", "true");

  const rightBox = document.createElement("div");
  rightBox.className = "ukurcmp-item";
  const rightImg = document.createElement("img");
  rightImg.className = "ukurcmp-img";
  rightImg.src = q.data?.right?.image || "";
  rightImg.alt = `${q.data?.right?.name || "Benda"} kanan`;
  rightBox.appendChild(rightImg);

  visual.appendChild(leftBox);
  visual.appendChild(dots);
  visual.appendChild(rightBox);

  const actions = document.createElement("div");
  actions.className = "ukurcmp-actions";

  choices.forEach((sym) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ukurcmp-sign";
    btn.textContent = sym;
    btn.addEventListener("click", () => {
      selected = sym;
      actions.querySelectorAll(".ukurcmp-sign").forEach((el) => {
        el.classList.toggle("selected", el.textContent === sym);
      });
      onAnswerChange(selected);
    });
    actions.appendChild(btn);
  });

  board.appendChild(visual);
  board.appendChild(actions);
  wrap.appendChild(board);

  mount.innerHTML = "";
  mount.appendChild(wrap);
  onAnswerChange(null);

  return { getAnswer: () => selected };
}
