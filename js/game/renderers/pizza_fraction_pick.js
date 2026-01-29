function pickMaleVoice() {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;
  const idVoices = voices.filter(v => (v.lang || "").toLowerCase().startsWith("id"));
  const maleHint = v => /male|pria|laki|cowok|boy|man/i.test(v.name || "");
  const idMale = idVoices.find(maleHint);
  if (idMale) return idMale;
  const idAny = idVoices[0];
  if (idAny) return idAny;
  const anyMale = voices.find(maleHint);
  return anyMale || voices[0];
}

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

export function renderPizzaFractionPick({ mount, q, onAnswerChange }) {
  const parts = Number(q.data?.parts || 2);
  const label = q.data?.label || "SETENGAH";
  const fraction = q.data?.fraction || "1/2";
  const speech = q.data?.speech || "Ambil setengah pizza.";
  const numerator = Number(q.data?.numerator || 1);
  const pizzaImg = "../../assets/image/pizza.png";

  let locked = false;
  let cachedVoice = pickMaleVoice();

  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = pickMaleVoice();
    };
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      if (!cachedVoice) cachedVoice = pickMaleVoice();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "id-ID";
      utter.voice = cachedVoice || null;
      utter.rate = 0.9;
      utter.pitch = 0.9;
      window.speechSynthesis.speak(utter);
    } catch {}
  }

  const wrap = document.createElement("div");
  wrap.className = "pizza-wrap";

  const board = document.createElement("div");
  board.className = "pizza-board";

  const instruction = document.createElement("div");
  instruction.className = "pizza-instruction";
  instruction.innerHTML = `
    <div class="pizza-text">${q.prompt}</div>
    <div class="pizza-frac">${fraction}</div>
  `;


  const pizzaArea = document.createElement("div");
  pizzaArea.className = "pizza-area";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.classList.add("pizza-svg");

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
  pattern.setAttribute("id", "pizzaPattern");
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
    path.setAttribute("fill", "url(#pizzaPattern)");
    path.classList.add("pizza-slice");
    path.dataset.slice = String(i);
    svg.appendChild(path);
    slices.push(path);
  }

  const border = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  border.setAttribute("cx", "50");
  border.setAttribute("cy", "50");
  border.setAttribute("r", "45");
  border.classList.add("pizza-border");
  svg.appendChild(border);

  pizzaArea.appendChild(svg);

  slices.forEach((slice) => {
    slice.addEventListener("click", () => {
      if (locked) return;
      slice.classList.toggle("selected");
      const count = slices.filter(s => s.classList.contains("selected")).length;
      onAnswerChange(count);
    });
  });

  board.appendChild(pizzaArea);
  board.appendChild(instruction);

  wrap.appendChild(board);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(0);
  speak(speech);
  return {
    reset: () => {
      locked = false;
      slices.forEach(s => s.classList.remove("selected"));
      onAnswerChange(0);
    }
  };
}
