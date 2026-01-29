function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function buildPizza({ parts, numerator, label, onSelectChange }) {
  const pizzaImg = "../../assets/image/pizza.png";
  const wrap = document.createElement("div");
  wrap.className = "pc-pizza";

  const badge = document.createElement("div");
  badge.className = "pc-frac";
  badge.textContent = label;

  const area = document.createElement("div");
  area.className = "pc-area";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.classList.add("pc-svg");

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
  pattern.setAttribute("id", `pizzaPattern-${label}`);
  pattern.setAttribute("patternUnits", "userSpaceOnUse");
  pattern.setAttribute("width", "100");
  pattern.setAttribute("height", "100");

  const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
  image.setAttribute("href", pizzaImg);
  image.setAttribute("x", "0");
  image.setAttribute("y", "0");
  image.setAttribute("width", "100");
  image.setAttribute("height", "100");

  pattern.appendChild(image);
  defs.appendChild(pattern);
  svg.appendChild(defs);

  const angleStep = 360 / parts;
  const slices = [];
  for (let i = 0; i < parts; i++) {
    const start = i * angleStep;
    const end = start + angleStep;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", describeArc(50, 50, 45, start, end));
    path.setAttribute("fill", `url(#pizzaPattern-${label})`);
    path.classList.add("pc-slice");
    path.dataset.slice = String(i);
    svg.appendChild(path);
    slices.push(path);
  }

  const border = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  border.setAttribute("cx", "50");
  border.setAttribute("cy", "50");
  border.setAttribute("r", "45");
  border.classList.add("pc-border");
  svg.appendChild(border);

  const status = document.createElement("div");
  status.className = "pc-status";
  status.textContent = "";

  area.appendChild(svg);
  area.appendChild(status);
  wrap.appendChild(area);
  wrap.appendChild(badge);

  slices.forEach((slice) => {
    slice.addEventListener("click", () => {
      slice.classList.toggle("selected");
      if (slice.classList.contains("selected")) {
        svg.appendChild(slice);
      }
      const count = slices.filter(s => s.classList.contains("selected")).length;
      if (count === numerator) {
        status.textContent = "✔";
        status.classList.add("show");
        status.classList.remove("wrong");
      } else if (count > numerator) {
        status.textContent = "✖";
        status.classList.add("show", "wrong");
      } else {
        status.textContent = "";
        status.classList.remove("show", "wrong");
      }
      onSelectChange(count === numerator);
    });
  });

  return { wrap };
}

export function renderPizzaCompareDrag({ mount, q, onAnswerChange }) {
  const left = q.data?.left || { n: 1, d: 2 };
  const right = q.data?.right || { n: 1, d: 2 };
  const choices = q.data?.choices || ["<", ">", "="];

  let leftOk = false;
  let rightOk = false;

  const wrap = document.createElement("div");
  wrap.className = "pc-wrap";

  const board = document.createElement("div");
  board.className = "pc-board";

  const pizzas = document.createElement("div");
  pizzas.className = "pc-pizzas";

  const leftPizza = buildPizza({
    parts: left.d,
    numerator: left.n,
    label: `${left.n}/${left.d}`,
    onSelectChange: (ok) => {
      leftOk = ok;
      updateDropState();
    }
  });
  const rightPizza = buildPizza({
    parts: right.d,
    numerator: right.n,
    label: `${right.n}/${right.d}`,
    onSelectChange: (ok) => {
      rightOk = ok;
      updateDropState();
    }
  });

  pizzas.appendChild(leftPizza.wrap);
  pizzas.appendChild(rightPizza.wrap);

  const compare = document.createElement("div");
  compare.className = "pc-compare";

  const slot = document.createElement("div");
  slot.className = "pc-slot";
  slot.textContent = "?";

  const signs = document.createElement("div");
  signs.className = "pc-signs";

  function updateDropState() {
    const ready = leftOk && rightOk;
    signs.querySelectorAll(".pc-sign").forEach(btn => {
      btn.disabled = !ready;
      if (!ready) btn.classList.remove("dragging");
    });
    slot.classList.toggle("locked", !ready);
  }

  function enableDrop(el) {
    el.addEventListener("dragover", (e) => {
      if (el.classList.contains("locked")) return;
      e.preventDefault();
      el.classList.add("over");
    });
    el.addEventListener("dragleave", () => el.classList.remove("over"));
    el.addEventListener("drop", (e) => {
      if (el.classList.contains("locked")) return;
      e.preventDefault();
      el.classList.remove("over");
      const sym = e.dataTransfer.getData("text/plain");
      if (!sym) return;
      slot.textContent = sym;
      onAnswerChange(sym);
    });
  }

  choices.forEach((sym) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pc-sign";
    btn.textContent = sym;
    btn.disabled = true;
    btn.draggable = true;
    btn.addEventListener("dragstart", (e) => {
      if (btn.disabled) return;
      e.dataTransfer.setData("text/plain", sym);
      btn.classList.add("dragging");
    });
    btn.addEventListener("dragend", () => btn.classList.remove("dragging"));
    signs.appendChild(btn);
  });

  enableDrop(slot);

  compare.appendChild(slot);
  compare.appendChild(signs);

  board.appendChild(pizzas);
  board.appendChild(compare);

  wrap.appendChild(board);
  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);
  updateDropState();
  return {};
}
