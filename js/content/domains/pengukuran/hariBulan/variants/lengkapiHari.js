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

const DAYS = [
  { id: "senin", name: "Senin", image: "../../assets/image/senin.png" },
  { id: "selasa", name: "Selasa", image: "../../assets/image/selasa.png" },
  { id: "rabu", name: "Rabu", image: "../../assets/image/rabu.png" },
  { id: "kamis", name: "Kamis", image: "../../assets/image/kamis.png" },
  { id: "jumat", name: "Jumat", image: "../../assets/image/jumat.png" },
  { id: "sabtu", name: "Sabtu", image: "../../assets/image/sabtu.png" },
  { id: "minggu", name: "Minggu", image: "../../assets/image/minggu.png" }
];

export function genHariBulan_LengkapiHari(){
  const missingIndex = randInt(1, DAYS.length - 2);
  const missing = DAYS[missingIndex];

  return {
    type: "ukur_day_complete_drag",
    prompt: "Masukkan hari yang sesuai",
    data: {
      background: "../../assets/image/bgHari.png",
      left: DAYS[missingIndex - 1],
      right: DAYS[missingIndex + 1],
      options: shuffle(DAYS),
      missingIndex
    },
    answer: missing.id
  };
}
