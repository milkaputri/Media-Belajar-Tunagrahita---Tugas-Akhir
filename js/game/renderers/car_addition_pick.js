function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function renderCarAdditionPick({ mount, q, onAnswerChange }) {
  const baseCount = Number(q.data?.baseCount || 0);
  const addCount = Number(q.data?.addCount || 0);
  const carImages = [
    "../../assets/image/mobil1.png",
    "../../assets/image/mobil2.png",
    "../../assets/image/mobil3.png"
  ];

  let remaining = addCount;

  const wrap = document.createElement("div");
  wrap.className = "car-add-wrap";

  const board = document.createElement("div");
  board.className = "car-add-board";

  const road = document.createElement("div");
  road.className = "car-road";

  const roadBg = document.createElement("img");
  roadBg.className = "car-road-bg";
  roadBg.src = "../../assets/image/jalan.png";
  roadBg.alt = "Jalan";

  const lane = document.createElement("div");
  lane.className = "car-lane";

  const baseBadge = document.createElement("div");
  baseBadge.className = "car-base-count";
  baseBadge.textContent = String(baseCount);

  const carGrid = document.createElement("div");
  carGrid.className = "car-grid";

  function createCar({ moving }) {
    const img = document.createElement("img");
    img.className = "car-item";
    img.src = pickRandom(carImages);
    img.alt = "Mobil";
    if (moving) {
      img.classList.add("car-moving");
      img.addEventListener("animationend", () => {
        img.classList.remove("car-moving");
        img.classList.add("car-arrived");
      }, { once: true });
    }
    return img;
  }

  for (let i = 0; i < baseCount; i++) {
    carGrid.appendChild(createCar({ moving: false }));
  }

  lane.appendChild(baseBadge);
  lane.appendChild(carGrid);
  road.appendChild(roadBg);
  road.appendChild(lane);

  const side = document.createElement("div");
  side.className = "car-add-side";

  const mathRow = document.createElement("div");
  mathRow.className = "car-add-math";

  const baseLabel = document.createElement("div");
  baseLabel.className = "car-base-label";
  baseLabel.textContent = String(baseCount);

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "car-add-btn";
  addButton.textContent = String(remaining);

  const plus = document.createElement("div");
  plus.className = "car-add-plus";
  plus.textContent = "+";

  mathRow.appendChild(baseLabel);
  mathRow.appendChild(plus);
  mathRow.appendChild(addButton);

  const hint = document.createElement("div");
  hint.className = "car-add-hint";
  hint.textContent = "Klik tombol merah untuk menambah mobil";

  const choices = document.createElement("div");
  choices.className = "car-add-choices";

  const choiceButtons = (q.data?.choices || []).map((num) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "car-add-choice";
    btn.textContent = String(num);
    btn.disabled = true;
    btn.addEventListener("click", () => {
      choices.querySelectorAll(".car-add-choice").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      onAnswerChange(num);
    });
    choices.appendChild(btn);
    return btn;
  });

  function setAddButtonState() {
    addButton.textContent = String(Math.max(remaining, 0));
    if (remaining <= 0) {
      addButton.disabled = true;
      addButton.classList.add("disabled");
      choiceButtons.forEach(btn => { btn.disabled = false; });
      hint.textContent = "Pilih jawaban yang benar";
    }
  }

  addButton.addEventListener("click", () => {
    if (remaining <= 0) return;
    const car = createCar({ moving: true });
    carGrid.appendChild(car);
    remaining -= 1;
    setAddButtonState();
  });

  setAddButtonState();

  side.appendChild(mathRow);
  side.appendChild(hint);

  board.appendChild(road);
  board.appendChild(side);

  wrap.appendChild(board);
  wrap.appendChild(choices);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);
  return {};
}
