function pickMaleVoice() {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;
  const idVoices = voices.filter(v => (v.lang || "").toLowerCase().startsWith("id"));
  const maleHint = v => /male|pria|laki|cowok|boy|man/i.test(v.name || "");
  const idMale = idVoices.find(maleHint);
  if (idMale) return idMale;
  const idAny = idVoices[0];
  if (idAny) return idAny;
  const anyMale = voices.find(maleHint);
  return anyMale || voices[0];
}

export function renderChairMultiplicationRows({ mount, q, onAnswerChange }) {
  const rows = Number(q.data?.rows || 0);
  const cols = Number(q.data?.cols || 0);
  const chairSrc = "../../assets/image/kursi.png";

  let cachedVoice = pickMaleVoice();
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = pickMaleVoice();
    };
  }

  function speakRow(rowIndex) {
    if (!window.speechSynthesis) return null;
    try {
      window.speechSynthesis.cancel();
      if (!cachedVoice) cachedVoice = pickMaleVoice();
      const utter = new SpeechSynthesisUtterance(`Ini ${cols} dikali ${rowIndex}`);
      utter.lang = "id-ID";
      utter.voice = cachedVoice || null;
      utter.rate = 0.95;
      utter.pitch = 0.85;
      window.speechSynthesis.speak(utter);
      return utter;
    } catch {}
    return null;
  }

  const wrap = document.createElement("div");
  wrap.className = "chair-mul-wrap";

  const board = document.createElement("div");
  board.className = "chair-mul-board";

  const grid = document.createElement("div");
  grid.className = "chair-grid";

  const rowsEls = [];
  for (let r = 0; r < rows; r++) {
    const row = document.createElement("div");
    row.className = "chair-row";
    row.dataset.row = String(r + 1);

    for (let c = 0; c < cols; c++) {
      const img = document.createElement("img");
      img.className = "chair-item";
      img.src = chairSrc;
      img.alt = "Kursi";
      row.appendChild(img);
    }

    grid.appendChild(row);
    rowsEls.push(row);
  }

  const choices = document.createElement("div");
  choices.className = "chair-choices";

  const choiceButtons = (q.data?.choices || []).map((num) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chair-choice";
    btn.textContent = String(num);
    btn.disabled = true;
    btn.addEventListener("click", () => {
      choices.querySelectorAll(".chair-choice").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      onAnswerChange(num);
    });
    choices.appendChild(btn);
    return btn;
  });

  board.appendChild(grid);
  wrap.appendChild(board);
  wrap.appendChild(choices);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);

  let currentIndex = 0;
  const fallbackDelay = 3000;
  const postAudioDelay = 3000;

  function revealNext() {
    const row = rowsEls[currentIndex];
    if (!row) return;
    row.classList.add("show");
    const utter = speakRow(currentIndex + 1);

    let finished = false;
    const finishRow = () => {
      if (finished) return;
      finished = true;
      currentIndex += 1;
      if (currentIndex >= rowsEls.length) {
        choiceButtons.forEach(btn => { btn.disabled = false; });
        return;
      }
      setTimeout(revealNext, postAudioDelay);
    };

    if (utter) {
      utter.onend = finishRow;
      const t = setTimeout(finishRow, fallbackDelay);
      utter.onend = () => {
        clearTimeout(t);
        finishRow();
      };
    } else {
      setTimeout(finishRow, fallbackDelay);
    }
  }

  setTimeout(revealNext, 2000);

  return {};
}
