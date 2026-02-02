function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function genPersen_Warnai100() {
  const options = shuffle([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  const target = options[0];

  return {
    type: "percent_color_100",
    prompt: `Warnai ${target}%`,
    data: { targetPercent: target },
    answer: target / 10
  };
}
