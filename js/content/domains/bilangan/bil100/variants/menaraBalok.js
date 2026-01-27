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

export function genBil100_MenaraBalok() {
  const count = 5;
  const nums = new Set();
  while (nums.size < count) nums.add(randInt(1, 100));
  const order = Math.random() < 0.5 ? "asc" : "desc";
  const sequence = [...nums].sort((a, b) => (order === "asc" ? a - b : b - a));
  const options = shuffle(sequence);
  const prompt =
    order === "asc"
      ? "Susun balok dari kecil ke besar"
      : "Susun balok dari besar ke kecil";

  return {
    type: "stack_number_tower",
    prompt,
    data: {
      sequence,
      options,
      order
    },
    answer: sequence
  };
}
