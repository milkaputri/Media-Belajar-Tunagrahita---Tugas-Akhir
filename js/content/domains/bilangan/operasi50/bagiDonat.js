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

export function genBil50_BagiDonat() {
  const kids = randInt(2, 7);
  const perKid = randInt(2, 7);
  const total = kids * perKid;

  const choices = new Set([perKid]);
  while (choices.size < 3) {
    const offset = randInt(-3, 3);
    if (offset === 0) continue;
    const candidate = perKid + offset;
    if (candidate < 1 || candidate > 10) continue;
    choices.add(candidate);
  }

  return {
    type: "donut_division_drag",
    prompt: "Berapa sama rata donat setiap anak?",
    data: {
      total,
      kids,
      choices: shuffle([...choices])
    },
    answer: perKid
  };
}
