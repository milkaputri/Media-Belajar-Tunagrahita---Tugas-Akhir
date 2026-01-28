function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value));
}

export function renderMoneyTrueFalse({ mount, q, onAnswerChange }) {
  const wrap = document.createElement("div");
  wrap.className = "mtf-wrap";

  const board = document.createElement("div");
  board.className = "mtf-board";

  const things = document.createElement("div");
  things.className = "mtf-things";

  const itemName = document.createElement("div");
  itemName.className = "mtf-name";
  itemName.textContent = q.data?.item?.name || "Barang";

  const itemIcon = document.createElement("div");
  itemIcon.className = "mtf-icon";
  itemIcon.innerHTML = q.data?.item?.icon || "&#9733;";

  const itemPrice = document.createElement("div");
  itemPrice.className = "mtf-price";
  itemPrice.textContent = `Rp ${formatRupiah(q.price)}`;

  things.appendChild(itemName);
  things.appendChild(itemIcon);
  things.appendChild(itemPrice);

  const moneyArea = document.createElement("div");
  moneyArea.className = "mtf-money-area";

  let coinPlaced = false;
  (q.data?.notes || []).forEach((value) => {
    const note = document.createElement("div");
    note.className = "mtf-note";
    if (Number(value) === 500 && !coinPlaced) {
      note.classList.add("coin-slot");
      coinPlaced = true;
    }

    const img = document.createElement("img");
    img.src = `../../assets/image/${value}.png`;
    img.alt = `Uang ${value}`;
    img.draggable = false;

    note.appendChild(img);

    moneyArea.appendChild(note);
  });

  board.appendChild(things);
  board.appendChild(moneyArea);

  const actions = document.createElement("div");
  actions.className = "mtf-actions";

  const btnTrue = document.createElement("button");
  btnTrue.type = "button";
  btnTrue.className = "mtf-btn mtf-true";
  btnTrue.innerHTML = "&#10004;";

  const btnFalse = document.createElement("button");
  btnFalse.type = "button";
  btnFalse.className = "mtf-btn mtf-false";
  btnFalse.innerHTML = "&#10006;";

  function setChoice(value) {
    btnTrue.classList.toggle("selected", value === true);
    btnFalse.classList.toggle("selected", value === false);
    actions.classList.toggle("chosen-true", value === true);
    actions.classList.toggle("chosen-false", value === false);
    onAnswerChange(value);
  }

  btnTrue.addEventListener("click", () => setChoice(true));
  btnFalse.addEventListener("click", () => setChoice(false));

  actions.appendChild(btnTrue);
  actions.appendChild(btnFalse);

  wrap.appendChild(board);
  wrap.appendChild(actions);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);
  return {};
}
