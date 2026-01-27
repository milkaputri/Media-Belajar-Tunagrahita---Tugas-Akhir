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

export function genPenjumlahan_JumlahBenda() {
  const leftCount = randInt(1, 5);
  const rightCount = randInt(1, 5);
  const sum = leftCount + rightCount;

  const emojis = ["🍎","🍌","🍇","🍒","🍐","🍓","🥕","🍉"];
  const leftEmoji = emojis[randInt(0, emojis.length - 1)];
  let rightEmoji = emojis[randInt(0, emojis.length - 1)];
  if (rightEmoji === leftEmoji) {
    rightEmoji = emojis[(emojis.indexOf(leftEmoji) + 1) % emojis.length];
  }

  const choices = new Set([sum]);
  while (choices.size < 4) {
    choices.add(randInt(1, 10));
  }

  return {
    type: "objects_addition_pick",
    prompt: "Jumlahkan benda",
    data: {
      leftCount,
      rightCount,
      leftEmoji,
      rightEmoji,
      choices: shuffle([...choices])
    },
    answer: sum
  };
}
