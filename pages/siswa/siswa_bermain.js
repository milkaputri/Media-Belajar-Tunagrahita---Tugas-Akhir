/* ===============================
   ARENA BERMAIN - FINAL FIXED
================================ */
import { genBil20_MengenalAngka } from "../../js/content/domains/bilangan/bil20/variants/mengenalAngka.js";
import { renderDragDropNumberToBox } from "../../js/game/renderers/dragdrop_number_to_box.js";
import { genBil20_TarikGaris } from "../../js/content/domains/bilangan/bil20/variants/tarikGaris.js";
import { renderMatchLineCountToNumber } from "../../js/game/renderers/match_line_count_to_number.js";
import { genBil20_Urutkan } from "../../js/content/domains/bilangan/bil20/variants/urutkan.js";
import { renderUrutkanSequenceFill } from "../../js/game/renderers/urutkan_sequence_fill.js";

const TOTAL_QUESTIONS = 20;
const IDLE_LIMIT_MS = 5 * 60 * 1000;

// ---------- ELEMENTS
const btnBack = document.getElementById("btnBack");
const stepNowEl = document.getElementById("stepNow");
const stepTotalEl = document.getElementById("stepTotal");
const stepDots = document.getElementById("stepDots");
const starCountEl = document.getElementById("starCount");
const questionTitle = document.getElementById("questionTitle");
const questionBox = document.getElementById("questionBox");
const btnSubmit = document.getElementById("btnSubmit");
const btnNext = document.getElementById("btnNext");

// Overlay
const overlay = document.getElementById("overlay");
const overlayImg = document.getElementById("overlayImg");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const overlayPrimary = document.getElementById("overlayPrimary");
const overlaySecondary = document.getElementById("overlaySecondary");

// ---------- AUDIO CONTROLLER
const bgm = new Audio("../../assets/sounds/mp3.1.mp3");
bgm.loop = true;
bgm.volume = 0.4;

const sfxCorrect = new Audio("../../assets/sounds/benar.mp3");
const sfxWrong = new Audio("../../assets/sounds/salah.mp3");
const sfxClick = new Audio("../../assets/sounds/click.mp3");
const sfxBonus = new Audio("../../assets/sounds/mp3.2.mp3");

function stopAllSounds(){
  [bgm, sfxCorrect, sfxWrong, sfxClick, sfxBonus].forEach(a=>{
    a.pause();
    a.currentTime = 0;
  });
}

function playBGM(){
  stopAllSounds();
  bgm.play().catch(()=>{});
}

function playCorrect(){
  bgm.pause();
  sfxCorrect.currentTime = 0;
  sfxCorrect.play().catch(()=>{});
  sfxCorrect.onended = () => bgm.play().catch(()=>{});
}

function playWrong(){
  bgm.pause();
  sfxWrong.currentTime = 0;
  sfxWrong.play().catch(()=>{});
  sfxWrong.onended = () => bgm.play().catch(()=>{});
}


/* ===== AUDIO UNLOCK (WAJIB) ===== */
let audioUnlocked = false;

function unlockAudio(){
  if(audioUnlocked) return;
  audioUnlocked = true;
  bgm.play().catch(()=>{});
}


// ---------- STATE
let stars = 0;
let index = 0;
let selected = null;
let lastActionAt = Date.now();
let idleInterval = null;
let questions = [];

// ---------- CONFETTI
function launchConfetti(){
  const colors = ["#FFC700","#FF6B6B","#4D96FF","#6BCF63","#9B5DE5"];
  for(let i=0;i<60;i++){
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random()*100+"vw";
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.animationDuration = (Math.random()*1.5+1.5)+"s";
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),3000);
  }
}

// ---------- HELPERS
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function setLastAction(){ lastActionAt = Date.now(); }

// ---------- UI
function buildDots(){
  stepDots.innerHTML = "";

  for(let i=0;i<TOTAL_QUESTIONS;i++){
    const num = i + 1;
    const isCheckpoint = (num % 5 === 0);

    const el = document.createElement("div");

    if(isCheckpoint){
      el.className = "checkpoint";
      el.dataset.checkpoint = num;

      const img = document.createElement("img");
      img.src = "../../assets/image/gift.png";
      img.className = "gift-icon";
      img.alt = "Bonus";

      el.appendChild(img);

      // klik gift di stepper => tampilkan bonus (gift -> 3stra)
      el.addEventListener("click", () => {
        showGiftFeedback();
      });
    }else{
      el.className = "step";
    }

    stepDots.appendChild(el);
  }
}



function updateTopbar(){
  stepNowEl.textContent=index+1;
  stepTotalEl.textContent=TOTAL_QUESTIONS;
  starCountEl.textContent=stars;

  [...stepDots.children].forEach((el,i)=>{
    el.classList.remove("done","now");
    if(i<index) el.classList.add("done");
    if(i===index) el.classList.add("now");
  });
}

function showOverlay({title,text,img,primaryText,onPrimary}){
  overlayTitle.innerHTML=title;
  overlayText.textContent=text;
  overlayImg.src=img;
  overlayPrimary.textContent=primaryText;
  overlaySecondary.classList.add("hidden");
  overlay.classList.remove("hidden");

  overlayPrimary.onclick=()=>{
    overlay.classList.add("hidden");
    if(onPrimary) onPrimary();
  };
}

// ---------- RENDER QUESTION
let currentAnswer = null;
let rendererController = null; // optional: buat destroy kalau perlu

function renderQuestion(){
  const q = questions[index];
  document.body.classList.toggle("matchline-mode", q.type === "match_line_count_to_number");

  currentAnswer = null;
  btnSubmit.disabled = false;
  btnNext.disabled = true;

  questionTitle.textContent = q.prompt;
  questionBox.innerHTML = "";

  if(rendererController && typeof rendererController.destroy === "function"){
    rendererController.destroy();
  }
  rendererController = null;

  if(q.type === "dragdrop_number_to_box"){
    rendererController = renderDragDropNumberToBox({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
  } 
  else if(q.type === "match_line_count_to_number"){
    rendererController = renderMatchLineCountToNumber({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
  } 
  else if(q.type === "urutkan_sequence_fill"){
    rendererController = renderUrutkanSequenceFill({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
  }
  else {
    // fallback debug
    questionBox.innerHTML = `<div style="padding:16px;font-weight:900">Tipe soal belum ada renderer: ${q.type}</div>`;
  }

  updateTopbar();
  setLastAction();
}




// ---------- GAME FLOW
function submitAnswer(){
  const q = questions[index];

  // belum jawab apa-apa
  if(currentAnswer === null){
    showOverlay({
      title:"Belum selesai 😊",
      text:"Kerjakan dulu ya (tarik garis / drag angka) lalu klik CEK.",
      img:"../../assets/image/robo.png",
      primaryText:"OK"
    });
    return;
  }

  const overlayCard = document.querySelector(".overlay-card");
  let correct = false;

  // ===== CEK UNTUK VERSI 1 (dragdrop mengenal angka)
  if(q.type === "dragdrop_number_to_box"){
    correct = Number(currentAnswer) === Number(q.answer);
  }

  // ===== CEK UNTUK VERSI 2 (tarik garis)
  if(q.type === "match_line_count_to_number"){
    // currentAnswer = Map(leftId -> rightId)
    // benar kalau semua kiri sudah terhubung (lengkap)
    correct = currentAnswer instanceof Map && currentAnswer.size === q.data.left.length;

    // kalau kamu mau "cek benar beneran", nanti kita upgrade (pakai correctMap)
  }
  // ===== CEK UNTUK VERSI 3 (urutkan)
  if(q.type === "urutkan_sequence_fill"){
    if(currentAnswer instanceof Map){
      correct = q.data.blanks.every((idx) => {
        const v = currentAnswer.get(idx);
        return Number(v) === Number(q.data.sequence[idx]);
      });
    }else{
      correct = false;
    }
  }

  if(correct){
    stars++;
    playCorrect();
    launchConfetti();
    overlayCard.classList.add("correct-pop");

    showOverlay({
      title:"HEBAT! 🎉⭐",
      text:"Jawaban kamu benar!",
      img:"../../assets/image/bird1.gif",
      primaryText:"LANJUT",
      onPrimary:()=> {
        overlayCard.classList.remove("correct-pop");
        nextQuestion();
      }
    });

    updateTopbar();
    return;
  }

  // salah
  playWrong();
  overlayCard.classList.add("wrong-shake");

  showOverlay({
    title:`<div class="wrong-emoji">❌</div> Coba Lagi 😊`,
    text:"Tenang, kita ulang ya",
    img:"../../assets/image/robo.png",
    primaryText:"ULANG",
    onPrimary:()=> {
      overlayCard.classList.remove("wrong-shake");
      renderQuestion();
    }
  });
}


function nextQuestion(){
  if(index < TOTAL_QUESTIONS - 1){
    index++;

    // JIKA MASUK CHECKPOINT (5,10,15,20)
    if(index % 5 === 0){
      showGiftFeedback();   // ⬅️ FEEDBACK TENGAH (gift)
    }

    renderQuestion();
  }else{
    stopAllSounds();
    showOverlay({
      title:"SELESAI 🎉",
      text:`Bintang kamu: ${stars}`,
      img:"../../assets/image/robo.png",
      primaryText:"KEMBALI",
      onPrimary:()=>location.href="./siswa_home.html"
    });
  }
}

// ---------- IDLE REMINDER
function startIdleWatcher(){
  idleInterval=setInterval(()=>{
    if(Date.now()-lastActionAt>IDLE_LIMIT_MS){
      showOverlay({
        title:"Ayo Fokus 😊",
        text:"Kita lanjutkan ya",
        img:"../../assets/image/bird1.gif",
        primaryText:"LANJUT",
        onPrimary:setLastAction
      });
    }
  },1000);
}

// ---------- EVENTS
window.addEventListener("pointerdown", unlockAudio, { once: true });
btnSubmit.onclick = () => {
  unlockAudio();        // ⬅️ WAJIB
  submitAnswer();
};

btnNext.onclick = () => {
  unlockAudio();
  nextQuestion();
};

btnBack.onclick = () => {
  unlockAudio();
  location.href = "./siswa_home.html";
};

function showBonusStars(){
  // pakai overlay yang sudah ada
  overlayTitle.textContent = "BONUS! 🎉";
  overlayText.textContent = "Klik OK untuk lanjut bermain ya!";
  overlayImg.src = "../../assets/image/3star.png";

  // kasih animasi goyang ke gambar bonus
  overlayImg.classList.add("wiggle");

  overlayPrimary.textContent = "OK";
  overlaySecondary.classList.add("hidden");
  overlay.classList.remove("hidden");

  overlayPrimary.onclick = () => {
    overlay.classList.add("hidden");
    overlayImg.classList.remove("wiggle");
  };
}

function showGiftFeedback(){
  // STEP 1: tampilkan gift.png di tengah
  overlayTitle.textContent = "BONUS! 🎁";
  overlayText.textContent = "Klik hadiahnya ya!";
  overlayImg.src = "../../assets/image/gift.png";
  overlayImg.classList.add("wiggle");

  overlayPrimary.textContent = "BUKA";
  overlaySecondary.classList.add("hidden");
  overlay.classList.remove("hidden");

  // saat gift diklik (BUKA)
  overlayPrimary.onclick = () => {
    // STEP 2: ganti jadi 3stra.png
    overlayTitle.textContent = "DAPAT BONUS! ⭐⭐⭐";
    overlayText.textContent = "Hebat! Kamu dapat bintang tambahan!";
    overlayImg.src = "../../assets/image/3star.png";
    overlayImg.classList.add("wiggle");

    // contoh bonus bintang
    stars += 3;
    updateTopbar();

    overlayPrimary.textContent = "LANJUT";
    overlayPrimary.onclick = () => {
      overlayImg.classList.remove("wiggle");
      overlay.classList.add("hidden");
    };
  };
}

function generateBil20Mixed(){
  const list = [];
  const n1 = 7;
  const n2 = 7;
  const n3 = TOTAL_QUESTIONS - n1 - n2;

  for(let i=0;i<n1;i++) list.push(genBil20_MengenalAngka());
  for(let i=0;i<n2;i++) list.push(genBil20_TarikGaris());
  for(let i=0;i<n3;i++) list.push(genBil20_Urutkan());

  return shuffle(list); // pakai shuffle yang di HELPERS
}



// ---------- INIT
function init(){
  buildDots();

  questions = generateBil20Mixed();   // ✅ 20 soal campuran
  index = 0;
  stars = 0;

  updateTopbar();
  renderQuestion();
  startIdleWatcher();
}
init();
