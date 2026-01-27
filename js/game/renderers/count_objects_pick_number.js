export function renderCountObjectsPickNumber({ mount, q, onAnswerChange }) {
  let selectedCount = 0;
  let lastSpokenAt = 0;
  let cachedVoice = null;

  function pickFemaleVoice() {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;

    const idVoices = voices.filter(v => (v.lang || "").toLowerCase().startsWith("id"));
    const femaleHint = v => /female|perempuan|cewek|girl|wanita/i.test(v.name || "");

    const idFemale = idVoices.find(femaleHint);
    if (idFemale) return idFemale;

    const idAny = idVoices[0];
    if (idAny) return idAny;

    const anyFemale = voices.find(femaleHint);
    return anyFemale || voices[0];
  }

  function ensureVoice() {
    if (cachedVoice) return cachedVoice;
    cachedVoice = pickFemaleVoice();
    return cachedVoice;
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = pickFemaleVoice();
    };
  }

  function numberToIdWords(n) {
    const base = [
      "nol","satu","dua","tiga","empat","lima","enam","tujuh","delapan","sembilan","sepuluh","sebelas"
    ];
    if (n < 12) return base[n];
    if (n < 20) return `${base[n - 10]} belas`;
    if (n < 100) {
      const tens = Math.floor(n / 10);
      const rest = n % 10;
      const tensWord = `${base[tens]} puluh`;
      return rest ? `${tensWord} ${base[rest]}` : tensWord;
    }
    return String(n);
  }

  function speakCount(n) {
    if (!window.speechSynthesis) return;
    const now = Date.now();
    if (now - lastSpokenAt < 120) return;
    lastSpokenAt = now;

    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(numberToIdWords(n));
      utter.lang = "id-ID";
      utter.voice = ensureVoice();
      utter.rate = 0.95;
      utter.pitch = 1.2;
      window.speechSynthesis.speak(utter);
    } catch {}
  }

  const wrap = document.createElement("div");
  wrap.className = "co-wrap";

  const board = document.createElement("div");
  board.className = "co-board";

  const objects = document.createElement("div");
  objects.className = "co-objects";

  q.data.objects.forEach(obj => {
    const it = document.createElement("button");
    it.type = "button";
    it.className = "co-item";
    it.textContent = obj.emoji || "⭐";
    it.dataset.target = obj.isTarget ? "1" : "0";

    if (!obj.isTarget) {
      it.classList.add("co-item-dim");
      it.setAttribute("aria-disabled", "true");
    } else {
      it.addEventListener("click", () => {
        it.classList.toggle("selected");
        selectedCount += it.classList.contains("selected") ? 1 : -1;
        onAnswerChange(selectedCount);
        speakCount(selectedCount);
      });
    }

    objects.appendChild(it);
  });

  board.appendChild(objects);

  wrap.appendChild(board);

  mount.innerHTML = "";
  mount.appendChild(wrap);

  onAnswerChange(null);
  return { getAnswer: () => selectedCount };
}
