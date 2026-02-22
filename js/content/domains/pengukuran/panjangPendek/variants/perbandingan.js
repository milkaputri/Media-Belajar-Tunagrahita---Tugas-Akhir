function randInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }

const OBJECTS = [
  {
    name: "Sabuk",
    long: "/assets/image/sabukPanjang.png",
    short: "/assets/image/sabukPendek.png"
  },
  {
    name: "Jembatan",
    long: "/assets/image/jembatanPanjang.png",
    short: "/assets/image/jembatanPendek.png"
  },
  {
    name: "Garpu",
    long: "/assets/image/garpuPanjang.png",
    short: "/assets/image/garpuPendek.png"
  },
  {
    name: "Jalan",
    long: "/assets/image/jalanPanjang.png",
    short: "/assets/image/jalanPendek.png"
  }
];

const CASES = [
  { left: "short", right: "long", answer: "<" },
  { left: "long", right: "short", answer: ">" },
  { left: "short", right: "short", answer: "=" },
  { left: "long", right: "long", answer: "=" }
];

export function genUkurPerbandingan(){
  const obj = OBJECTS[randInt(0, OBJECTS.length - 1)];
  const chosen = CASES[randInt(0, CASES.length - 1)];

  return {
    type: "ukur_compare_sign_pick",
    prompt: "Pilih tanda yang cocok!",
    data: {
      left: {
        name: obj.name,
        variant: chosen.left,
        image: chosen.left === "long" ? obj.long : obj.short
      },
      right: {
        name: obj.name,
        variant: chosen.right,
        image: chosen.right === "long" ? obj.long : obj.short
      },
      choices: [">", "=", "<"]
    },
    answer: chosen.answer
  };
}
