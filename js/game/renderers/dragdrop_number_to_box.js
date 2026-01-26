export function renderDragDropNumberToBox({ mount, q, onAnswerChange }){
  let selected = null;

  const wrap = document.createElement("div");
  wrap.className = "dd-wrap";

  const box = document.createElement("div");
  box.className = "dd-box";

  const grid = document.createElement("div");
  grid.className = "dd-grid";

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

  const opts = document.createElement("div");
  opts.className = "dd-options";

  function setSelected(v){
    selected = v;
    onAnswerChange(v);
    [...opts.querySelectorAll(".dd-opt")].forEach(b=>{
      b.classList.toggle("selected", Number(b.dataset.v) === Number(v));
    });
  }

  q.data.options.forEach(v=>{
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dd-opt";
    b.textContent = v;
    b.dataset.v = v;
    b.draggable = true;

    // tap
    b.addEventListener("click", ()=>setSelected(v));

    // drag
    b.addEventListener("dragstart", (e)=>{
      e.dataTransfer.setData("text/plain", String(v));
    });

    opts.appendChild(b);
  });

  // drop target
  box.addEventListener("dragover", (e)=>{ e.preventDefault(); box.classList.add("over"); });
  box.addEventListener("dragleave", ()=>box.classList.remove("over"));
  box.addEventListener("drop", (e)=>{
    e.preventDefault();
    box.classList.remove("over");
    const v = e.dataTransfer.getData("text/plain");
    if(v) setSelected(Number(v));
  });

  // tap-to-drop confirm (optional)
  box.addEventListener("click", ()=>{
    if(selected !== null){
      box.classList.add("accepted");
      setTimeout(()=>box.classList.remove("accepted"), 200);
    }
  });

  wrap.appendChild(box);
  wrap.appendChild(opts);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);

  return { getAnswer: ()=>selected };
}
