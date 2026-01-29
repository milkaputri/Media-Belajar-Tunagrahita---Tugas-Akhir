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

const NUM_WORD = {
  1: "satu",
  2: "dua",
  3: "tiga",
  4: "empat",
  5: "lima",
  6: "enam",
  7: "tujuh",
  8: "delapan"
};

export function genPecahan_BagiPizza() {
  const parts = randInt(2, 8);
  const numerator = randInt(1, parts - 1);
  const fraction = `${numerator}/${parts}`;
  const speech = numerator === 1 && parts === 2
    ? "Ambil setengah pizza."
    : `Ambil ${NUM_WORD[numerator] || numerator} per ${NUM_WORD[parts] || parts} pizza.`;
  const label = numerator === 1 && parts === 2
    ? "SETENGAH"
    : `${numerator}/${parts}`;

  return {
    type: "pizza_fraction_pick",
    prompt: `Ambil ${label} 🍕`,
    data: {
      parts,
      numerator,
      label,
      fraction,
      speech
    },
    answer: numerator
  };
}
