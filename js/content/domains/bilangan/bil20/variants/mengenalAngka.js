function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

function makeOptions(answer){
  const set = new Set([answer]);
  while(set.size < 5){
    let v = answer + randInt(-5,5);
    if(v < 1) v = 1;
    if(v > 20) v = 20;
    set.add(v);
  }
  return shuffle([...set]);
}

export function genBil20_MengenalAngka(){
  const answer = randInt(1,20);
  return {
    type: "dragdrop_number_to_box",
    prompt: "Masukkan angka sesuai jumlah gambar",
    data: {
      count: answer,
      icon: "⭐",
      options: makeOptions(answer)
    },
    answer
  };
}
