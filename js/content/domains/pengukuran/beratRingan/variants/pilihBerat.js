function randInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }

function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const OBJECTS = [
  { id: "apple", name: "Apel", image: "/assets/image/apple.png", weight: 1 },
  { id: "donut", name: "Donat", image: "/assets/image/donat.png", weight: 1 },
  { id: "pizza", name: "Pizza", image: "/assets/image/pizza.png", weight: 2 },
  { id: "plate", name: "Piring", image: "/assets/image/piring.png", weight: 2 },
  { id: "chair", name: "Kursi", image: "/assets/image/kursi.png", weight: 4 },
  { id: "piggy", name: "Celengan", image: "/assets/image/celengan.png", weight: 3 }
];

export function genBeratRingan_PilihBerat(){
  const shuffled = shuffle(OBJECTS);
  let a = shuffled[0];
  let b = shuffled[1];

  // Pastikan tidak sama berat agar pertanyaan "lebih berat" jelas.
  let guard = 0;
  while(a.weight === b.weight && guard < 20){
    b = OBJECTS[randInt(0, OBJECTS.length - 1)];
    guard++;
  }

  const leftFirst = Math.random() < 0.5;
  const leftObj = leftFirst ? a : b;
  const rightObj = leftFirst ? b : a;
  const answer = leftObj.weight > rightObj.weight ? "left" : "right";

  return {
    type: "ukur_weight_pick_heavier",
    prompt: "Mana yang lebih berat?",
    data: {
      left: {
        side: "left",
        id: leftObj.id,
        name: leftObj.name,
        image: leftObj.image,
        weight: leftObj.weight
      },
      right: {
        side: "right",
        id: rightObj.id,
        name: rightObj.name,
        image: rightObj.image,
        weight: rightObj.weight
      }
    },
    answer
  };
}
