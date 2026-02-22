export function renderUkurSortHeightDrag({ mount, q, onAnswerChange }){
  let selectedId = null;
  const slotValues = [null, null, null]; // slotIndex -> itemId
  const itemButtons = new Map(); // itemId -> button
  const slotButtons = [];

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
        grid-template-columns:repeat(3, minmax(110px, 1fr));
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
      }
      .ukursh-slot.selected{
        outline:3px solid #3b82f6;
        outline-offset:2px;
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
        max-width:90%;
        max-height:128px;
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
      }
      .ukursh-item img{
        width:110px;
        height:110px;
        object-fit:contain;
        display:block;
        user-select:none;
      }
      .ukursh-item.selected{
        background:#dbeafe;
        box-shadow:0 0 0 3px #60a5fa inset;
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
      @media (max-width: 640px){
        .ukursh-slots{ gap:10px; }
        .ukursh-slot{ min-height:120px; padding:6px; }
        .ukursh-slotimg{ max-height:95px; }
        .ukursh-item img{ width:84px; height:84px; }
      }
    `;
    document.head.appendChild(style);
  }

  function getItemById(id){
    return (q.data?.items || []).find((it) => it.id === id) || null;
  }

  function setSelected(id){
    selectedId = id;
    itemButtons.forEach((btn, itemId) => {
      btn.classList.toggle("selected", itemId === id);
    });
    slotButtons.forEach((btn) => {
      btn.classList.toggle("selected", !!id);
    });
  }

  function refreshTrayState(){
    itemButtons.forEach((btn, itemId) => {
      const used = slotValues.includes(itemId);
      btn.classList.toggle("used", used);
      btn.disabled = used;
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

  function placeToSlot(slotIndex){
    if(!selectedId){
      if(slotValues[slotIndex]){
        slotValues[slotIndex] = null;
        renderSlot(slotButtons[slotIndex], slotIndex);
        refreshTrayState();
        emitAnswer();
      }
      return;
    }

    const prevAtTarget = slotValues[slotIndex];
    if(prevAtTarget === selectedId){
      setSelected(null);
      return;
    }

    const existingIndex = slotValues.findIndex((v) => v === selectedId);
    if(existingIndex >= 0){
      slotValues[existingIndex] = prevAtTarget || null;
      renderSlot(slotButtons[existingIndex], existingIndex);
    }

    slotValues[slotIndex] = selectedId;
    renderSlot(slotButtons[slotIndex], slotIndex);

    refreshTrayState();
    setSelected(null);
    emitAnswer();
  }

  injectStyles();

  const wrap = document.createElement("div");
  wrap.className = "ukursh-wrap";

  const hint = document.createElement("div");
  hint.className = "ukursh-hint";
  hint.textContent = "Pilih gambar lalu klik kotak 1, 2, 3 (klik kotak lagi untuk mengosongkan)";

  const slotsRow = document.createElement("div");
  slotsRow.className = "ukursh-slots";

  (q.data?.slots || []).forEach((slot, slotIndex) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ukursh-slot";
    btn.setAttribute("aria-label", `Kotak urutan ${slotIndex + 1}`);
    btn.addEventListener("click", () => placeToSlot(slotIndex));
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

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = `${item.name} ${item.level}`;
    btn.appendChild(img);

    btn.addEventListener("click", () => {
      if(btn.disabled) return;
      setSelected(selectedId === item.id ? null : item.id);
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
