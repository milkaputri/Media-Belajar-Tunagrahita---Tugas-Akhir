function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function genDesimal_BarWarna() {
  const options = [
    { fill: 3, value: 0.3 },
    { fill: 5, value: 0.5 },
    { fill: 8, value: 0.8 }
  ];
  const pick = options[Math.floor(Math.random() * options.length)];

  return {
    type: "bar_decimal_pick",
    prompt: "Pilih nilai yang sesuai",
    data: {
      fill: pick.fill,
      choices: shuffle([0.3, 0.5, 0.8])
    },
    answer: pick.value
  };
}
