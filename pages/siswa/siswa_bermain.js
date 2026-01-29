/* ===============================
   ARENA BERMAIN - FINAL FIXED
================================ */
import { genBil20_MengenalAngka } from "../../js/content/domains/bilangan/bil20/variants/mengenalAngka.js";
import { renderDragDropNumberToBox } from "../../js/game/renderers/dragdrop_number_to_box.js";
import { genBil20_TarikGaris } from "../../js/content/domains/bilangan/bil20/variants/tarikGaris.js";
import { renderMatchLineCountToNumber } from "../../js/game/renderers/match_line_count_to_number.js";
import { genBil20_Urutkan } from "../../js/content/domains/bilangan/bil20/variants/urutkan.js";
import { renderUrutkanSequenceFill } from "../../js/game/renderers/urutkan_sequence_fill.js";
import { genBil50_HitungObjek } from "../../js/content/domains/bilangan/bil50/variants/hitungObjek.js";
import { genBil50_TambahMobil } from "../../js/content/domains/bilangan/operasi50/tambahMobil.js";
import { genBil50_KurangApel } from "../../js/content/domains/bilangan/operasi50/kurangApel.js";
import { genBil50_BagiDonat } from "../../js/content/domains/bilangan/operasi50/bagiDonat.js";
import { genBil50_KaliKursi } from "../../js/content/domains/bilangan/operasi50/kaliKursi.js";
import { genPecahan_BagiPizza } from "../../js/content/domains/bilangan/pecahan/bagiPizza.js";
import { genPecahan_BandingkanPizza } from "../../js/content/domains/bilangan/pecahan/bandingkanPizza.js";
import { genDesimal_BarWarna } from "../../js/content/domains/bilangan/desimalpersen/desimal.js";
import { renderCountObjectsPickNumber } from "../../js/game/renderers/count_objects_pick_number.js";
import { genNilaiTempat_NilaiGambar } from "../../js/content/domains/bilangan/nilaiTempat/variants/nilaiGambar.js";
import { renderImagePlaceValuePick } from "../../js/game/renderers/image_place_value_pick.js";
import { genUang20_KenalUang } from "../../js/content/domains/bilangan/uang20/variants/kenalUang.js";
import { renderMoneyDragMatch } from "../../js/game/renderers/money_drag_match.js";
import { genUang20_BelanjaBarang } from "../../js/content/domains/bilangan/uang20/variants/belanjaBarang.js";
import { renderMoneyShopSum } from "../../js/game/renderers/money_shop_sum.js";
import { genUang50_BenarTidak } from "../../js/content/domains/bilangan/uang50/variants/benarTidak.js";
import { renderMoneyTrueFalse } from "../../js/game/renderers/money_true_false.js";
import { genUang50_CelenganKu } from "../../js/content/domains/bilangan/uang50/variants/celenganKu.js";
import { renderMoneyPiggyBank } from "../../js/game/renderers/money_piggy_bank.js";
import { renderCarAdditionPick } from "../../js/game/renderers/car_addition_pick.js";
import { renderAppleSubtractionPick } from "../../js/game/renderers/apple_subtraction_pick.js";
import { renderDonutDivisionDrag } from "../../js/game/renderers/donut_division_drag.js";
import { renderChairMultiplicationRows } from "../../js/game/renderers/chair_multiplication_rows.js";
import { renderPizzaFractionPick } from "../../js/game/renderers/pizza_fraction_pick.js";
import { renderPizzaCompareDrag } from "../../js/game/renderers/pizza_compare_drag.js";
import { renderBarDecimalPick } from "../../js/game/renderers/bar_decimal_pick.js";

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

// ---------- SPEECH (INSTRUCTION)
let cachedVoice = null;
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = pickMaleVoice();
  };
}

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

function speakPrompt(text) {
  if (!window.speechSynthesis) return;
  try {
    if (!cachedVoice) cachedVoice = pickMaleVoice();
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "id-ID";
    utter.voice = cachedVoice;
    utter.rate = 0.95;
    utter.pitch = 1.15;
    window.speechSynthesis.speak(utter);
  } catch {}
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

function handleCorrectAnswer(){
  const overlayCard = document.querySelector(".overlay-card");
  stars++;
  playCorrect();
  launchConfetti();
  overlayCard.classList.add("correct-pop");

  showOverlay({
    title:"HEBAT!",
    text:"Jawaban kamu benar!",
    img:"../../assets/image/bird1.gif",
    primaryText:"LANJUT",
    onPrimary:()=> {
      overlayCard.classList.remove("correct-pop");
      nextQuestion();
    }
  });

  updateTopbar();
}

function handleWrongAnswer(message){
  const overlayCard = document.querySelector(".overlay-card");
  playWrong();
  overlayCard.classList.add("wrong-shake");

  showOverlay({
    title:"Coba Lagi",
    text: message || "Coba lagi ya",
    img:"../../assets/image/robo.png",
    primaryText:"ULANG",
    onPrimary:()=> {
      overlayCard.classList.remove("wrong-shake");
      renderQuestion();
    }
  });
}

function renderQuestion(){
  const q = questions[index];
  document.body.classList.toggle("matchline-mode", q.type === "match_line_count_to_number");
  document.body.classList.toggle("countobj-mode", q.type === "count_objects_pick_number");
  document.body.classList.toggle("balloon-mode", q.type === "catch_balloon_number");
  document.body.classList.toggle("rain-mode", q.type === "catch_number_rain");
  document.body.classList.toggle("tower-mode", q.type === "stack_number_tower");
  document.body.classList.toggle("finger-mode", q.type === "finger_addition_pick");
  document.body.classList.toggle("objadd-mode", q.type === "objects_addition_pick");
  document.body.classList.toggle("pv-mode", q.type === "place_value_boxes");
  document.body.classList.toggle("imgpv-mode", q.type === "image_place_value_pick");
  document.body.classList.toggle("money-mode", q.type === "money_drag_match");
  document.body.classList.toggle("money-shop-mode", q.type === "money_shop_sum");
  document.body.classList.toggle("money-tf-mode", q.type === "money_true_false");
  document.body.classList.toggle("money-piggy-mode", q.type === "money_piggy_bank");
  document.body.classList.toggle("caradd-mode", q.type === "car_addition_pick");
  document.body.classList.toggle("applesub-mode", q.type === "apple_subtraction_pick");
  document.body.classList.toggle("donutdiv-mode", q.type === "donut_division_drag");
  document.body.classList.toggle("chairmul-mode", q.type === "chair_multiplication_pick");
  document.body.classList.toggle("pizza-mode", q.type === "pizza_fraction_pick");
  document.body.classList.toggle("pizzacmp-mode", q.type === "pizza_compare_drag");
  document.body.classList.toggle("bardecl-mode", q.type === "bar_decimal_pick");

  currentAnswer = null;
  btnSubmit.disabled = q.type === "catch_balloon_number" || q.type === "catch_number_rain";
  btnNext.disabled = true;

  if(q.type === "count_objects_pick_number"){
    const targetEmoji = q.data.targetEmoji || "⭐";
    questionTitle.innerHTML = `
      <span class="q-text">${q.prompt}</span>
      <span class="q-badge">
        <span class="q-badge-num">${q.data.targetCount}</span>
        <span class="q-badge-emoji">${targetEmoji}</span>
      </span>
    `;
  }else if(q.type === "catch_balloon_number"){
    questionTitle.innerHTML = `
      <span class="q-text">Cari angka</span>
      <span class="q-badge q-badge-balloon">
        <span class="q-badge-num">${q.data.targetNumber}</span>
      </span>
    `;
  }else if(q.type === "catch_number_rain"){
    questionTitle.textContent = q.prompt;
  }else if(q.type === "stack_number_tower"){
    questionTitle.textContent = q.prompt;
  }else if(q.type === "finger_addition_pick"){
    questionTitle.textContent = q.prompt;
  }else if(q.type === "objects_addition_pick"){
    questionTitle.textContent = q.prompt;
  }else if(q.type === "place_value_boxes"){
    questionTitle.textContent = q.prompt;
  }else if(q.type === "image_place_value_pick"){
    questionTitle.textContent = q.prompt;
  }else if(q.type === "car_addition_pick"){
    questionTitle.innerHTML = `
      <span class="q-text">${q.prompt}</span>
      <span class="q-badge">${q.data?.baseCount || 0} + ${q.data?.addCount || 0}</span>
    `;
  }else if(q.type === "apple_subtraction_pick"){
    questionTitle.innerHTML = `
      <span class="q-text">${q.prompt}</span>
      <span class="q-badge">${q.data?.baseCount || 0} - ${q.data?.subCount || 0}</span>
    `;
  }else if(q.type === "donut_division_drag"){
    questionTitle.innerHTML = `
      <span class="q-text">${q.prompt}</span>
      <span class="q-badge">${q.data?.total || 0} : ${q.data?.kids || 0}</span>
    `;
  }else if(q.type === "chair_multiplication_pick"){
    questionTitle.innerHTML = `
      <span class="q-text">${q.prompt}</span>
      <span class="q-badge">${q.data?.cols || 0} x ${q.data?.rows || 0}</span>
    `;
  }else if(q.type === "pizza_fraction_pick"){
    questionTitle.innerHTML = `
      <span class="q-text">${q.prompt}</span>
      <span class="q-badge">${q.data?.fraction || ""}</span>
    `;
  }else if(q.type === "pizza_compare_drag"){
    questionTitle.innerHTML = `
      <span class="q-text">${q.prompt}</span>
      <span class="q-badge">${q.data?.left?.n}/${q.data?.left?.d} ? ${q.data?.right?.n}/${q.data?.right?.d}</span>
    `;
  }else if(q.type === "bar_decimal_pick"){
    questionTitle.textContent = q.prompt;
  }else{
    questionTitle.textContent = q.prompt;
  }
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
  else if(q.type === "count_objects_pick_number"){
    rendererController = renderCountObjectsPickNumber({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
  }
  else if(q.type === "stack_number_tower"){
    rendererController = renderStackNumberTower({
      mount: questionBox,
      q,
      onChange: (arr) => { currentAnswer = arr; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "objects_addition_pick"){
    rendererController = renderObjectsAdditionPick({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "image_place_value_pick"){
    rendererController = renderImagePlaceValuePick({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "money_drag_match"){
    rendererController = renderMoneyDragMatch({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "money_shop_sum"){
    rendererController = renderMoneyShopSum({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "money_true_false"){
    rendererController = renderMoneyTrueFalse({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "money_piggy_bank"){
    rendererController = renderMoneyPiggyBank({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "car_addition_pick"){
    rendererController = renderCarAdditionPick({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "apple_subtraction_pick"){
    rendererController = renderAppleSubtractionPick({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "donut_division_drag"){
    rendererController = renderDonutDivisionDrag({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "chair_multiplication_pick"){
    rendererController = renderChairMultiplicationRows({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "pizza_fraction_pick"){
    rendererController = renderPizzaFractionPick({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "pizza_compare_drag"){
    rendererController = renderPizzaCompareDrag({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
  }
  else if(q.type === "bar_decimal_pick"){
    rendererController = renderBarDecimalPick({
      mount: questionBox,
      q,
      onAnswerChange: (v) => { currentAnswer = v; }
    });
    speakPrompt(q.prompt);
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
  if(
    currentAnswer === null ||
    (q.type === "stack_number_tower" && Array.isArray(currentAnswer) && currentAnswer.length === 0) ||
    (q.type === "money_drag_match" && (!(currentAnswer instanceof Map) || currentAnswer.size < (q.data?.items?.length || 0))) ||
    (q.type === "money_shop_sum" && (!currentAnswer || Number(currentAnswer.sum) <= 0)) ||
    (q.type === "money_true_false" && typeof currentAnswer !== "boolean") ||
    (q.type === "money_piggy_bank" && Number(currentAnswer) <= 0)
  ){
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
  if(q.type === "count_objects_pick_number"){
    correct = Number(currentAnswer) === Number(q.answer);
  }
  if(q.type === "catch_balloon_number"){
    correct = Number(currentAnswer) === Number(q.answer);
  }
  if(q.type === "stack_number_tower"){
    const ans = Array.isArray(currentAnswer) ? currentAnswer : [];
    const target = Array.isArray(q.answer) ? q.answer : [];
    correct = ans.length === target.length && ans.every((v,i)=>Number(v)===Number(target[i]));
  }
  if(q.type === "finger_addition_pick"){
    correct = Number(currentAnswer) === Number(q.answer);
  }
  if(q.type === "objects_addition_pick"){
    correct = Number(currentAnswer) === Number(q.answer);
  }
  if(q.type === "place_value_boxes"){
    const ans = Array.isArray(currentAnswer) ? currentAnswer : [];
    const target = Array.isArray(q.answer) ? q.answer : [];
    correct = ans.length === target.length && ans.every((v,i)=>Number(v)===Number(target[i]));
  }
  if(q.type === "image_place_value_pick"){
    correct = String(currentAnswer) === String(q.answer);
  }
  if(q.type === "money_drag_match"){
    const ans = currentAnswer instanceof Map ? currentAnswer : null;
    const items = q.data?.items || [];
    correct = !!ans && items.length > 0 && items.every((item) => {
      return Number(ans.get(item.id)) === Number(item.price);
    });
  }
  if(q.type === "money_shop_sum"){
    const ans = currentAnswer || null;
    const count = ans?.count ?? 0;
    const minNotes = q.data?.minNotes ?? 2;
    const maxNotes = q.data?.maxNotes ?? 3;
    correct = !!ans && Number(ans.sum) === Number(q.answer) && count >= minNotes && count <= maxNotes;
  }
  if(q.type === "money_true_false"){
    correct = typeof currentAnswer === "boolean" && currentAnswer === q.answer;
  }
  if(q.type === "money_piggy_bank"){
    correct = Number(currentAnswer) === Number(q.answer);
  }
  if(q.type === "car_addition_pick"){
    correct = Number(currentAnswer) === Number(q.answer);
  }
  if(q.type === "apple_subtraction_pick"){
    correct = Number(currentAnswer) === Number(q.answer);
  }
  if(q.type === "donut_division_drag"){
    correct = Number(currentAnswer) === Number(q.answer);
  }
  if(q.type === "chair_multiplication_pick"){
    correct = Number(currentAnswer) === Number(q.answer);
  }
  if(q.type === "pizza_fraction_pick"){
    correct = Number(currentAnswer) === Number(q.answer);
  }
  if(q.type === "pizza_compare_drag"){
    correct = String(currentAnswer) === String(q.answer);
  }
  if(q.type === "bar_decimal_pick"){
    correct = Number(currentAnswer) === Number(q.answer);
  }

  if(correct){
    handleCorrectAnswer();
    return;
  }

  if(false && correct){
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

  if(q.type === "stack_number_tower"){
    if(rendererController && typeof rendererController.fail === "function"){
      rendererController.fail();
    }
    const order = q.data?.order || "asc";
    handleWrongAnswer(order === "asc"
      ? "Urutkan dari kecil ke besar ya"
      : "Urutkan dari besar ke kecil ya");
    return;
  }
  if(q.type === "pizza_fraction_pick"){
    if(rendererController && typeof rendererController.reset === "function"){
      rendererController.reset();
    }
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

function generateBil50KumpulkanBintang(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genBil50_HitungObjek());
  }
  return shuffle(list);
}

function generateBil100TangkapAngka(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genNilaiTempat_NilaiGambar());
  }
  return shuffle(list);
}

function generateUang20KenalUang(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genUang20_KenalUang());
  }
  return shuffle(list);
}

function generateUang20BelanjaBarang(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genUang20_BelanjaBarang());
  }
  return shuffle(list);
}

function generateUang50BenarTidak(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genUang50_BenarTidak());
  }
  return shuffle(list);
}

function generateUang50CelenganKu(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genUang50_CelenganKu());
  }
  return shuffle(list);
}
function generateBil50TambahMobil(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genBil50_TambahMobil());
  }
  return shuffle(list);
}
function generateBil50KurangApel(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genBil50_KurangApel());
  }
  return shuffle(list);
}
function generateBil50BagiDonat(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genBil50_BagiDonat());
  }
  return shuffle(list);
}
function generateBil50KaliKursi(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genBil50_KaliKursi());
  }
  return shuffle(list);
}
function generatePecahanBagiPizza(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genPecahan_BagiPizza());
  }
  return shuffle(list);
}
function generatePecahanBandingkanPizza(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genPecahan_BandingkanPizza());
  }
  return shuffle(list);
}
function generateDesimalBarWarna(){
  const list = [];
  for(let i=0;i<TOTAL_QUESTIONS;i++){
    list.push(genDesimal_BarWarna());
  }
  return shuffle(list);
}
// ---------- INIT
function init(){
  buildDots();

  questions = generateDesimalBarWarna();
  index = 0;
  stars = 0;

  updateTopbar();
  renderQuestion();
  startIdleWatcher();
}
init();
