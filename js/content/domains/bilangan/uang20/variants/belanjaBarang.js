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

const MONEY_VALUES = [500, 1000, 2000, 5000, 10000, 20000];
const ITEMS = [
  { name: "Sandal", icon: "&#128095;", min: 3000, max: 8000 },
  { name: "Sepatu", icon: "&#128095;", min: 12000, max: 20000 },
  { name: "Baju", icon: "&#128085;", min: 10000, max: 20000 },
  { name: "Buku", icon: "&#128216;", min: 3000, max: 8000 },
  { name: "Pena", icon: "&#128394;", min: 2000, max: 6000 },
  { name: "Permen", icon: "&#127852;", min: 1000, max: 3000 },
  { name: "Susu", icon: "&#129371;", min: 4000, max: 10000 },
  { name: "Mainan", icon: "&#129528;", min: 8000, max: 20000 },
  { name: "Mie", icon: "&#127836;", min: 3000, max: 7000 },
  { name: "Topi", icon: "&#129506;", min: 6000, max: 12000 }
];

function buildTargetSum(range) {
  const maxTarget = Math.min(20000, range?.max ?? 20000);
  const minTarget = Math.max(1000, range?.min ?? 1000);
  const minNotes = 2;
  const maxNotes = 3;

  for (let i = 0; i < 100; i++) {
    const count = randInt(minNotes, maxNotes);
    const picks = [];
    let sum = 0;
    for (let k = 0; k < count; k++) {
      const v = MONEY_VALUES[randInt(0, MONEY_VALUES.length - 1)];
      picks.push(v);
      sum += v;
    }

    if (sum <= maxTarget && sum >= minTarget && !MONEY_VALUES.includes(sum)) {
      return { sum, minNotes, maxNotes };
    }
  }

  return { sum: Math.min(maxTarget, Math.max(minTarget, 10000)), minNotes: 2, maxNotes: 3 };
}

export function genUang20_BelanjaBarang() {
  const item = shuffle(ITEMS)[0];
  const target = buildTargetSum(item);

  return {
    type: "money_shop_sum",
    prompt: "Cocokkan uang dengan harga barang",
    data: {
      item,
      minNotes: target.minNotes,
      maxNotes: target.maxNotes,
      moneyValues: MONEY_VALUES
    },
    answer: target.sum
  };
}
