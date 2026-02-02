export function renderBottleDecimalPick({ mount, q, onAnswerChange }) {
  const choices = q.data?.choices || [];

  const wrap = document.createElement("div");
  wrap.className = "bottle-dec-wrap";

  const board = document.createElement("div");
  board.className = "bottle-dec-board";

  const choicesWrap = document.createElement("div");
  choicesWrap.className = "bottle-dec-choices";

  choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bottle-dec-choice";
    btn.setAttribute("aria-label", `Botol ${choice.label} liter`);

    const bottle = document.createElement("div");
    bottle.className = "bottle-dec-bottle";

    const bottleNeck = document.createElement("div");
    bottleNeck.className = "bottle-dec-neck";

    const bottleBody = document.createElement("div");
    bottleBody.className = "bottle-dec-body";

    const water = document.createElement("div");
    water.className = "bottle-dec-water";
    water.style.height = `${Math.max(0, Math.min(1, Number(choice.fill))) * 100}%`;

    bottleBody.appendChild(water);
    bottle.appendChild(bottleNeck);
    bottle.appendChild(bottleBody);
    btn.appendChild(bottle);

    const label = document.createElement("div");
    label.className = "bottle-dec-label";
    label.textContent = choice.label;
    btn.appendChild(label);

    btn.addEventListener("click", () => {
      choicesWrap.querySelectorAll(".bottle-dec-choice").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      water.classList.remove("wave");
      void water.offsetWidth;
      water.classList.add("wave");
      onAnswerChange(choice.value);

      const submitBtn = document.getElementById("btnSubmit");
      if (submitBtn && !submitBtn.disabled) {
        submitBtn.click();
      }
    });

    choicesWrap.appendChild(btn);
  });

  board.appendChild(choicesWrap);
  wrap.appendChild(board);

  mount.innerHTML = "";
  mount.appendChild(wrap);
  onAnswerChange(null);

  return {};
}
