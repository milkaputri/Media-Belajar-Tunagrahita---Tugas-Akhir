/* =========================================================
   SISWA_HOME.JS (FIXED + SOUND)
   - Sidebar (menu kiri)
   - Settings (⚙ kanan bawah)
   - Apply settings: theme, text size, music
   - Sound: BGM + Click SFX (safe autoplay)
========================================================= */

const htmlEl = document.documentElement;

const overlay = document.getElementById("overlay");
const sidebar = document.getElementById("sidebar");
const modalSettings = document.getElementById("modalSettings");

const panelProfile = document.getElementById("panelProfile");
const panelAbout = document.getElementById("panelAbout");

// AUDIO (pastikan ada di HTML)
const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound"); // tambahkan di HTML

// ============= SETTINGS STATE =============
let settings = Storage.getSettings();

// ============= AUDIO HELPERS =============
function setAudioState() {
  if (!bgMusic) return;

  bgMusic.volume = 0.4;

  if (settings.music) {
    // jangan paksa autoplay, akan dicoba di tryPlayMusic()
  } else {
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
  } catch {
    // autoplay diblok browser -> normal
  }
}

// Klik pertama di halaman = trigger autoplay musik (sekali saja)
document.addEventListener(
  "pointerdown",
  () => {
    tryPlayMusic();
  },
  { once: true }
);

// ============= overlay helpers =============
function showOverlay() {
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}
function hideOverlay() {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

// ============= close helpers =============
function closeSidebar() {
  sidebar.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sidebar-open");
}
function closePanels() {
  if (panelProfile) panelProfile.setAttribute("aria-hidden", "true");
  if (panelAbout) panelAbout.setAttribute("aria-hidden", "true");
}
function closeSettings() {
  modalSettings.setAttribute("aria-hidden", "true");
}

// Tutup semuanya
function closeAllFloating() {
  closeSidebar();
  closePanels();
  closeSettings();
  hideOverlay();
}

// klik overlay = tutup semuanya
overlay.addEventListener("click", () => {
  playClickSfx();
  closeAllFloating();
});

// =========================================================
// 1) SIDEBAR
// =========================================================
function openSidebar() {
  playClickSfx();
  closePanels();
  closeSettings();
  sidebar.setAttribute("aria-hidden", "false");
  document.body.classList.add("sidebar-open");
  showOverlay();
}

document.getElementById("menuBtn")?.addEventListener("click", openSidebar);

document.getElementById("sidebarClose")?.addEventListener("click", () => {
  playClickSfx();
  closeAllFloating();
});

// menu sidebar
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    playClickSfx();

    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const dest = btn.dataset.nav;

    if (dest === "home") {
      closeAllFloating();
      return;
    }

    if (dest === "profile" && panelProfile) {
      closeSidebar();
      panelProfile.setAttribute("aria-hidden", "false");
      showOverlay();
      return;
    }

    if (dest === "about" && panelAbout) {
      closeSidebar();
      panelAbout.setAttribute("aria-hidden", "false");
      showOverlay();
      return;
    }

    if (dest === "keluar") {
      window.location.href = "/index.html";
    }
  });
});

// close panel (jika ada)
document.querySelectorAll("[data-closepanel]").forEach(btn => {
  btn.addEventListener("click", () => {
    playClickSfx();
    const id = btn.dataset.closepanel;
    const el = document.getElementById(id);
    if (el) el.setAttribute("aria-hidden", "true");
    hideOverlay();
  });
});

// =========================================================
// 2) SETTINGS (⚙)
// =========================================================
document.getElementById("settingsBtn")?.addEventListener("click", () => {
  playClickSfx();
  closeSidebar();
  closePanels();
  modalSettings.setAttribute("aria-hidden", "false");
  showOverlay();
});

// tombol X di modal (data-close="...")
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    playClickSfx();
    const id = btn.dataset.close;
    const el = document.getElementById(id);
    if (el) el.setAttribute("aria-hidden", "true");

    // kalau tidak ada panel/sidebar yg terbuka, matikan overlay
    closeSidebar();
    closePanels();
    hideOverlay();
  });
});

// =========================================================
// 3) APPLY SETTINGS: theme, text, music
// =========================================================
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
    soundBtn.textContent = s.music ? "🔊" : "🔇";
    soundBtn.classList.toggle("off", !s.music);
  }

  setAudioState();
}

applySettings(settings);

// ubah text size
document.querySelectorAll("[data-textsize]").forEach(btn => {
  btn.addEventListener("click", () => {
    playClickSfx();
    settings.text = btn.dataset.textsize;
    Storage.saveSettings(settings);
    applySettings(settings);
  });
});

// ubah theme
document.querySelectorAll("[data-theme]").forEach(btn => {
  btn.addEventListener("click", () => {
    playClickSfx();
    settings.theme = btn.dataset.theme;
    Storage.saveSettings(settings);
    applySettings(settings);
  });
});

// toggle music
document.getElementById("soundBtn")?.addEventListener("click", async () => {
  // klik saat mau mengaktifkan musik juga harus berbunyi? -> aman: bunyikan dulu sebelum dimatikan
  if (settings.music) playClickSfx();

  settings.music = !settings.music;
  Storage.saveSettings(settings);
  applySettings(settings);

  // kalau baru ON, coba play sekarang (user baru klik jadi autoplay aman)
  if (settings.music) {
    playClickSfx();
    await tryPlayMusic();
  }
});

// =========================================================
// 4) CLICK SFX UNTUK TOMBOL UTAMA (BELAJAR/BERMAIN)
// =========================================================
document.getElementById("btnBelajar")?.addEventListener("click", async () => {
  playClickSfx();
  await tryPlayMusic();
  // nanti redirect belajar:
  // window.location.href = "belajar.html";
});

document.getElementById("btnBermain")?.addEventListener("click", async () => {
  playClickSfx();
  await tryPlayMusic();
  // nanti redirect bermain:
  // window.location.href = "bermain.html";
});


// ===== NAVIGASI MENU SISWA =====
const btnBelajar = document.getElementById("btnBelajar");
const btnBermain = document.getElementById("btnBermain");

if(btnBermain){
  btnBermain.addEventListener("click", () => {
    // Unlock audio + start bgm sebelum pindah halaman
    const bgm = new Audio("../../assets/sounds/mp3.1.mp3");
    bgm.loop = true;
    bgm.volume = 0.4;

    bgm.play().then(() => {
      // simpan tanda bahwa audio sudah di-unlock
      sessionStorage.setItem("bgmUnlocked", "1");
      // pindah ke arena bermain
      window.location.href = "./siswa_bermain.html";
    }).catch(() => {
      // kalau tetap diblok, tetap pindah halaman
      window.location.href = "./siswa_bermain.html";
    });
  });
}


