export function renderUkurWeightPickHeavier({ mount, q, onAnswerChange }){
  let selected = null;

  const left = q.data?.left || {};
  const right = q.data?.right || {};
  const tiltRightDown = Number(right.weight) > Number(left.weight);

  const wrap = document.createElement("div");
  wrap.className = "ukurwt-wrap";

  const board = document.createElement("div");
  board.className = "ukurwt-board";

  const beamArea = document.createElement("div");
  beamArea.className = "ukurwt-beam-area";

  const base = document.createElement("div");
  base.className = "ukurwt-base";

  const beam = document.createElement("div");
  beam.className = "ukurwt-beam";
  beam.classList.toggle("tilt-right", tiltRightDown);
  beam.classList.toggle("tilt-left", !tiltRightDown);

  const leftBtn = document.createElement("button");
  leftBtn.type = "button";
  leftBtn.className = "ukurwt-item ukurwt-left";
  leftBtn.setAttribute("aria-label", `Pilih kiri: ${left.name || "benda"}`);
  leftBtn.dataset.side = "left";

  const rightBtn = document.createElement("button");
  rightBtn.type = "button";
  rightBtn.className = "ukurwt-item ukurwt-right";
  rightBtn.setAttribute("aria-label", `Pilih kanan: ${right.name || "benda"}`);
  rightBtn.dataset.side = "right";

  function makeItemContent(btn, item){
    const img = document.createElement("img");
    img.className = "ukurwt-img";
    img.src = item.image || "";
    img.alt = item.name || "Benda";

    const label = document.createElement("div");
    label.className = "ukurwt-label";
    label.textContent = item.name || "Benda";

    btn.appendChild(img);
    btn.appendChild(label);
  }

  makeItemContent(leftBtn, left);
  makeItemContent(rightBtn, right);

  function setSelected(side){
    selected = side;
    leftBtn.classList.toggle("selected", side === "left");
    rightBtn.classList.toggle("selected", side === "right");
    onAnswerChange(selected);
  }

  leftBtn.addEventListener("click", () => setSelected("left"));
  rightBtn.addEventListener("click", () => setSelected("right"));

  beam.appendChild(leftBtn);
  beam.appendChild(rightBtn);
  beamArea.appendChild(beam);
  beamArea.appendChild(base);
  board.appendChild(beamArea);
  wrap.appendChild(board);

  mount.innerHTML = "";
  mount.appendChild(wrap);
  onAnswerChange(null);

  return { getAnswer: () => selected };
}
