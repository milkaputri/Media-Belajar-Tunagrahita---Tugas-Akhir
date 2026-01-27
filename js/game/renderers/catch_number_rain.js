export function renderCatchNumberRain({ mount, q, onCorrect, onWrong }) {
  const field = document.createElement("div");
  field.className = "rain-field";

  const clouds = document.createElement("div");
  clouds.className = "rain-clouds";

  const rain = document.createElement("div");
  rain.className = "rain-sheets";

  const basket = document.createElement("div");
  basket.className = "rain-basket";
  basket.innerHTML = `<div class="basket-body"></div>`;

  field.appendChild(clouds);
  field.appendChild(rain);
  field.appendChild(basket);

  mount.innerHTML = "";
  mount.appendChild(field);

  const numbers = [];
  let running = true;
  let lastTime = performance.now();
  let spawnTimer = null;

  const min = Number(q.data?.min ?? 1);
  const max = Number(q.data?.max ?? 200);
  const cond = q.data?.condition || { type: "lt", value: 50 };
  const spawnEvery = Number(q.data?.spawnIntervalMs ?? 650);
  const speedMin = Number(q.data?.fallSpeedMin ?? 45);
  const speedMax = Number(q.data?.fallSpeedMax ?? 75);

  function randInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  function clamp(n, minVal, maxVal) {
    return Math.max(minVal, Math.min(maxVal, n));
  }

  function isCorrect(n) {
    if (cond.type === "lt") return n < cond.value;
    if (cond.type === "gt") return n > cond.value;
    if (cond.type === "eq") return n === cond.value;
    return false;
  }

  function spawnNumber() {
    if (!running) return;
    const el = document.createElement("div");
    el.className = "rain-number";
    const value = randInt(min, max);
    el.textContent = String(value);

    const x = randInt(6, 92);
    const speed = randInt(speedMin, speedMax);
    el.style.left = `${x}%`;

    field.appendChild(el);
    numbers.push({ el, x, y: -30, speed, value, caught: false });
  }

  function setBasketByClientX(clientX) {
    const rect = field.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    basket.style.left = `${x}px`;
  }

  function onPointerMove(e) {
    if (!running) return;
    setBasketByClientX(e.clientX);
  }

  function onPointerDown(e) {
    if (!running) return;
    setBasketByClientX(e.clientX);
  }

  field.addEventListener("pointermove", onPointerMove);
  field.addEventListener("pointerdown", onPointerDown);

  function checkCatch(item, basketRect) {
    const rect = item.el.getBoundingClientRect();
    const overlap =
      rect.left < basketRect.right &&
      rect.right > basketRect.left &&
      rect.bottom > basketRect.top &&
      rect.top < basketRect.bottom;

    if (!overlap || item.caught) return false;
    item.caught = true;
    item.el.classList.add("caught");

    if (isCorrect(item.value)) {
      item.el.classList.add("correct");
      running = false;
      if (typeof onCorrect === "function") onCorrect(item.value);
    } else {
      item.el.classList.add("wrong");
      running = false;
      if (typeof onWrong === "function") onWrong(item.value);
    }
    return true;
  }

  function update(now) {
    if (!running) return;
    const dt = Math.min(40, now - lastTime);
    lastTime = now;

    const basketRect = basket.getBoundingClientRect();
    for (let i = numbers.length - 1; i >= 0; i--) {
      const item = numbers[i];
      item.y += (item.speed * dt) / 16;
      item.el.style.transform = `translate(-50%, ${item.y}px)`;

      if (item.y > field.clientHeight + 60) {
        item.el.remove();
        numbers.splice(i, 1);
        continue;
      }
      if (checkCatch(item, basketRect)) {
        break;
      }
    }

    requestAnimationFrame(update);
  }

  spawnTimer = setInterval(spawnNumber, spawnEvery);
  spawnNumber();
  requestAnimationFrame(update);

  return {
    destroy() {
      running = false;
      clearInterval(spawnTimer);
      numbers.forEach(n => n.el.remove());
      field.removeEventListener("pointermove", onPointerMove);
      field.removeEventListener("pointerdown", onPointerDown);
    }
  };
}
