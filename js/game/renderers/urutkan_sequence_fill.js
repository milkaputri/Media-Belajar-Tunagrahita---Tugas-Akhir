export function renderUrutkanSequenceFill({ mount, q, onAnswerChange }){
  let selected = null;
  const slots = new Map(); // index -> value
  const optionButtons = new Map(); // value -> button
  const colorPalette = ["#FFD166", "#8EECF5", "#C3F584", "#FFADAD", "#BDB2FF", "#FFD6A5"];
  const colorByValue = new Map();

  const wrap = document.createElement("div");
  wrap.className = "seq-wrap";

  const grid = document.createElement("div");
  grid.className = "seq-grid";

  const options = document.createElement("div");
  options.className = "seq-options";

  function setSelected(v){
    selected = v;
    optionButtons.forEach((btn, val) => {
      btn.classList.toggle("selected", Number(val) === Number(v));
    });
  }

  function setSlot(index, value){
    // jika nilai sudah dipakai di slot lain, kosongkan dulu
    for(const [idx, val] of slots.entries()){
      if(Number(val) === Number(value) && idx !== index){
        slots.delete(idx);
        const slotEl = grid.querySelector(`[data-slot="${idx}"]`);
        if(slotEl){
          slotEl.textContent = "";
          slotEl.classList.remove("filled");
        }
      }
    }

    // jika slot sudah terisi, re-enable tombol sebelumnya
    if(slots.has(index)){
      const prev = slots.get(index);
      const prevBtn = optionButtons.get(prev);
      if(prevBtn){
        prevBtn.disabled = false;
        prevBtn.classList.remove("used");
      }
    }

    slots.set(index, value);
    const slotEl = grid.querySelector(`[data-slot="${index}"]`);
    if(slotEl){
      slotEl.textContent = value;
      slotEl.classList.add("filled");
      const color = colorByValue.get(value);
      if(color){
        slotEl.style.setProperty("--seq-fill-bg", color);
        slotEl.style.borderColor = color;
      }
    }

    const btn = optionButtons.get(value);
    if(btn){
      btn.disabled = true;
      btn.classList.add("used");
    }

    // cek lengkap
    const complete = slots.size === q.data.blanks.length;
    onAnswerChange(complete ? new Map(slots) : null);
  }

  q.data.sequence.forEach((num, i) => {
    if(q.data.blanks.includes(i)){
      const slot = document.createElement("div");
      slot.className = "seq-slot";
      slot.dataset.slot = String(i);

      slot.addEventListener("dragover", (e)=>{ e.preventDefault(); slot.classList.add("over"); });
      slot.addEventListener("dragleave", ()=>slot.classList.remove("over"));
      slot.addEventListener("drop", (e)=>{
        e.preventDefault();
        slot.classList.remove("over");
        const v = e.dataTransfer.getData("text/plain");
        if(v) setSlot(i, Number(v));
      });

      slot.addEventListener("click", ()=>{
        if(selected !== null){
          setSlot(i, Number(selected));
          setSelected(null);
        }
      });

      grid.appendChild(slot);
    } else {
      const cell = document.createElement("div");
      cell.className = "seq-cell";
      cell.textContent = num;
      grid.appendChild(cell);
    }
  });

  q.data.options.forEach((v, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "seq-opt";
    b.textContent = v;
    b.dataset.v = v;
    b.draggable = true;
    const color = colorPalette[idx % colorPalette.length];
    colorByValue.set(v, color);
    b.style.setProperty("--seq-opt-bg", color);

    b.addEventListener("click", ()=>setSelected(v));
    b.addEventListener("dragstart", (e)=>{
      e.dataTransfer.setData("text/plain", String(v));
    });

    optionButtons.set(v, b);
    options.appendChild(b);
  });

  wrap.appendChild(grid);
  wrap.appendChild(options);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);

  return { getAnswer: () => new Map(slots) };
}
