function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function genBil100_TangkapAngka() {
  const min = 1;
  const max = 100;
  const threshold = randInt(25, 75);
  const type = Math.random() < 0.5 ? "lt" : "gt";
  const prompt =
    type === "lt"
      ? `Tangkap angka kurang dari ${threshold}`
      : `Tangkap angka lebih dari ${threshold}`;

  return {
    type: "catch_number_rain",
    prompt,
    data: {
      min,
      max,
      condition: { type, value: threshold },
      spawnIntervalMs: randInt(1900, 2400),
      fallSpeedMin: 6,
      fallSpeedMax: 10
    },
    answer: { type, value: threshold }
  };
}
