function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtDecimal(n) {
  const s = String(n);
  return s.includes(".") ? s.replace(".", ",") : s;
}

export function genDesimal_BotolAir() {
  const options = [];
  for (let i = 1; i <= 10; i++) {
    const value = i / 10;
    options.push({
      value,
      label: fmtDecimal(value),
      fill: value
    });
  }

  const comparePool = options.filter(o => o.value >= 0.3 && o.value <= 0.9);
  const a = comparePool[Math.floor(Math.random() * comparePool.length)];
  let b = comparePool[Math.floor(Math.random() * comparePool.length)];
  while (b.value === a.value) {
    b = comparePool[Math.floor(Math.random() * comparePool.length)];
  }
  const pick = a.value > b.value ? a : b;
  const choices = options.slice();

  return {
    type: "bottle_decimal_pick",
    prompt: `Mana yang lebih besar: ${fmtDecimal(a.value)} atau ${fmtDecimal(b.value)}?`,
    data: { choices },
    answer: pick.value
  };
}
