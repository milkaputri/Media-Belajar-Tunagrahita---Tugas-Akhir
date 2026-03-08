function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const CATEGORIES = [
  {
    id: "bola",
    name: "bola",
    items: [
      { id: "kock", name: "Kock", image: "../../assets/image/kock.png", weight: 1 },
      { id: "bola_sepak", name: "Bola Sepak", image: "../../assets/image/bolaSepak.png", weight: 2 },
      { id: "bola_basket", name: "Bola Basket", image: "../../assets/image/bolaBasket.png", weight: 3 }
    ]
  },
  {
    id: "gadget",
    name: "gadget",
    items: [
      { id: "hp", name: "HP", image: "../../assets/image/hp.png", weight: 1 },
      { id: "ipad", name: "iPad", image: "../../assets/image/ipad.png", weight: 2 },
      { id: "laptop", name: "Laptop", image: "../../assets/image/laptop.png", weight: 3 }
    ]
  },
  {
    id: "makanan",
    name: "makanan",
    items: [
      { id: "permen", name: "Permen", image: "../../assets/image/permen.png", weight: 1 },
      { id: "roti", name: "Roti", image: "../../assets/image/roti.png", weight: 2 },
      { id: "tumpeng", name: "Tumpeng", image: "../../assets/image/tumpeng.png", weight: 3 }
    ]
  },
  {
    id: "kendaraan",
    name: "kendaraan",
    items: [
      { id: "sepeda", name: "Sepeda", image: "../../assets/image/sepeda.png", weight: 1 },
      { id: "mobil", name: "Mobil", image: "../../assets/image/mobil.png", weight: 2 },
      { id: "bis", name: "Bis", image: "../../assets/image/bis.png", weight: 3 }
    ]
  }
];

const RANK_LABELS = ["ringan", "sedang", "berat", "sangat berat"];

export function genBeratRingan_UrutkanBerat(){
  const category = CATEGORIES[randInt(0, CATEGORIES.length - 1)];
  const ordered = category.items
    .slice()
    .sort((a, b) => a.weight - b.weight)
    .map((item, idx) => ({
      ...item,
      level: RANK_LABELS[idx] || "berat"
    }));

  return {
    type: "ukur_sort_weight_drag",
    prompt: `Urutkan ${category.name} dari paling ringan ke paling berat!`,
    data: {
      category: category.id,
      slots: ordered.map((_, idx) => ({ id: idx, label: String(idx + 1) })),
      items: shuffle(ordered)
    },
    answer: ordered.map((item) => item.id)
  };
}
