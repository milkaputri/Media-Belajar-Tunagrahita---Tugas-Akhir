function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MONEY_VALUES = [500, 1000, 2000, 5000, 10000, 20000];
const ITEMS = [
  { name: "Permen", icon: "&#127852;" },
  { name: "Pena", icon: "&#128394;" },
  { name: "Buku", icon: "&#128216;" },
  { name: "Baju", icon: "&#128085;" },
  { name: "Susu", icon: "&#129371;" },
  { name: "Mainan", icon: "&#129528;" },
  { name: "Mie", icon: "&#127836;" },
  { name: "Sepatu", icon: "&#128095;" },
  { name: "Topi", icon: "&#129506;" },
  { name: "Roti", icon: "&#127838;" },
  { name: "Telur", icon: "&#129370;" },
  { name: "Es Krim", icon: "&#127846;" },
  { name: "Sikat Gigi", icon: "&#129701;" },
  { name: "Sabun", icon: "&#129532;" }
];

export function genUang20_KenalUang() {
  const pickedItems = shuffle(ITEMS).slice(0, 1);
  const pickedPrices = shuffle(MONEY_VALUES).slice(0, 1);

  const items = pickedItems.map((item, idx) => ({
    id: `${item.name.toLowerCase().replace(/\s+/g, "-")}-${pickedPrices[idx]}`,
    name: item.name,
    icon: item.icon,
    price: pickedPrices[idx]
  }));

  return {
    type: "money_drag_match",
    prompt: "Cocokkan uang dengan harga barang",
    data: {
      items,
      moneyValues: MONEY_VALUES
    }
  };
}
