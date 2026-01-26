export function renderMatchLineCountToNumber({ mount, q, onAnswerChange }) {
  // bersihin mount
  mount.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "ml-wrap";

  const board = document.createElement("div");
  board.className = "ml-board";

  // ✅ penting: kasih class ml-left/ml-right biar layout kanan muncul
  const leftCol = document.createElement("div");
  leftCol.className = "ml-col ml-left";

  const rightCol = document.createElement("div");
  rightCol.className = "ml-col ml-right";

  // ✅ konsisten: svg overlay garis
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("ml-lines");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");

  // state
  let activeLeftId = null;         // id kiri yang lagi dipilih
  const links = new Map();         // leftId -> rightId
  const leftById = new Map();
  const rightById = new Map();
  const linePalette = ["#FF6B6B", "#4D96FF", "#6BCF63", "#FFC700", "#9B5DE5", "#00C2A8"];
  const colorByLeftId = new Map();

  function centerOf(el) {
    const r = el.getBoundingClientRect();
    const p = board.getBoundingClientRect();
    return { x: r.left - p.left + r.width / 2, y: r.top - p.top + r.height / 2 };
  }

  function clearTemp() {
    const temp = svg.querySelector(".temp-line");
    if (temp) temp.remove();
  }

  function redraw() {
    // hapus semua line permanen
    [...svg.querySelectorAll(".perm-line")].forEach(l => l.remove());

    // gambar ulang tiap link
    links.forEach((rightId, leftId) => {
      const leftEl = board.querySelector(`[data-left="${leftId}"]`);
      const rightEl = board.querySelector(`[data-right="${rightId}"]`);
      if (!leftEl || !rightEl) return;

      const a = centerOf(leftEl);
      const b = centerOf(rightEl);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.classList.add("perm-line");
      line.setAttribute("stroke", colorByLeftId.get(leftId) || "#5b7cff");
      line.setAttribute("x1", a.x);
      line.setAttribute("y1", a.y);
      line.setAttribute("x2", b.x);
      line.setAttribute("y2", b.y);
      svg.appendChild(line);
    });

    // ready kalau semua kiri sudah punya link
    const ready = links.size === q.data.left.length;
    onAnswerChange(ready ? links : null);
  }

  function setActiveLeft(leftId) {
    activeLeftId = leftId;

    // reset highlight kiri
    board.querySelectorAll(".ml-card").forEach(c => c.classList.remove("selected"));
    if (!leftId) return;

    const el = board.querySelector(`[data-left="${leftId}"]`);
    if (el) el.classList.add("selected");
  }

  function connect(leftId, rightId) {
    const leftItem = leftById.get(leftId);
    const rightItem = rightById.get(rightId);
    if (!leftItem || !rightItem) return;

    // hanya izinkan garis kalau jumlah bintang = angka
    if (Number(leftItem.count) !== Number(rightItem.number)) {
      setActiveLeft(null);
      return;
    }

    // 1 left hanya boleh 1 garis
    links.set(leftId, rightId);

    // 1 right juga hanya boleh 1 garis (hapus yg lama kalau ada)
    for (const [l, r] of links.entries()) {
      if (l !== leftId && r === rightId) links.delete(l);
    }

    setActiveLeft(null);
    redraw();
  }

  // ----- build left cards (gambar)
  q.data.left.forEach((item, idx) => {
    leftById.set(item.id, item);
    colorByLeftId.set(item.id, linePalette[idx % linePalette.length]);
    const card = document.createElement("div");
    card.className = "ml-card";
    card.dataset.left = item.id;

    const grid = document.createElement("div");
    grid.className = "ml-icons";

    for (let i = 0; i < item.count; i++) {
      const ic = document.createElement("div");
      ic.className = "ml-ic";
      ic.textContent = item.icon || "⭐";
      grid.appendChild(ic);
    }

    const label = document.createElement("div");
    label.className = "ml-label";
    label.textContent = `${item.count} gambar`;

    card.appendChild(grid);
    card.appendChild(label);

    // TAP / CLICK pilih kiri
    card.addEventListener("click", () => setActiveLeft(item.id));

    // DRAG start (garis sementara)
    card.addEventListener("pointerdown", (e) => {
      setActiveLeft(item.id);
      clearTemp();

      const a = centerOf(card);
      const temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
      temp.classList.add("temp-line");
      temp.setAttribute("stroke", colorByLeftId.get(item.id) || "#5b7cff");
      temp.setAttribute("x1", a.x);
      temp.setAttribute("y1", a.y);
      temp.setAttribute("x2", a.x);
      temp.setAttribute("y2", a.y);
      svg.appendChild(temp);

      function move(ev) {
        const p = board.getBoundingClientRect();
        temp.setAttribute("x2", ev.clientX - p.left);
        temp.setAttribute("y2", ev.clientY - p.top);
      }

      function up() {
        window.removeEventListener("pointermove", move);
        clearTemp();
      }

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up, { once: true });
    });

    leftCol.appendChild(card);
  });

  // ----- build right cards (angka)
  q.data.right.forEach(item => {
    rightById.set(item.id, item);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "ml-card ml-number";  // tetap pakai class kamu
    card.dataset.right = item.id;
    card.textContent = item.number;

    card.addEventListener("click", () => {
      if (!activeLeftId) return;
      connect(activeLeftId, item.id);
    });

    rightCol.appendChild(card);
  });

  // ✅ urutan append penting: svg di atas kolom (overlay)
  board.appendChild(leftCol);
  board.appendChild(rightCol);
  board.appendChild(svg);

  wrap.appendChild(board);
  mount.appendChild(wrap);

  // redraw saat resize (posisi garis berubah)
  const onResize = () => requestAnimationFrame(redraw);
  window.addEventListener("resize", onResize);

  // pastikan garis kebentuk setelah DOM ke-render
  requestAnimationFrame(redraw);
  onAnswerChange(null);

  return {
    getAnswer: () => links,
    destroy: () => window.removeEventListener("resize", onResize),
  };
}
