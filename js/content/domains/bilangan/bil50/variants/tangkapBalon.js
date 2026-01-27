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

export function genBil50_TangkapBalon() {
  const targetNumber = randInt(1, 50);
  const totalBalloons = 8;
  const nums = new Set([targetNumber]);

  while (nums.size < totalBalloons) {
    nums.add(randInt(1, 50));
  }

  return {
    type: "catch_balloon_number",
    prompt: `Cari angka ${targetNumber}`,
    data: {
      targetNumber,
      balloons: shuffle([...nums])
    },
    answer: targetNumber
  };
}
