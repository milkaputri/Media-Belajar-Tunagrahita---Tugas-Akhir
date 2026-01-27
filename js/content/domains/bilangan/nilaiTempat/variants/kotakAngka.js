function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function genNilaiTempat_KotakAngka() {
  let digits = [1,0,0,0];
  let n = 1000;
  let tries = 0;
  while (tries < 200) {
    const d1 = randInt(1, 9);
    const d2 = randInt(0, 9);
    const d3 = randInt(0, 9);
    const d4 = randInt(0, 9);
    const sum = d1 + d2 + d3 + d4;
    if (sum <= 15) {
      digits = [d1, d2, d3, d4];
      n = d1 * 1000 + d2 * 100 + d3 * 10 + d4;
      break;
    }
    tries++;
  }

  const formatted = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return {
    type: "place_value_boxes",
    prompt: `Isi kotak sesuai nilai tempat: ${formatted}`,
    data: {
      number: n,
      digits,
      labels: ["1.000", "100", "10", "1"],
      labelNames: ["Ribuan", "Ratusan", "Puluhan", "Satuan"],
      labelValues: ["1.000", "100", "10", "1"],
      totalItems: 15,
      itemEmoji: "🍎"
    },
    answer: digits
  };
}
