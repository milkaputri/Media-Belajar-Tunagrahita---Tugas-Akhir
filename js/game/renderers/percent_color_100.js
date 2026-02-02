export function renderPercentColor100({ mount, q, onAnswerChange }) {
  const target = Number(q.data?.targetPercent || 0);

  const wrap = document.createElement("div");
  wrap.className = "pct100-wrap";

  const board = document.createElement("div");
  board.className = "pct100-board";

  const grid = document.createElement("div");
  grid.className = "pct100-grid";
  grid.setAttribute("role", "group");
  grid.setAttribute("aria-label", `Warnai ${target}%`);

  const sfxPop = new Audio("../../assets/sounds/click.mp3");
  sfxPop.volume = 1.0;

  const boxes = [];
  for (let i = 0; i < 10; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pct100-box";
    btn.setAttribute("aria-label", `Balon ${i + 1} dari 10`);

    const img = document.createElement("img");
    img.className = "pct100-balloon";
    img.src = "../../assets/image/balonabu.png";
    img.alt = "Balon";

    btn.appendChild(img);

    btn.addEventListener("click", () => {
      const isOn = !btn.classList.contains("selected");
      btn.classList.toggle("selected", isOn);
      img.src = isOn ? "../../assets/image/balonmerah.png" : "../../assets/image/balonabu.png";
      if (isOn) {
        img.classList.remove("rise");
        void img.offsetWidth;
        img.classList.add("rise");
        try { sfxPop.currentTime = 0; sfxPop.play(); } catch {}
      }
      const count = boxes.filter(b => b.classList.contains("selected")).length;
      onAnswerChange(count);
    });

    boxes.push(btn);
    grid.appendChild(btn);
  }

  board.appendChild(grid);
  wrap.appendChild(board);

  mount.innerHTML = "";
  mount.appendChild(wrap);
  onAnswerChange(null);

  return {};
}
