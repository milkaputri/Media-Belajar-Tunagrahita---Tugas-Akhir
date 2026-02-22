function randInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }

const OBJECTS = [
  {
    name: "Pensil",
    long: "/assets/image/pensilPanjang.png",
    short: "/assets/image/pensilPendek.png"
  },
  {
    name: "Tali",
    long: "/assets/image/taliPanjang.png",
    short: "/assets/image/taliPendek.png"
  },
  {
    name: "Rantai",
    long: "/assets/image/rantaiPanjang.png",
    short: "/assets/image/rantaiPendek.png"
  },
  {
    name: "Penggaris",
    long: "/assets/image/penggarisPanjang.png",
    short: "/assets/image/penggarisPendek.png"
  },
  {
    name: "Sapu",
    long: "/assets/image/sapuPanjang.png",
    short: "/assets/image/sapuPendek.png"
  },
  {
    name: "Kereta",
    long: "/assets/image/keretaPanjang.png",
    short: "/assets/image/keretaPendek.png"
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
