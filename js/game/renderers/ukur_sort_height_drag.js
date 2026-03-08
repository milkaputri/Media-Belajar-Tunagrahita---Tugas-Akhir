export function renderUkurSortHeightDrag({ mount, q, onAnswerChange }){
  const slotCount = (q.data?.slots || []).length || 3;
  const slotValues = Array(slotCount).fill(null); // slotIndex -> itemId
  const itemButtons = new Map(); // itemId -> button
  const slotButtons = [];
  let draggingId = null;

  function injectStyles(){
    if(document.getElementById("ukur-sort-height-style")) return;
    const style = document.createElement("style");
    style.id = "ukur-sort-height-style";
    style.textContent = `
      .ukursh-wrap{
        width:100%;
        max-width:920px;
        margin:0 auto;
        padding:8px 6px 2px;
      }
      .ukursh-slots{
        display:grid;
        gap:16px;
        align-items:end;
        margin:8px 0 18px;
      }
      .ukursh-slot{
        min-height:150px;
        border:2px solid #222;
        background:#fff;
        border-radius:8px;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        padding:8px;
        position:relative;
        transition: transform .12s ease, box-shadow .2s ease, border-color .2s ease;
      }
      .ukursh-slot.selected{
        outline:3px solid #3b82f6;
        outline-offset:2px;
      }
      .ukursh-slot.drag-over{
        border-color:#3b82f6;
        box-shadow:0 0 0 3px rgba(59,130,246,.25);
        transform: translateY(-2px);
      }
      .ukursh-slot .ukursh-slotnum{
        position:absolute;
        top:6px;
        left:8px;
        font-weight:800;
        font-size:14px;
        color:#444;
      }
      .ukursh-slotimg{
        max-width:92%;
        max-height:144px;
        object-fit:contain;
        user-select:none;
        pointer-events:none;
      }
      .ukursh-tray{
        display:flex;
        justify-content:center;
        align-items:flex-end;
        gap:14px;
        flex-wrap:wrap;
        min-height:130px;
      }
      .ukursh-item{
        border:none;
        background:transparent;
        padding:4px;
        border-radius:10px;
        cursor:pointer;
        transition: transform .12s ease, box-shadow .2s ease, opacity .2s ease;
      }
      .ukursh-item img{
        width:124px;
        height:124px;
        object-fit:contain;
        display:block;
        user-select:none;
        pointer-events:none;
      }
      .ukursh-item.dragging{
        opacity:.5;
        transform: scale(.96);
      }
      .ukursh-item.draggable{
        animation: ukursh-wiggle 1.6s ease-in-out infinite;
      }
      .ukursh-item.used{
        opacity:.35;
      }
      .ukursh-hint{
        text-align:center;
        font-weight:700;
        color:#374151;
        font-size:14px;
        margin:0 0 10px;
      }
      @keyframes ukursh-wiggle{
        0%{ transform: translateY(0); }
        50%{ transform: translateY(-4px); }
        100%{ transform: translateY(0); }
      }
      @media (max-width: 640px){
        .ukursh-slots{ gap:10px; }
        .ukursh-slot{ min-height:120px; padding:6px; }
        .ukursh-slotimg{ max-height:108px; }
        .ukursh-item img{ width:94px; height:94px; }
      }
      @media (max-width: 520px){
        .ukursh-wrap{ padding:6px 2px 2px; }
        .ukursh-slots{
          grid-template-columns:repeat(2, minmax(100px, 1fr));
          gap:8px;
        }
        .ukursh-slot{ min-height:110px; }
        .ukursh-slotimg{ max-height:100px; }
        .ukursh-tray{ gap:8px; }
        .ukursh-item img{ width:86px; height:86px; }
        .ukursh-hint{ font-size:13px; }
      }
    `;
    document.head.appendChild(style);
  }

  function getItemById(id){
    return (q.data?.items || []).find((it) => it.id === id) || null;
  }

  function refreshTrayState(){
    itemButtons.forEach((btn, itemId) => {
      const used = slotValues.includes(itemId);
      btn.classList.toggle("used", used);
      btn.disabled = used;
      btn.setAttribute("aria-disabled", used ? "true" : "false");
    });
  }

  function emitAnswer(){
    const complete = slotValues.every(Boolean);
    onAnswerChange(complete ? slotValues.slice() : null);
  }

  function renderSlot(slotBtn, slotIndex){
    slotBtn.innerHTML = "";
    const num = document.createElement("div");
    num.className = "ukursh-slotnum";
    num.textContent = String(slotIndex + 1);
    slotBtn.appendChild(num);

    const itemId = slotValues[slotIndex];
    if(!itemId) return;

    const item = getItemById(itemId);
    if(!item) return;

    const img = document.createElement("img");
    img.className = "ukursh-slotimg";
    img.src = item.image;
    img.alt = `${item.name} ${item.level}`;
    slotBtn.appendChild(img);
  }

  function placeToSlot(slotIndex, itemId){
    if(!itemId){
      if(slotValues[slotIndex]){
        slotValues[slotIndex] = null;
        renderSlot(slotButtons[slotIndex], slotIndex);
        refreshTrayState();
        emitAnswer();
      }
      return;
    }

    const prevAtTarget = slotValues[slotIndex];
    if(prevAtTarget === itemId) return;

    const existingIndex = slotValues.findIndex((v) => v === itemId);
    if(existingIndex >= 0){
      slotValues[existingIndex] = prevAtTarget || null;
      renderSlot(slotButtons[existingIndex], existingIndex);
    }

    slotValues[slotIndex] = itemId;
    renderSlot(slotButtons[slotIndex], slotIndex);

    refreshTrayState();
    emitAnswer();
  }

  injectStyles();

  const wrap = document.createElement("div");
  wrap.className = "ukursh-wrap";

  const hint = document.createElement("div");
  hint.className = "ukursh-hint";
  hint.textContent = "Tarik gambar ke kotak urutan dari paling ringan ke paling berat.";

  const slotsRow = document.createElement("div");
  slotsRow.className = "ukursh-slots";
  slotsRow.style.gridTemplateColumns = `repeat(${slotCount}, minmax(110px, 1fr))`;

  (q.data?.slots || []).forEach((slot, slotIndex) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ukursh-slot";
    btn.setAttribute("aria-label", `Kotak urutan ${slotIndex + 1}`);
    btn.addEventListener("dragover", (e) => {
      e.preventDefault();
      btn.classList.add("drag-over");
    });
    btn.addEventListener("dragleave", () => {
      btn.classList.remove("drag-over");
    });
    btn.addEventListener("drop", (e) => {
      e.preventDefault();
      btn.classList.remove("drag-over");
      const itemId = e.dataTransfer?.getData("text/plain") || draggingId;
      if(!itemId) return;
      placeToSlot(slotIndex, itemId);
      if(draggingId && itemButtons.get(draggingId)){
        itemButtons.get(draggingId).classList.remove("dragging");
      }
      draggingId = null;
    });
    slotButtons.push(btn);
    renderSlot(btn, slotIndex);
    slotsRow.appendChild(btn);
  });

  const tray = document.createElement("div");
  tray.className = "ukursh-tray";

  (q.data?.items || []).forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ukursh-item";
    btn.setAttribute("aria-label", `${item.name} ${item.level}`);
    btn.setAttribute("draggable", "true");
    btn.classList.add("draggable");

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = `${item.name} ${item.level}`;
    btn.appendChild(img);

    btn.addEventListener("dragstart", (e) => {
      if(btn.disabled) return;
      draggingId = item.id;
      btn.classList.add("dragging");
      try {
        e.dataTransfer?.setData("text/plain", item.id);
        e.dataTransfer.effectAllowed = "move";
      } catch (_) {}
    });
    btn.addEventListener("dragend", () => {
      btn.classList.remove("dragging");
      draggingId = null;
    });

    itemButtons.set(item.id, btn);
    tray.appendChild(btn);
  });

  wrap.appendChild(hint);
  wrap.appendChild(slotsRow);
  wrap.appendChild(tray);

  mount.innerHTML = "";
  mount.appendChild(wrap);
  onAnswerChange(null);

  return {
    getAnswer: () => (slotValues.every(Boolean) ? slotValues.slice() : null)
  };
}
