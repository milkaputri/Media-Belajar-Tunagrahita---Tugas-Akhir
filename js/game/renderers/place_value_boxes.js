export function renderPlaceValueBoxes({ mount, q, onAnswerChange }) {
  const wrap = document.createElement("div");
  wrap.className = "pv-wrap";

  const board = document.createElement("div");
  board.className = "pv-board";

  const labels = q.data?.labels || ["1.000","100","10","1"];
  const target = q.data?.digits || [0,0,0,0];
  const totalItems = Number(q.data?.totalItems ?? 15);
  const itemEmoji = q.data?.itemEmoji || "🍎";

  const counts = [0,0,0,0];
  let dragId = null;

  function updateAnswer() {
    onAnswerChange(counts.slice());
  }

  function makeBox(label, idx) {
    const box = document.createElement("div");
    box.className = "pv-box";
    box.dataset.index = String(idx);

    const slot = document.createElement("div");
    slot.className = "pv-slot";

    const cap = document.createElement("div");
    cap.className = "pv-label";
    const labelName = q.data?.labelNames?.[idx] || "";
    const labelValue = q.data?.labelValues?.[idx] || label;
    cap.innerHTML = `
      <div class="pv-label-name">${labelName}</div>
      <div class="pv-label-value">${labelValue}</div>
    `;

    const counter = document.createElement("div");
    counter.className = "pv-count";
    counter.textContent = "0";

    box.appendChild(slot);
    box.appendChild(counter);
    box.appendChild(cap);

    box.addEventListener("dragover", (e) => {
      e.preventDefault();
      box.classList.add("over");
    });
    box.addEventListener("dragleave", () => box.classList.remove("over"));
    box.addEventListener("drop", (e) => {
      e.preventDefault();
      box.classList.remove("over");
      if (!dragId) return;
      const el = document.getElementById(dragId);
      if (!el) return;
      slot.appendChild(el);
      counts[idx] = slot.children.length;
      counter.textContent = String(counts[idx]);
      updateAnswer();
    });

    return { box, slot, counter };
  }

  const boxes = labels.map((label, idx) => makeBox(label, idx));
  boxes.forEach(b => board.appendChild(b.box));

  const pool = document.createElement("div");
  pool.className = "pv-pool";
  pool.addEventListener("dragover", (e) => {
    e.preventDefault();
    pool.classList.add("over");
  });
  pool.addEventListener("dragleave", () => pool.classList.remove("over"));
  pool.addEventListener("drop", (e) => {
    e.preventDefault();
    pool.classList.remove("over");
    if (!dragId) return;
    const el = document.getElementById(dragId);
    if (!el) return;
    pool.appendChild(el);
    boxes.forEach((b, i) => {
      counts[i] = b.slot.children.length;
      b.counter.textContent = String(counts[i]);
    });
    updateAnswer();
  });

  for (let i = 0; i < totalItems; i++) {
    const item = document.createElement("div");
    item.className = "pv-item";
    item.id = `pv-item-${i}-${Date.now()}`;
    item.draggable = true;
    item.textContent = itemEmoji;
    item.addEventListener("dragstart", (e) => {
      dragId = item.id;
      e.dataTransfer.setData("text/plain", item.id);
    });
    item.addEventListener("dragend", () => {
      dragId = null;
    });
    pool.appendChild(item);
  }

  wrap.appendChild(board);
  wrap.appendChild(pool);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  updateAnswer();
  return {};
}
