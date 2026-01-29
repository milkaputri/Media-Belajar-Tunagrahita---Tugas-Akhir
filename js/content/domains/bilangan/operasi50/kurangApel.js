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

export function genBil50_KurangApel() {
  const subCount = randInt(1, 9);
  const baseCount = randInt(subCount + 5, 50);
  const result = baseCount - subCount;

  const choices = new Set([result]);
  while (choices.size < 3) {
    const offset = randInt(-6, 6);
    if (offset === 0) continue;
    const candidate = result + offset;
    if (candidate < 0 || candidate > 50) continue;
    choices.add(candidate);
  }

  return {
    type: "apple_subtraction_pick",
    prompt: "Sekarang ada berapa apel?",
    data: {
      baseCount,
      subCount,
      choices: shuffle([...choices])
    },
    answer: result
  };
}
