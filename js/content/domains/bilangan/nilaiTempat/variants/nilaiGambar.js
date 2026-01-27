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

function formatThousand(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function genNilaiTempat_NilaiGambar() {
  const thousands = randInt(0, 9);
  const hundreds = randInt(0, 9);
  const tens = randInt(0, 9);
  const ones = randInt(0, 9);

  const value = thousands * 1000 + hundreds * 100 + tens * 10 + ones;

  const choices = new Set([value]);
  while (choices.size < 3) {
    const t = randInt(0, 9);
    const h = randInt(0, 9);
    const te = randInt(0, 9);
    const o = randInt(0, 9);
    choices.add(t * 1000 + h * 100 + te * 10 + o);
  }

  return {
    type: "image_place_value_pick",
    prompt: "Pilih nilai tempat yang benar",
    data: {
      counts: [thousands, hundreds, tens, ones],
      symbols: ["⭐", "⚪", "△", "⬜"],
      labels: ["1.000", "100", "10", "1"],
      choices: shuffle([...choices]).map(formatThousand)
    },
    answer: formatThousand(value)
  };
}
