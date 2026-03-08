function speakText(text){
  if(!window.speechSynthesis) return;
  try{
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "id-ID";
    utter.rate = 0.95;
    utter.pitch = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }catch {}
}

export function renderUkurDayCompleteDrag({ mount, q, onAnswerChange }){
  let selectedId = null;
  let dragId = null;

  function injectStyles(){
    if(document.getElementById("ukur-day-complete-style")) return;
    const style = document.createElement("style");
    style.id = "ukur-day-complete-style";
    style.textContent = `
      .ukurday-wrap{
        width:100%;
        max-width:980px;
        margin:0 auto;
        display:grid;
        grid-template-columns: minmax(0, 1fr) 300px;
        gap:16px;
        align-items:center;
      }
      .ukurday-stage{
        position:relative;
        width:100%;
        height:360px;
        border-radius:18px;
        overflow:hidden;
        background: transparent;
        box-shadow: 0 16px 32px rgba(0,0,0,.12);
        border:2px solid rgba(0,0,0,.08);
      }
      .ukurday-bg{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        object-fit:cover;
        pointer-events:none;
        user-select:none;
      }
      .ukurday-sign{
        position:absolute;
        bottom:18%;
        width:160px;
        height:auto;
        user-select:none;
        pointer-events:none;
        filter: drop-shadow(0 8px 10px rgba(0,0,0,.18));
      }
      .ukurday-sign.left{ left:8%; }
      .ukurday-sign.right{ right:8%; }

      .ukurday-slot{
        position:absolute;
        left:50%;
        top:28%;
        transform: translateX(-50%);
        width:180px;
        height:220px;
        border:3px dashed rgba(90,50,20,.6);
        border-radius:12px;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        background: rgba(255,255,255,.25);
        transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
      }
      .ukurday-slot.over{
        border-color:#3b82f6;
        box-shadow:0 0 0 4px rgba(59,130,246,.25);
        transform: translateX(-50%) scale(1.02);
      }
      .ukurday-slot img{
        width:160px;
        height:auto;
        object-fit:contain;
        pointer-events:none;
        user-select:none;
      }
      .ukurday-options{
        display:grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        column-gap:50px;
        row-gap:50px;
        align-content:center;
        justify-items:center;
      }
      .ukurday-btn{
        border:none;
        background:transparent;
        padding:4px;
        border-radius:12px;
        cursor:pointer;
        transition: transform .12s ease, box-shadow .2s ease, opacity .2s ease;
      }
      .ukurday-btn img{
        width:120px;
        height:auto;
        display:block;
        pointer-events:none;
        user-select:none;
      }
      .ukurday-btn.selected{
        box-shadow:0 0 0 3px #60a5fa inset;
        background: rgba(219,234,254,.7);
      }
      .ukurday-btn.dragging{ opacity:.6; transform: scale(.96); }
      .ukurday-btn.used{ opacity:.35; }
      .ukurday-hint{
        grid-column: 1 / -1;
        text-align:center;
        font-weight:800;
        color:#374151;
      }
      @media (max-width: 640px){
        .ukurday-wrap{
          grid-template-columns: 1fr;
          gap:12px;
        }
        .ukurday-stage{ height:240px; }
        .ukurday-sign{ width:100px; height:auto; }
        .ukurday-slot{ width:140px; height:170px; }
        .ukurday-slot img{ width:120px; height:auto; }
        .ukurday-btn img{ width:86px; height:auto; }
      }
    `;
    document.head.appendChild(style);
  }

  function setSelected(id){
    selectedId = id;
    optionButtons.forEach((btn, itemId) => {
      btn.classList.toggle("selected", itemId === id);
    });
  }

  function placeToSlot(id){
    if(!id) return;
    slotValue = id;
    renderSlot();
    refreshOptions();
    onAnswerChange(id);
  }

  function refreshOptions(){
    optionButtons.forEach((btn, itemId) => {
      const used = slotValue === itemId;
      btn.classList.toggle("used", used);
      btn.disabled = used;
    });
  }

  function renderSlot(){
    slot.innerHTML = "";
    if(!slotValue) return;
    const item = (q.data?.options || []).find((it) => it.id === slotValue);
    if(!item) return;
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    slot.appendChild(img);
  }

  injectStyles();

  const wrap = document.createElement("div");
  wrap.className = "ukurday-wrap";

  const hint = document.createElement("div");
  hint.className = "ukurday-hint";
  hint.textContent = "Tarik papan hari ke kotak yang kosong.";

  const stage = document.createElement("div");
  stage.className = "ukurday-stage";

  const bg = document.createElement("img");
  bg.className = "ukurday-bg";
  bg.src = q.data?.background || "../../assets/image/bgHari.png";
  bg.alt = "";

  const leftImg = document.createElement("img");
  leftImg.className = "ukurday-sign left";
  leftImg.src = q.data?.left?.image || "";
  leftImg.alt = q.data?.left?.name || "";

  const rightImg = document.createElement("img");
  rightImg.className = "ukurday-sign right";
  rightImg.src = q.data?.right?.image || "";
  rightImg.alt = q.data?.right?.name || "";

  const slot = document.createElement("div");
  slot.className = "ukurday-slot";
  let slotValue = null;

  slot.addEventListener("dragover", (e) => {
    e.preventDefault();
    slot.classList.add("over");
  });
  slot.addEventListener("dragleave", () => slot.classList.remove("over"));
  slot.addEventListener("drop", (e) => {
    e.preventDefault();
    slot.classList.remove("over");
    const id = e.dataTransfer?.getData("text/plain") || dragId;
    if(!id) return;
    placeToSlot(id);
    dragId = null;
  });
  slot.addEventListener("click", () => {
    if(selectedId){
      placeToSlot(selectedId);
    }
  });

  stage.appendChild(bg);
  stage.appendChild(leftImg);
  stage.appendChild(rightImg);
  stage.appendChild(slot);

  const options = document.createElement("div");
  options.className = "ukurday-options";

  const optionButtons = new Map();
  (q.data?.options || []).forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ukurday-btn";
    btn.setAttribute("aria-label", item.name);
    btn.setAttribute("draggable", "true");

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    btn.appendChild(img);

    btn.addEventListener("click", () => {
      if(btn.disabled) return;
      setSelected(selectedId === item.id ? null : item.id);
      speakText(item.name);
    });
    btn.addEventListener("dragstart", (e) => {
      if(btn.disabled) return;
      dragId = item.id;
      btn.classList.add("dragging");
      try{
        e.dataTransfer?.setData("text/plain", item.id);
        e.dataTransfer.effectAllowed = "move";
      }catch {}
      speakText(item.name);
    });
    btn.addEventListener("dragend", () => {
      btn.classList.remove("dragging");
      dragId = null;
    });

    optionButtons.set(item.id, btn);
    options.appendChild(btn);
  });

  wrap.appendChild(hint);
  wrap.appendChild(stage);
  wrap.appendChild(options);

  mount.innerHTML = "";
  mount.appendChild(wrap);
  onAnswerChange(null);

  return {
    getAnswer: () => slotValue
  };
}
