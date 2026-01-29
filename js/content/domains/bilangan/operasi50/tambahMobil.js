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

export function genBil50_TambahMobil() {
  const addCount = randInt(1, 9);
  const baseCount = randInt(10, 50 - addCount);
  const sum = baseCount + addCount;

  const choices = new Set([sum]);
  while (choices.size < 3) {
    const offset = randInt(-6, 6);
    if (offset === 0) continue;
    const candidate = sum + offset;
    if (candidate < 1 || candidate > 50) continue;
    choices.add(candidate);
  }

  return {
    type: "car_addition_pick",
    prompt: "Sekarang ada berapa mobil?",
    data: {
      baseCount,
      addCount,
      choices: shuffle([...choices])
    },
    answer: sum
  };
}
