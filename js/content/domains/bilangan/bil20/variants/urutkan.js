function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

export function genBil20_Urutkan(){
  const len = 10;
  const start = randInt(1, 11); // supaya max 20
  const sequence = Array.from({length: len}, (_, i) => start + i);

  const blankCount = 3;
  const blankIdx = shuffle(sequence.map((_, i) => i)).slice(0, blankCount).sort((a,b)=>a-b);
  const blanks = new Set(blankIdx);

  const options = blankIdx.map(i => sequence[i]);

  return {
    type: "urutkan_sequence_fill",
    prompt: "Urutkan angka: isi angka yang kosong",
    data: {
      sequence,
      blanks: blankIdx,
      options: shuffle(options)
    },
    answer: blankIdx.map(i => ({ index: i, value: sequence[i] }))
  };
}