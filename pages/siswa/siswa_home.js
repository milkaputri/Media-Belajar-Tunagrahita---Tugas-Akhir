/* =========================================================
   SISWA_HOME.JS (bootstrap-aligned)
   - Sidebar
   - Settings modal
   - Apply settings: theme, text size, music
   - Sound: BGM + Click SFX
========================================================= */

const htmlEl = document.documentElement;

const overlay = document.getElementById("overlay");
const sidebar = document.getElementById("sidebar");

const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");

let settings = Storage.getSettings();

function setAudioState() {
  if (!bgMusic) return;
  bgMusic.volume = 0.4;

  if (!settings.music) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
}

function playClickSfx() {
  if (!settings.music) return;
  if (!clickSound) return;

  try {
    clickSound.currentTime = 0;
    clickSound.volume = 0.8;
    clickSound.play();
  } catch {}
}

async function tryPlayMusic() {
  if (!bgMusic) return;
  if (!settings.music) return;

  try {
    bgMusic.volume = 0.4;
    await bgMusic.play();
  } catch {}
}

document.addEventListener(
  "pointerdown",
  () => {
    tryPlayMusic();
  },
  { once: true }
);

function showOverlay() {
  if (!overlay) return;
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}
function hideOverlay() {
  if (!overlay) return;
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

function closeSidebar() {
  sidebar?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sidebar-open");
  hideOverlay();
}

function closeAllFloating() {
  if (window.UI?.closeAll) UI.closeAll();
  closeSidebar();
}

overlay?.addEventListener("click", () => {
  playClickSfx();
  closeAllFloating();
});

function openSidebar() {
  playClickSfx();
  if (window.UI?.closeAll) UI.closeAll();
  sidebar?.setAttribute("aria-hidden", "false");
  document.body.classList.add("sidebar-open");
  showOverlay();
}

document.getElementById("menuBtn")?.addEventListener("click", openSidebar);
document.getElementById("sidebarClose")?.addEventListener("click", () => {
  playClickSfx();
  closeAllFloating();
});

document.querySelectorAll(".side-item").forEach(btn => {
  btn.addEventListener("click", () => {
    playClickSfx();

    document.querySelectorAll(".side-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const dest = btn.dataset.nav;
    closeSidebar();

    if (dest === "home") return;
    if (dest === "profile") return UI.openModal("panelProfile");
    if (dest === "about") return UI.openModal("panelAbout");
    if (dest === "keluar") return (window.location.href = "../../index.html");
  });
});

document.getElementById("settingsBtn")?.addEventListener("click", () => {
  playClickSfx();
  closeSidebar();
  UI.openModal("modalSettings");
});

function applySettings(s) {
  htmlEl.setAttribute("data-theme", s.theme);
  htmlEl.setAttribute("data-text", s.text);

  document.querySelectorAll("[data-theme]").forEach(b => {
    b.classList.toggle("active", b.dataset.theme === s.theme);
  });
  document.querySelectorAll("[data-textsize]").forEach(b => {
    b.classList.toggle("active", b.dataset.textsize === s.text);
  });

  const soundBtn = document.getElementById("soundBtn");
  if (soundBtn) {
    soundBtn.textContent = s.music ? "\uD83D\uDD0A" : "\uD83D\uDD07";
    soundBtn.classList.toggle("off", !s.music);
  }

  setAudioState();
}

applySettings(settings);

document.querySelectorAll("[data-textsize]").forEach(btn => {
  btn.addEventListener("click", () => {
    playClickSfx();
    settings.text = btn.dataset.textsize;
    Storage.saveSettings(settings);
    applySettings(settings);
  });
});

document.querySelectorAll("[data-theme]").forEach(btn => {
  btn.addEventListener("click", () => {
    playClickSfx();
    settings.theme = btn.dataset.theme;
    Storage.saveSettings(settings);
    applySettings(settings);
  });
});

document.getElementById("soundBtn")?.addEventListener("click", async () => {
  if (settings.music) playClickSfx();

  settings.music = !settings.music;
  Storage.saveSettings(settings);
  applySettings(settings);

  if (settings.music) {
    playClickSfx();
    await tryPlayMusic();
  }
});

document.getElementById("btnBelajar")?.addEventListener("click", async () => {
  playClickSfx();
  await tryPlayMusic();
});

const btnBermain = document.getElementById("btnBermain");
if (btnBermain) {
  btnBermain.addEventListener("click", () => {
    const bgm = new Audio("../../assets/sounds/mp3.1.mp3");
    bgm.loop = true;
    bgm.volume = 0.4;

    bgm.play().then(() => {
      sessionStorage.setItem("bgmUnlocked", "1");
      window.location.href = "./siswa_bermain.html";
    }).catch(() => {
      window.location.href = "./siswa_bermain.html";
    });
  });
}
