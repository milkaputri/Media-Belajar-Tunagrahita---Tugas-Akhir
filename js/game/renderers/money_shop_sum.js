function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value));
}

export function renderMoneyShopSum({ mount, q, onAnswerChange }) {
  const wrap = document.createElement("div");
  wrap.className = "money-wrap money-shop";

  const board = document.createElement("div");
  board.className = "money-board";

  const pool = document.createElement("div");
  pool.className = "money-pool";

  const sfxCorrect = new Audio("../../assets/sounds/benar.mp3");
  sfxCorrect.volume = 0.6;
  const sfxWrong = new Audio("../../assets/sounds/salah.mp3");
  sfxWrong.volume = 0.6;

  let currentSum = 0;
  const minNotes = q.data?.minNotes ?? 2;
  const maxNotes = q.data?.maxNotes ?? 3;

  const card = document.createElement("div");
  card.className = "money-card money-shop-card";

  const stand = document.createElement("div");
  stand.className = "money-stand";

  const standBg = document.createElement("img");
  standBg.className = "money-stand-bg";
  standBg.src = "../../assets/image/warung.png";
  standBg.alt = "Warung";

  const name = document.createElement("div");
  name.className = "money-stand-name";
  name.textContent = q.data?.item?.name || "Barang";

  const icon = document.createElement("div");
  icon.className = "money-icon money-shop-icon";
  icon.innerHTML = q.data?.item?.icon || "&#9733;";

  const price = document.createElement("div");
  price.className = "money-price money-price-board";
  price.textContent = `Rp ${formatRupiah(q.answer)}`;

  stand.appendChild(standBg);
  stand.appendChild(icon);
  stand.appendChild(price);

  const drop = document.createElement("div");
  drop.className = "money-drop money-drop-field";
  drop.innerHTML = `<span>Bayar di sini</span>`;

  const dropNotes = document.createElement("div");
  dropNotes.className = "money-drop-notes";
  drop.appendChild(dropNotes);

  const cashier = document.createElement("img");
  cashier.className = "money-cashier";
  cashier.src = "../../assets/image/kasir.png";
  cashier.alt = "Kasir";
  drop.appendChild(cashier);

  function updateAnswer() {
    const count = dropNotes.querySelectorAll(".money-note").length;
    onAnswerChange({ sum: currentSum, count });
  }

  function markWrong(noteEl) {
    noteEl.classList.add("wrong");
    setTimeout(() => noteEl.classList.remove("wrong"), 300);
    try {
      sfxWrong.currentTime = 0;
      sfxWrong.play();
    } catch {}
  }

  function placeNote(noteEl) {
    if (drop.classList.contains("filled")) return false;
    if (noteEl.classList.contains("used")) return false;

    const value = Number(noteEl.dataset.value || 0);
    const nextSum = currentSum + value;
    if (nextSum > Number(q.answer)) {
      markWrong(noteEl);
      return false;
    }

    currentSum = nextSum;
    noteEl.classList.add("used", "in-drop");
    noteEl.draggable = false;
    dropNotes.appendChild(noteEl);
    drop.classList.add("has-note");

    noteEl.addEventListener("click", () => {
      if (drop.classList.contains("filled")) return;
      if (!noteEl.classList.contains("in-drop")) return;
      currentSum -= value;
      noteEl.classList.remove("used", "in-drop");
      noteEl.draggable = true;
      pool.appendChild(noteEl);
      if (!dropNotes.children.length) drop.classList.remove("has-note");
      updateAnswer();
    }, { once: true });

    const count = dropNotes.querySelectorAll(".money-note").length;
    if (currentSum === Number(q.answer) && count >= minNotes && count <= maxNotes) {
      drop.classList.add("filled");
      try {
        sfxCorrect.currentTime = 0;
        sfxCorrect.play();
      } catch {}
    }

    updateAnswer();
    return true;
  }

  drop.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!drop.classList.contains("filled")) drop.classList.add("over");
  });
  drop.addEventListener("dragleave", () => drop.classList.remove("over"));
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    drop.classList.remove("over");
    const noteId = e.dataTransfer.getData("text/plain");
    const noteEl = noteId ? pool.querySelector(`[data-note-id="${noteId}"]`) : null;
    if (noteEl) placeNote(noteEl);
  });

  const left = document.createElement("div");
  left.className = "money-shop-left";
  left.appendChild(name);
  left.appendChild(stand);

  card.appendChild(left);
  card.appendChild(drop);
  board.appendChild(card);

  (q.data?.moneyValues || []).forEach((value, idx) => {
    const note = document.createElement("div");
    note.className = "money-note";
    note.dataset.value = value;
    note.dataset.noteId = `note-${idx}-${value}`;
    note.draggable = true;

    const img = document.createElement("img");
    img.src = `../../assets/image/${value}.png`;
    img.alt = `Uang ${value}`;
    img.draggable = false;

    note.appendChild(img);

    note.addEventListener("dragstart", (e) => {
      if (note.classList.contains("used")) return;
      e.dataTransfer.setData("text/plain", note.dataset.noteId);
    });

    pool.appendChild(note);
  });

  wrap.appendChild(board);
  wrap.appendChild(pool);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);
  return {};
}
