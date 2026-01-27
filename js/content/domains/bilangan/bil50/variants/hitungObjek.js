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

function buildObjects({ totalCount, targetCount, targetEmoji, others }) {
  const objects = [];
  for (let i = 0; i < targetCount; i++) {
    objects.push({
      emoji: targetEmoji,
      isTarget: true
    });
  }

  const remaining = totalCount - targetCount;
  const firstOther = randInt(1, Math.max(1, remaining - 1));
  const secondOther = remaining - firstOther;

  for (let i = 0; i < firstOther; i++) {
    objects.push({ emoji: others[0], isTarget: false });
  }
  for (let i = 0; i < secondOther; i++) {
    objects.push({ emoji: others[1], isTarget: false });
  }

  return shuffle(objects);
}

export function genBil50_HitungObjek() {
  const totalCount = 60;
  const emojis = ["🐟", "🧸", "🌸"];
  const targetIndex = randInt(0, emojis.length - 1);
  const targetEmoji = emojis[targetIndex];
  const others = emojis.filter((_, i) => i !== targetIndex);

  const targetCount = randInt(20, 45);

  return {
    type: "count_objects_pick_number",
    prompt: "Klik gambar sesuai angka di bawah",
    data: {
      mode: "select_target",
      targetEmoji,
      targetCount,
      totalCount,
      objects: buildObjects({
        totalCount,
        targetCount,
        targetEmoji,
        others
      })
    },
    answer: targetCount
  };
}
