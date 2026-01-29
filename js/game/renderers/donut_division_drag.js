export function renderDonutDivisionDrag({ mount, q, onAnswerChange }) {
  const total = Number(q.data?.total || 0);
  const kids = Number(q.data?.kids || 0);
  const donutSrc = "../../assets/image/donat.png";
  const plateSrc = "../../assets/image/piring.png";
  const kidImgs = [
    "../../assets/image/anak1.png",
    "../../assets/image/anak2.png",
    "../../assets/image/anak3.png",
    "../../assets/image/anak4.png",
    "../../assets/image/anak5.png",
    "../../assets/image/anak6.png",
    "../../assets/image/anak7.png"
  ];

  const wrap = document.createElement("div");
  wrap.className = "donut-wrap";

  const board = document.createElement("div");
  board.className = "donut-board";

  const kidsRow = document.createElement("div");
  kidsRow.className = "donut-kids";

  const plates = [];

  for (let i = 0; i < kids; i++) {
    const card = document.createElement("div");
    card.className = "donut-kid-card";

    const kid = document.createElement("img");
    kid.className = "donut-kid-img";
    kid.src = kidImgs[i % kidImgs.length];
    kid.alt = "Anak";

    const plateWrap = document.createElement("div");
    plateWrap.className = "donut-plate-wrap";

    const plate = document.createElement("div");
    plate.className = "donut-plate";
    plate.dataset.plate = String(i);

    const plateImg = document.createElement("img");
    plateImg.className = "donut-plate-img";
    plateImg.src = plateSrc;
    plateImg.alt = "Piring";

    plateWrap.appendChild(plateImg);
    plateWrap.appendChild(plate);

    card.appendChild(kid);
    card.appendChild(plateWrap);

    kidsRow.appendChild(card);
    plates.push(plate);
  }

  const pool = document.createElement("div");
  pool.className = "donut-pool";
  pool.dataset.pool = "1";

  for (let i = 0; i < total; i++) {
    const donut = document.createElement("img");
    donut.className = "donut-item";
    donut.src = donutSrc;
    donut.alt = "Donat";
    donut.draggable = true;
    donut.dataset.donutId = `donut-${i}`;
    donut.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", donut.dataset.donutId);
      donut.classList.add("dragging");
    });
    donut.addEventListener("dragend", () => {
      donut.classList.remove("dragging");
    });
    pool.appendChild(donut);
  }

  const choices = document.createElement("div");
  choices.className = "donut-choices";

  const choiceButtons = (q.data?.choices || []).map((num) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "donut-choice";
    btn.textContent = String(num);
    btn.disabled = true;
    btn.addEventListener("click", () => {
      choices.querySelectorAll(".donut-choice").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      onAnswerChange(num);
    });
    choices.appendChild(btn);
    return btn;
  });

  function getDonutById(id) {
    return mount.querySelector(`[data-donut-id="${id}"]`);
  }

  function updateChoiceState() {
    const remaining = pool.querySelectorAll(".donut-item").length;
    const allPlaced = remaining === 0;
    choiceButtons.forEach(btn => { btn.disabled = !allPlaced; });
  }

  function addDropHandlers(el) {
    el.addEventListener("dragover", (e) => {
      e.preventDefault();
      el.classList.add("over");
    });
    el.addEventListener("dragleave", () => el.classList.remove("over"));
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      el.classList.remove("over");
      const id = e.dataTransfer.getData("text/plain");
      const donut = getDonutById(id);
      if (!donut) return;
      el.appendChild(donut);
      updateChoiceState();
    });
  }

  plates.forEach(addDropHandlers);
  addDropHandlers(pool);

  board.appendChild(kidsRow);
  board.appendChild(pool);

  wrap.appendChild(board);
  wrap.appendChild(choices);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);
  return {};
}
