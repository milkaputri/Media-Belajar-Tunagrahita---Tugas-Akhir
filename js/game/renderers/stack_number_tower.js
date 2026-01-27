export function renderStackNumberTower({ mount, q, onChange }) {
  const wrap = document.createElement("div");
  wrap.className = "tower-wrap";

  const tower = document.createElement("div");
  tower.className = "tower-stack";

  const options = document.createElement("div");
  options.className = "tower-options";

  wrap.appendChild(tower);
  wrap.appendChild(options);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  const sequence = q.data?.sequence || [];
  const optionNums = q.data?.options || [];
  const order = q.data?.order || "asc";
  const placed = [];

  function resetTower() {
    tower.innerHTML = "";
    placed.length = 0;
    options.querySelectorAll(".tower-block").forEach(b => {
      b.classList.remove("used", "wrong");
      b.removeAttribute("aria-disabled");
    });
    if (typeof onChange === "function") onChange(placed.slice());
  }

  function fallAnimation() {
    tower.classList.add("tower-fall");
    setTimeout(() => {
      tower.classList.remove("tower-fall");
      resetTower();
    }, 900);
  }

  resetTower();

  optionNums.forEach((num) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tower-block";
    btn.textContent = num;
    btn.dataset.value = String(num);

    btn.addEventListener("click", () => {
      const value = Number(btn.dataset.value);
      if (btn.classList.contains("used")) return;

      btn.classList.add("used");
      btn.setAttribute("aria-disabled", "true");

      const piece = document.createElement("button");
      piece.type = "button";
      piece.className = "tower-piece";
      piece.textContent = value;
      piece.dataset.value = String(value);

      piece.addEventListener("click", () => {
        const idx = placed.indexOf(value);
        if (idx !== -1) placed.splice(idx, 1);
        piece.remove();
        btn.classList.remove("used", "wrong");
        btn.removeAttribute("aria-disabled");
        if (typeof onChange === "function") onChange(placed.slice());
      });

      tower.appendChild(piece);
      placed.push(value);
      if (typeof onChange === "function") onChange(placed.slice());
    });

    options.appendChild(btn);
  });

  return {
    destroy() {
      mount.innerHTML = "";
    },
    getAnswer() {
      return placed.slice();
    },
    fail() {
      fallAnimation();
    }
  };
}
