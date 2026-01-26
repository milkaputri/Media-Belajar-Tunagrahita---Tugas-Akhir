/* =========================================================
   SISWA_HOME.JS
   - Sidebar (menu kiri)
   - Settings (⚙ kanan bawah)
   - Apply settings: theme, text size, music
========================================================= */

const htmlEl = document.documentElement;

const overlay = document.getElementById("overlay");
const sidebar = document.getElementById("sidebar");
const modalSettings = document.getElementById("modalSettings");

const panelProfile = document.getElementById("panelProfile");
const panelAbout = document.getElementById("panelAbout");

const bgMusic = document.getElementById("bgMusic");

// ---------- overlay helpers ----------
function showOverlay() {
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}
function hideOverlay() {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

// ---------- close helpers ----------
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
overlay.addEventListener("click", closeAllFloating);

// =========================================================
// 1) SIDEBAR
// =========================================================
function openSidebar() {
  closePanels();
  closeSettings();
  sidebar.setAttribute("aria-hidden", "false");
  document.body.classList.add("sidebar-open"); // biar tombol ☰ gak numpuk
  showOverlay();
}

document.getElementById("menuBtn").addEventListener("click", openSidebar);
document.getElementById("sidebarClose").addEventListener("click", closeAllFloating);

// menu sidebar
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const dest = btn.dataset.nav;

    // home
    if (dest === "home") {
      closeAllFloating();
      return;
    }

    // profile / about pakai panel
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

    // keluar (dummy)
    if (dest === "keluar") {
      // contoh: kembali ke halaman awal
      window.location.href = "/index.html";
    }
  });
});

// close panel (jika ada)
document.querySelectorAll("[data-closepanel]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.closepanel;
    const el = document.getElementById(id);
    if (el) el.setAttribute("aria-hidden", "true");
    hideOverlay();
  });
});

// =========================================================
// 2) SETTINGS (⚙)
// =========================================================
document.getElementById("settingsBtn").addEventListener("click", () => {
  closeSidebar();
  closePanels();
  modalSettings.setAttribute("aria-hidden", "false");
  showOverlay();
});

// tombol X di modal settings (data-close="modalSettings")
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.close;
    const el = document.getElementById(id);
    if (el) el.setAttribute("aria-hidden", "true");
    hideOverlay();
  });
});

// =========================================================
// 3) APPLY SETTINGS: theme, text, music
// =========================================================
function applySettings(s) {
  htmlEl.setAttribute("data-theme", s.theme); // light/dark
  htmlEl.setAttribute("data-text", s.text);  // sm/md/lg

  // active state button
  document.querySelectorAll("[data-theme]").forEach(b => {
    b.classList.toggle("active", b.dataset.theme === s.theme);
  });
  document.querySelectorAll("[data-textsize]").forEach(b => {
    b.classList.toggle("active", b.dataset.textsize === s.text);
  });

  // icon music
  const soundBtn = document.getElementById("soundBtn");
  if (soundBtn) {
    soundBtn.textContent = s.music ? "🔊" : "🔇";
    soundBtn.classList.toggle("off", !s.music);
  }
}

let settings = Storage.getSettings();
applySettings(settings);

// ubah text size
document.querySelectorAll("[data-textsize]").forEach(btn => {
  btn.addEventListener("click", () => {
    settings.text = btn.dataset.textsize;
    Storage.saveSettings(settings);
    applySettings(settings);
  });
});

// ubah theme
document.querySelectorAll("[data-theme]").forEach(btn => {
  btn.addEventListener("click", () => {
    settings.theme = btn.dataset.theme;
    Storage.saveSettings(settings);
    applySettings(settings);
  });
});

// toggle music
const soundBtn = document.getElementById("soundBtn");
if (soundBtn) {
  soundBtn.addEventListener("click", async () => {
    settings.music = !settings.music;
    Storage.saveSettings(settings);
    applySettings(settings);

    try {
      if (settings.music) await bgMusic.play();
      else bgMusic.pause();
    } catch (e) {
      // autoplay kadang diblok browser, tapi setting tetap tersimpan
    }
  });
}


function tryPlayMusic() {
  const music = document.getElementById("bgMusic");
  if (!music) return;

  const settings = Storage.getSettings();
  if (!settings.music) return;

  music.volume = 0.4;

  music.play().catch(() => {
    console.log("Autoplay diblokir, tunggu interaksi user");
  });
}

document.addEventListener("click", () => {
  tryPlayMusic();
}, { once: true });
