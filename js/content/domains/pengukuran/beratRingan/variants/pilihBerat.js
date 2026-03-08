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
  { id: "emberApel", name: "Ember Apel", image: "../../assets/image/emberApel.png", weight: 1 },
  { id: "karungBeras", name: "Karung Beras", image: "../../assets/image/karungBeras.png", weight: 7 },
  { id: "batu", name: "Batu", image: "../../assets/image/batu.png", weight: 2 },
  { id: "jaringIkan", name: "Jaring Ikan", image: "../../assets/image/jaringIkan.png", weight: 3 },
  { id: "boxApel", name: "Box Apel", image: "../../assets/image/boxApel.png", weight: 4 },
  { id: "boxSemangka", name: "Box Semangka", image: "../../assets/image/boxSemangka.png", weight: 6 },
  { id: "boxManggis", name: "Box Manggis", image: "../../assets/image/boxManggis.png", weight: 5 }
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

