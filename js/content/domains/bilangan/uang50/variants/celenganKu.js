const MONEY_VALUES = [500, 1000, 2000, 5000, 10000, 20000];

export function genUang50_CelenganKu() {
  return {
    type: "money_piggy_bank",
    prompt: "Masukkan uang sampai Rp 50.000",
    data: {
      target: 50000,
      moneyValues: MONEY_VALUES
    },
    answer: 50000
  };
}
