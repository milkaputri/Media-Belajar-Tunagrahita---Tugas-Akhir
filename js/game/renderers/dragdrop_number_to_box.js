// js/game/renderers/dragdrop_number_to_box.js

export function renderDragDropNumberToBox({ mount, q, onAnswerChange }){
  // state lokal
  let selected = null;

  // wrapper
  const wrap = document.createElement("div");
  wrap.className = "dd-wrap";

  // area ikon (kotak)
  const box = document.createElement("div");
  box.className = "dd-box";
  box.tabIndex = 0;
  box.setAttribute("aria-label", "Kotak jawaban");

  const grid = document.createElement("div");
  grid.className = "dd-grid";

  // render ikon sesuai count
  for(let i=0;i<q.data.count;i++){
    const it = document.createElement("div");
    it.className = "dd-item";
    it.textContent = q.data.icon || "⭐";
    grid.appendChild(it);
  }

  const hint = document.createElement("div");
  hint.className = "dd-hint";
  hint.textContent = "Tarik angka ke kotak (atau tap angka lalu tap kotak)";

  box.appendChild(grid);
  box.appendChild(hint);

  // pilihan angka
  const opts = document.createElement("div");
  opts.className = "dd-options";

  function setSelected(v){
    selected = v;
    onAnswerChange(selected);
    // highlight yg dipilih
    [...opts.querySelectorAll(".dd-opt")].forEach(b=>{
      b.classList.toggle("selected", Number(b.dataset.v) === Number(v));
    });
  }

  q.data.options.forEach(v=>{
    const b = document.createElement("button");
    b.className = "dd-opt";
    b.type = "button";
    b.textContent = v;
    b.dataset.v = v;
    b.draggable = true;

    // tap mode
    b.addEventListener("click", () => setSelected(v));

    // drag start
    b.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", String(v));
    });

    opts.appendChild(b);
  });

  // drop handlers
  box.addEventListener("dragover", (e) => {
    e.preventDefault();
    box.classList.add("over");
  });
  box.addEventListener("dragleave", () => box.classList.remove("over"));

  box.addEventListener("drop", (e) => {
    e.preventDefault();
    box.classList.remove("over");
    const v = e.dataTransfer.getData("text/plain");
    if(v !== null && v !== "") setSelected(Number(v));
  });

  // tap-to-drop: jika user sudah pilih angka, tap kotak untuk “masukkan”
  box.addEventListener("click", () => {
    if(selected !== null){
      box.classList.add("accepted");
      setTimeout(()=>box.classList.remove("accepted"), 250);
    }
  });

  wrap.appendChild(box);
  wrap.appendChild(opts);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  // reset awal
  onAnswerChange(null);

  return {
    getAnswer: () => selected
  };
}
