function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value));
}

export function renderMoneyDragMatch({ mount, q, onAnswerChange }) {
  const wrap = document.createElement("div");
  wrap.className = "money-wrap";

  const board = document.createElement("div");
  board.className = "money-board";

  const pool = document.createElement("div");
  pool.className = "money-pool";

  const answerMap = new Map();
  let selectedNote = null;

  const sfxCorrect = new Audio("../../assets/sounds/benar.mp3");
  sfxCorrect.volume = 0.6;
  const sfxWrong = new Audio("../../assets/sounds/salah.mp3");
  sfxWrong.volume = 0.6;

  function setSelected(note) {
    selectedNote = note;
    pool.querySelectorAll(".money-note").forEach((el) => {
      el.classList.toggle("selected", el === note);
    });
  }

  function clearSelected() {
    selectedNote = null;
    pool.querySelectorAll(".money-note").forEach((el) => {
      el.classList.remove("selected");
    });
  }

  function acceptDrop(noteEl, item) {
    const slot = board.querySelector(`[data-item-id="${item.id}"] .money-drop`);
    if (!slot || slot.classList.contains("filled")) return false;

    const value = Number(noteEl.dataset.value);
    if (value !== Number(item.price)) {
      noteEl.classList.add("wrong");
      setTimeout(() => noteEl.classList.remove("wrong"), 300);
      try {
        sfxWrong.currentTime = 0;
        sfxWrong.play();
      } catch {}
      clearSelected();
      return false;
    }

    slot.classList.add("filled");
    slot.classList.add("cling");
    setTimeout(() => slot.classList.remove("cling"), 360);

    noteEl.classList.add("used");
    noteEl.draggable = false;
    slot.appendChild(noteEl);

    answerMap.set(item.id, value);
    onAnswerChange(new Map(answerMap));

    try {
      sfxCorrect.currentTime = 0;
      sfxCorrect.play();
    } catch {}

    clearSelected();
    return true;
  }

  q.data.items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "money-card";
    card.dataset.itemId = item.id;

    const name = document.createElement("div");
    name.className = "money-name";
    name.textContent = item.name;

    const illus = document.createElement("div");
    illus.className = "money-illus";

    const icon = document.createElement("div");
    icon.className = "money-icon";
    icon.innerHTML = item.icon || "&#9733;";

    const price = document.createElement("div");
    price.className = "money-price";
    price.textContent = `Rp ${formatRupiah(item.price)}`;

    const drop = document.createElement("div");
    drop.className = "money-drop";
    drop.dataset.price = item.price;
    drop.innerHTML = `<span>Taruh uangmu di sini</span>`;

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
      if (noteEl) acceptDrop(noteEl, item);
    });

    drop.addEventListener("click", () => {
      if (selectedNote) acceptDrop(selectedNote, item);
    });

    illus.appendChild(name);
    illus.appendChild(icon);
    illus.appendChild(price);

    card.appendChild(illus);
    card.appendChild(drop);
    board.appendChild(card);
  });

  (q.data.moneyValues || []).forEach((value, idx) => {
    const note = document.createElement("div");
    note.className = "money-note";
    note.dataset.value = value;
    note.dataset.noteId = `note-${idx}-${value}`;
    note.draggable = true;

    const img = document.createElement("img");
    img.src = q.data.moneyImages?.[value] || `../../assets/image/${value}.png`;
    img.alt = `Uang ${value}`;
    img.draggable = false;

    note.appendChild(img);

    note.addEventListener("click", () => {
      if (note.classList.contains("used")) return;
      setSelected(note);
    });

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
