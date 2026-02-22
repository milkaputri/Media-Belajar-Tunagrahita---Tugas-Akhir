function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

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

export function genUkurAku(){
  const obj = OBJECTS[randInt(0, OBJECTS.length - 1)];
  const variants = shuffle([
    { variant: "long", image: obj.long },
    { variant: "short", image: obj.short }
  ]);

  const items = variants.map((variant, idx) => ({
    id: idx === 0 ? "A" : "B",
    label: idx === 0 ? "A" : "B",
    name: obj.name,
    variant: variant.variant,
    image: variant.image
  }));

  const askLong = Math.random() < 0.5;
  const answer = items.find(item => item.variant === (askLong ? "long" : "short")).id;

  return {
    type: "ukur_aku_pick",
    prompt: askLong ? "Pilih benda yang panjang" : "Pilih benda yang pendek",
    data: {
      ask: askLong ? "long" : "short",
      items
    },
    answer
  };
}
