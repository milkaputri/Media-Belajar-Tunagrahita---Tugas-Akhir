function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function randInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }

const OBJECTS = [
  {
    name: "Pohon",
    images: {
      short: "/assets/image/pohonPendek.png",
      medium: "/assets/image/pohonTengah.png",
      tall: "/assets/image/pohonTinggi.png"
    }
  },
  {
    name: "Gedung",
    images: {
      short: "/assets/image/gedungPendek.png",
      medium: "/assets/image/gedungTengah.png",
      tall: "/assets/image/gedungTinggi.png"
    }
  },
  {
    name: "Tangga",
    images: {
      short: "/assets/image/tanggaPendek.png",
      medium: "/assets/image/tanggaTengah.png",
      tall: "/assets/image/tanggaTinggi.png"
    }
  },
  {
    name: "Orang",
    images: {
      short: "/assets/image/orangPendek.png",
      medium: "/assets/image/orangTengah.png",
      tall: "/assets/image/orangTinggi.png"
    }
  }
];

const LEVELS = [
  { id: "short", label: "pendek" },
  { id: "medium", label: "tengah" },
  { id: "tall", label: "tinggi" }
];

export function genUkurUrutkanTinggi(){
  const obj = OBJECTS[randInt(0, OBJECTS.length - 1)];
  const ordered = LEVELS.map((level) => ({
    id: level.id,
    name: obj.name,
    level: level.id,
    image: obj.images[level.id]
  }));

  return {
    type: "ukur_sort_height_drag",
    prompt: "Urutkan dari kecil ke besar!",
    data: {
      name: obj.name,
      slots: [
        { id: 0, label: "1" },
        { id: 1, label: "2" },
        { id: 2, label: "3" }
      ],
      items: shuffle(ordered)
    },
    answer: ordered.map((item) => item.id)
  };
}
