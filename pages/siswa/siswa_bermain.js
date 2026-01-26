/* ===============================
   ARENA BERMAIN - FINAL FIXED
================================ */

const TOTAL_QUESTIONS = 20;
const IDLE_LIMIT_MS = 5 * 60 * 1000;

// ---------- ELEMENTS
const btnBack = document.getElementById("btnBack");
const btnSettings = document.getElementById("btnSettings");
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
const bgm = new Audio("/assets/sounds/mp3.1.mp3");
bgm.loop = true;
bgm.volume = 0.4;

const sfxCorrect = new Audio("/assets/sounds/benar.mp3");
const sfxWrong = new Audio("/assets/sounds/salah.mp3");
const sfxClick = new Audio("/assets/sounds/click.mp3");
const sfxBonus = new Audio("/assets/sounds/mp3.2.mp3");

function tryAutoPlayBGM(){
  // kalau user datang dari klik tombol bermain (udah unlock)
  const unlocked = sessionStorage.getItem("bgmUnlocked") === "1";
  if(!unlocked) return;

  // coba langsung play bgm
  bgm.play().catch(()=>{});
}


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
function tryAutoPlayBGM(){
  // kalau user datang dari klik tombol bermain (udah unlock)
  const unlocked = sessionStorage.getItem("bgmUnlocked") === "1";
  if(!unlocked) return;

  // coba langsung play bgm
  bgm.play().catch(()=>{});
}


function unlockAudio(){
  if(audioUnlocked) return;
  audioUnlocked = true;

  // unlock browser + langsung mulai BGM
  bgm.play().then(() => {
    bgm.volume = 0.4;
  }).catch(()=>{});
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
function renderQuestion(){
  const q=questions[index];
  selected=null;
  btnSubmit.disabled=false;
  btnNext.disabled=true;

  questionTitle.textContent=q.prompt;
  questionBox.innerHTML="";

  q.options.forEach(opt=>{
    const b=document.createElement("button");
    b.className="choice";
    b.textContent=opt;
    b.onclick=()=>{
      setLastAction();
      sfxClick.play().catch(()=>{});
      selected=opt;
      [...questionBox.children].forEach(x=>x.classList.remove("selected"));
      b.classList.add("selected");
    };
    questionBox.appendChild(b);
  });

  updateTopbar();
}

// ---------- DEMO QUESTIONS
function generateQuestionsDemo(){
  const base=[];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    const ans=Math.floor(Math.random()*20)+1;
    base.push({
      prompt:`Pilih angka ${ans}`,
      options:shuffle([ans,ans+1,ans-1,Math.floor(Math.random()*20)+1]),
      answer:ans
    });
  }
  return base;
}

// ---------- GAME FLOW
function submitAnswer(){
  const q=questions[index];
  if(selected===null){
    showOverlay({
      title:"Pilih Jawaban 😊",
      text:"Ayo pilih salah satu dulu ya",
      img:"../../assets/image/robo.png",
      primaryText:"OK"
    });
    return;
  }

  const correct=Number(selected)===Number(q.answer);
  const overlayCard=document.querySelector(".overlay-card");

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
      onPrimary:()=>{
        overlayCard.classList.remove("correct-pop");
        nextQuestion();
      }
    });
  }else{
    playWrong();
    overlayCard.classList.add("wrong-shake");

    showOverlay({
      title:`<div class="wrong-emoji">❌</div> Coba Lagi 😊`,
      text:"Tenang, kita ulang ya",
      img:"../../assets/image/robo.png",
      primaryText:"ULANG",
      onPrimary:()=>{
        overlayCard.classList.remove("wrong-shake");
        renderQuestion();
      }
    });
  }

  updateTopbar();
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

btnSettings.onclick = () => {
  unlockAudio();
  showOverlay({
    title:"Pengaturan ⚙",
    text:"Versi awal",
    img:"../../assets/image/robo.png",
    primaryText:"TUTUP"
  });
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



// ---------- INIT
function init(){
  buildDots();
  questions = generateQuestionsDemo();
  renderQuestion();
  startIdleWatcher();

  tryAutoPlayBGM(); // ✅ mulai otomatis kalau sudah unlock dari halaman sebelumnya
}
init();
