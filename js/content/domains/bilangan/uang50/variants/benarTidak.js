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
  { name: "Permen", icon: "&#127852;", min: 1000, max: 5000 },
  { name: "Pena", icon: "&#128394;", min: 2000, max: 8000 },
  { name: "Buku", icon: "&#128216;", min: 4000, max: 12000 },
  { name: "Susu", icon: "&#129371;", min: 5000, max: 15000 },
  { name: "Topi", icon: "&#129506;", min: 8000, max: 18000 },
  { name: "Mie", icon: "&#127836;", min: 3000, max: 9000 },
  { name: "Mainan", icon: "&#129528;", min: 10000, max: 25000 },
  { name: "Baju", icon: "&#128085;", min: 15000, max: 35000 },
  { name: "Sepatu", icon: "&#128095;", min: 20000, max: 50000 }
];

function pickNotes() {
  return Array.from({ length: 4 }, () => MONEY_VALUES[randInt(0, MONEY_VALUES.length - 1)]);
}

function buildCorrect(item) {
  for (let i = 0; i < 200; i++) {
    const notes = pickNotes();
    const sum = notes.reduce((a, b) => a + b, 0);
    if (sum >= item.min && sum <= item.max && sum <= 50000) {
      return { notes, price: sum, answer: true };
    }
  }
  return null;
}

function buildIncorrect(item) {
  for (let i = 0; i < 200; i++) {
    const notes = pickNotes();
    const sum = notes.reduce((a, b) => a + b, 0);
    const price = randInt(item.min, Math.min(item.max, 50000));
    if (price > 0 && price !== sum) {
      return { notes, price, answer: false };
    }
  }
  const notes = pickNotes();
  const sum = notes.reduce((a, b) => a + b, 0);
  let price = Math.min(item.max, Math.max(item.min, sum + 1000));
  if (price === sum) price = Math.min(item.max, sum + 2000);
  return { notes, price, answer: false };
}

function buildQuestion(item) {
  const makeCorrect = Math.random() < 0.5;
  if (makeCorrect) {
    const correct = buildCorrect(item);
    if (correct) return correct;
  }
  return buildIncorrect(item);
}

export function genUang50_BenarTidak() {
  const item = shuffle(ITEMS)[0];
  const q = buildQuestion(item);

  return {
    type: "money_true_false",
    prompt: "Uang yang ditampilkan pas dengan harga?",
    data: {
      item,
      notes: q.notes
    },
    price: q.price,
    answer: q.answer
  };
}
