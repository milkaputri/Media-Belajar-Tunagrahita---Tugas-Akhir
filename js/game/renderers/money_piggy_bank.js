function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value));
}

export function renderMoneyPiggyBank({ mount, q, onAnswerChange }) {
  const wrap = document.createElement("div");
  wrap.className = "mpb-wrap";

  const board = document.createElement("div");
  board.className = "mpb-board";

  const piggy = document.createElement("div");
  piggy.className = "mpb-piggy";

  const pigImg = document.createElement("img");
  pigImg.className = "mpb-piggy-img";
  pigImg.src = "../../assets/image/celengan.png";
  pigImg.alt = "Celengan";

  const pigSlot = document.createElement("div");
  pigSlot.className = "mpb-slot";
  pigSlot.innerHTML = "<span>Masukkan uang</span>";

  const total = document.createElement("div");
  total.className = "mpb-total";
  total.textContent = "Rp 0";

  const bar = document.createElement("div");
  bar.className = "mpb-bar";
  const barFill = document.createElement("div");
  barFill.className = "mpb-bar-fill";
  bar.appendChild(barFill);

  const piggyHead = document.createElement("div");
  piggyHead.className = "mpb-piggy-head";
  piggyHead.appendChild(pigImg);
  piggyHead.appendChild(bar);

  piggy.appendChild(piggyHead);
  piggy.appendChild(pigSlot);
  piggy.appendChild(total);

  const moneyArea = document.createElement("div");
  moneyArea.className = "mpb-money-area";

  const sfxPluk = new Audio("../../assets/sounds/click.mp3");
  sfxPluk.volume = 0.6;
  const sfxWrong = new Audio("../../assets/sounds/salah.mp3");
  sfxWrong.volume = 0.6;
  const sfxCorrect = new Audio("../../assets/sounds/benar.mp3");
  sfxCorrect.volume = 0.6;

  let currentSum = 0;
  const target = Number(q.data?.target || 50000);

  function updateUI() {
    total.textContent = `Rp ${formatRupiah(currentSum)}`;
    const pct = Math.min(100, (currentSum / target) * 100);
    barFill.style.height = `${pct}%`;
    piggy.classList.toggle("mpb-done", currentSum === target);
    onAnswerChange(currentSum);
  }

  function animateNote(sourceImg) {
    const rect = sourceImg.getBoundingClientRect();
    const targetRect = pigSlot.getBoundingClientRect();

    const fly = document.createElement("img");
    fly.src = sourceImg.src;
    fly.className = "mpb-fly";
    fly.style.left = `${rect.left}px`;
    fly.style.top = `${rect.top}px`;
    document.body.appendChild(fly);

    requestAnimationFrame(() => {
      fly.style.left = `${targetRect.left + targetRect.width / 2}px`;
      fly.style.top = `${targetRect.top + targetRect.height / 2}px`;
      fly.style.transform = "translate(-50%, -50%) scale(0.2)";
      fly.style.opacity = "0.3";
    });

    setTimeout(() => fly.remove(), 520);
  }

  function addMoney(value, imgEl) {
    const nextSum = currentSum + value;
    if (nextSum > target) {
      piggy.classList.add("mpb-wrong");
      setTimeout(() => piggy.classList.remove("mpb-wrong"), 300);
      try {
        sfxWrong.currentTime = 0;
        sfxWrong.play();
      } catch {}
      return;
    }

    currentSum = nextSum;
    animateNote(imgEl);
    piggy.classList.add("mpb-plung");
    setTimeout(() => piggy.classList.remove("mpb-plung"), 420);

    try {
      sfxPluk.currentTime = 0;
      sfxPluk.play();
    } catch {}

    if (currentSum === target) {
      try {
        sfxCorrect.currentTime = 0;
        sfxCorrect.play();
      } catch {}
    }
    updateUI();
  }

  let lastDraggedImg = null;
  (q.data?.moneyValues || []).forEach((value) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mpb-note";
    if (Number(value) === 500) btn.classList.add("mpb-note-coin");
    btn.draggable = true;
    btn.dataset.value = String(value);

    const img = document.createElement("img");
    img.src = `../../assets/image/${value}.png`;
    img.alt = `Uang ${value}`;
    img.draggable = false;

    btn.appendChild(img);
    btn.addEventListener("click", () => addMoney(Number(value), img));
    btn.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", String(value));
      btn.classList.add("dragging");
      lastDraggedImg = img;
    });
    btn.addEventListener("dragend", () => {
      btn.classList.remove("dragging");
      lastDraggedImg = null;
    });
    moneyArea.appendChild(btn);
  });

  function handleDragOver(e) {
    e.preventDefault();
    pigSlot.classList.add("over");
  }
  function handleDragLeave() {
    pigSlot.classList.remove("over");
  }
  function handleDrop(e) {
    e.preventDefault();
    pigSlot.classList.remove("over");
    const value = Number(e.dataTransfer.getData("text/plain"));
    const imgEl = lastDraggedImg || [...moneyArea.querySelectorAll(".mpb-note")].find(
      (b) => Number(b.dataset.value) === value
    )?.querySelector("img");
    if (imgEl && value) addMoney(value, imgEl);
    lastDraggedImg = null;
  }

  pigSlot.addEventListener("dragover", handleDragOver);
  pigSlot.addEventListener("dragleave", handleDragLeave);
  pigSlot.addEventListener("drop", handleDrop);

  pigImg.addEventListener("dragover", handleDragOver);
  pigImg.addEventListener("dragleave", handleDragLeave);
  pigImg.addEventListener("drop", handleDrop);

  board.appendChild(piggy);
  board.appendChild(moneyArea);
  wrap.appendChild(board);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(0);
  return {};
}
