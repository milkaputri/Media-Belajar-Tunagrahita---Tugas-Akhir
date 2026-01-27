export function renderCatchBalloonNumber({ mount, q, onAnswerChange, onCorrect }) {
  const field = document.createElement("div");
  field.className = "balloon-field";

  const target = Number(q.data?.targetNumber);
  const palette = [
    "#FFD6E0",
    "#CDE8FF",
    "#FFF2B5",
    "#D7F9E5",
    "#F1D1FF",
    "#FFE1C6",
    "#CBE8F6"
  ];

  let locked = false;
  const timers = [];

  function addTimer(id) {
    timers.push(id);
  }

  function onPick(balloon) {
    if (locked) return;
    const value = Number(balloon.dataset.value);
    onAnswerChange(value);

    field.querySelectorAll(".balloon").forEach(b => b.classList.remove("selected"));
    balloon.classList.add("selected");

    if (value === target) {
      locked = true;
      balloon.classList.add("pop");
      addTimer(setTimeout(() => balloon.remove(), 360));
      field.classList.add("locked");
      if (typeof onCorrect === "function") {
        onCorrect(value);
      }
      return;
    }

    balloon.classList.add("shake");
    addTimer(setTimeout(() => balloon.classList.remove("shake"), 420));
  }

  const balloons = q.data?.balloons || [];
  balloons.forEach((num, i) => {
    const balloon = document.createElement("button");
    balloon.type = "button";
    balloon.className = "balloon";
    balloon.dataset.value = num;
    balloon.setAttribute("aria-label", `Balon angka ${num}`);

    const size = 64 + Math.random() * 26;
    const duration = 9 + Math.random() * 5;
    const delay = Math.random() * 2.5;
    const drift = Math.random() * 24 - 12;
    const x = 6 + Math.random() * 88;
    const color = palette[i % palette.length];

    balloon.style.setProperty("--balloon-color", color);
    balloon.style.setProperty("--balloon-size", `${size}px`);
    balloon.style.setProperty("--float-duration", `${duration}s`);
    balloon.style.setProperty("--float-delay", `${delay}s`);
    balloon.style.setProperty("--float-drift", `${drift}px`);
    balloon.style.setProperty("--balloon-x", `${x}%`);

    balloon.innerHTML = `
      <span class="balloon-body">
        <span class="balloon-shine"></span>
        <span class="balloon-num">${num}</span>
      </span>
      <span class="balloon-string"></span>
    `;

    balloon.addEventListener("click", () => onPick(balloon));
    field.appendChild(balloon);
  });

  mount.innerHTML = "";
  mount.appendChild(field);

  onAnswerChange(null);

  return {
    destroy() {
      timers.forEach(id => clearTimeout(id));
    }
  };
}
