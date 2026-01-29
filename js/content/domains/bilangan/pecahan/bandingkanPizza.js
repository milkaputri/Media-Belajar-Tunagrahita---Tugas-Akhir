function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function reduce(n, d) {
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

function compareFrac(a, b) {
  const left = a.n / a.d;
  const right = b.n / b.d;
  if (Math.abs(left - right) < 1e-9) return "=";
  return left > right ? ">" : "<";
}

export function genPecahan_BandingkanPizza() {
  const leftD = randInt(2, 8);
  const rightD = randInt(2, 8);
  const leftN = randInt(1, leftD - 1);
  const rightN = randInt(1, rightD - 1);

  const left = reduce(leftN, leftD);
  const right = reduce(rightN, rightD);
  const symbol = compareFrac(left, right);

  const choices = shuffle(["<", ">", "="]);

  return {
    type: "pizza_compare_drag",
    prompt: "Bandingkan pecahan pizza",
    data: {
      left: { n: left.n, d: left.d },
      right: { n: right.n, d: right.d },
      choices
    },
    answer: symbol
  };
}
