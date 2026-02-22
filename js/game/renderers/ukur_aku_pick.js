export function renderUkurAkuPick({ mount, q, onAnswerChange }){
  let selectedId = null;

  const wrap = document.createElement("div");
  wrap.className = "ukur-wrap";

  const grid = document.createElement("div");
  grid.className = "ukur-grid";

  q.data.items.forEach(item => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "ukur-card";
    card.dataset.id = item.id;

    const label = document.createElement("div");
    label.className = "ukur-label";
    label.textContent = `${item.name} ${item.label}`;

    const imgWrap = document.createElement("div");
    imgWrap.className = "ukur-img-wrap";

    const img = document.createElement("img");
    img.className = "ukur-img";
    img.src = item.image;
    img.alt = `${item.name} ${item.variant === "long" ? "panjang" : "pendek"}`;

    imgWrap.appendChild(img);
    card.appendChild(label);
    card.appendChild(imgWrap);

    card.addEventListener("click", () => {
      selectedId = item.id;
      grid.querySelectorAll(".ukur-card").forEach(el => {
        el.classList.toggle("selected", el.dataset.id === selectedId);
      });
      onAnswerChange(selectedId);
    });

    grid.appendChild(card);
  });

  wrap.appendChild(grid);
  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);
  return { getAnswer: () => selectedId };
}
