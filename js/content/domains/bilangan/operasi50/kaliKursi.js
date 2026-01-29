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

export function genBil50_KaliKursi() {
  const cols = randInt(4, 10);
  const maxRows = Math.max(2, Math.floor(50 / cols));
  const rows = randInt(2, Math.min(7, maxRows));
  const total = cols * rows;

  const choices = new Set([total]);
  while (choices.size < 3) {
    const offset = randInt(-10, 10);
    if (offset === 0) continue;
    const candidate = total + offset;
    if (candidate < 1 || candidate > 50) continue;
    choices.add(candidate);
  }

  return {
    type: "chair_multiplication_pick",
    prompt: "Berapa banyak kursi dalam kelas?",
    data: {
      rows,
      cols,
      choices: shuffle([...choices])
    },
    answer: total
  };
}
