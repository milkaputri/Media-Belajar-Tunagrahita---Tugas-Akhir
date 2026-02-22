function randInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }

const OBJECTS = [
  {
    name: "Pohon",
    tall: "/assets/image/pohonTinggi.png",
    short: "/assets/image/pohonPendek.png"
  },
  {
    name: "Gedung",
    tall: "/assets/image/gedungTinggi.png",
    short: "/assets/image/gedungPendek.png"
  },
  {
    name: "Tangga",
    tall: "/assets/image/tanggaTinggi.png",
    short: "/assets/image/tanggaPendek.png"
  },
  {
    name: "Orang",
    tall: "/assets/image/orangTinggi.png",
    short: "/assets/image/orangPendek.png"
  }
];

const CASES = [
  { left: "short", right: "tall", answer: "<" },
  { left: "tall", right: "short", answer: ">" },
  { left: "short", right: "short", answer: "=" },
  { left: "tall", right: "tall", answer: "=" }
];

export function genUkurPerbandinganTinggi(){
  const obj = OBJECTS[randInt(0, OBJECTS.length - 1)];
  const chosen = CASES[randInt(0, CASES.length - 1)];

  return {
    type: "ukur_compare_sign_pick",
    prompt: "Pilih tanda yang sesuai!",
    data: {
      left: {
        name: obj.name,
        variant: chosen.left,
        image: chosen.left === "tall" ? obj.tall : obj.short
      },
      right: {
        name: obj.name,
        variant: chosen.right,
        image: chosen.right === "tall" ? obj.tall : obj.short
      },
      choices: [">", "=", "<"]
    },
    answer: chosen.answer
  };
}
