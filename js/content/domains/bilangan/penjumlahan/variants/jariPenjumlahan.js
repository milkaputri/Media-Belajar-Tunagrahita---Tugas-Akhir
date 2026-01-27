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

export function genPenjumlahan_JariPenjumlahan() {
  const left = randInt(1, 5);
  const right = randInt(1, 5);
  const sum = left + right;

  const choices = new Set([sum]);
  while (choices.size < 4) {
    choices.add(randInt(1, 10));
  }

  return {
    type: "finger_addition_pick",
    prompt: "Hitung jumlah jari",
    data: {
      a: left,
      b: right,
      choices: shuffle([...choices])
    },
    answer: sum
  };
}
