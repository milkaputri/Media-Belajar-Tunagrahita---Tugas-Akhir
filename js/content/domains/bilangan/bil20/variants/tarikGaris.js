function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

export function genBil20_TarikGaris(){
  // 3 soal kecil dalam 1 layar
  const set = new Set();
  while(set.size < 3){
    set.add(randInt(1,20));
  }
  const counts = [...set];
  const icons = ["⭐","🍎","🐟","🌸","🧸","🍭","🚗","⚽","🎈","🐥"];

  const left = counts.map((c, idx) => ({
    id: "L" + idx,
    count: c,
    icon: icons[randInt(0, icons.length - 1)]
  }));

  const right = shuffle(counts).map((n, idx) => ({
    id: "R" + idx,
    number: n
  }));

  return {
    type: "match_line_count_to_number",
    prompt: "Tarik garis: cocokkan jumlah gambar dengan angkanya",
    data: { left, right },
    // jawaban: mapping count->number (sebenarnya sama nilainya)
    answer: counts
  };
}
