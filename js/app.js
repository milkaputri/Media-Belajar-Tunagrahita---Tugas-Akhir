/* =========================================================
   app.js (bootstrap-aligned)
   - Sidebar menu (home/profile/about)
   - Settings modal
   - Role + login/daftar (guru/siswa)
   - Settings aktif: theme, text size, music mute, sfx click
========================================================= */

// ---------- Element refs ----------
const htmlEl = document.documentElement;

const overlay = document.getElementById("overlay");
const sidebar = document.getElementById("sidebar");

const bgMusic = document.getElementById("bgMusic");
const sfxClick = document.getElementById("sfxClick");

// ---------- Overlay helpers ----------
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

// ---------- Sidebar helpers ----------
function openSidebar() {
  if (window.UI?.closeAll) UI.closeAll();
  sidebar?.setAttribute("aria-hidden", "false");
  document.body.classList.add("sidebar-open");
  showOverlay();
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

overlay?.addEventListener("click", closeAllFloating);

// =========================================================
// A) SETTINGS ENGINE (theme, text size, music, sfx)
// =========================================================
let settings = Storage.getSettings();
let audioUnlocked = false;

function applySettings(s) {
  htmlEl.setAttribute("data-theme", s.theme); // light/dark
  htmlEl.setAttribute("data-text", s.text);  // sm/md/lg

  document.querySelectorAll("[data-theme]").forEach(b => {
    b.classList.toggle("active", b.dataset.theme === s.theme);
  });
  document.querySelectorAll("[data-textsize]").forEach(b => {
    b.classList.toggle("active", b.dataset.textsize === s.text);
  });

  const soundBtn = document.getElementById("soundBtn");
  if (soundBtn) {
    const on = !!(s.music || s.sfx);
    soundBtn.textContent = on ? "\uD83D\uDD0A" : "\uD83D\uDD07";
    soundBtn.classList.toggle("off", !on);
  }
}

applySettings(settings);

async function tryPlayBgm() {
  if (!bgMusic) return;
  if (!settings.music) return;

  try {
    await bgMusic.play();
  } catch (_) {
    // autoplay diblok browser -> normal
  }
}

function playClickSfx() {
  if (!sfxClick) return;
  if (!settings.sfx) return;

  try {
    sfxClick.currentTime = 0;
    sfxClick.play();
  } catch (_) {}
}

async function unlockAudioOnce() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  await tryPlayBgm();
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) playClickSfx();
  unlockAudioOnce();
}, { passive: true });

document.querySelectorAll("[data-textsize]").forEach(btn => {
  btn.addEventListener("click", () => {
    settings.text = btn.dataset.textsize;
    Storage.saveSettings(settings);
    applySettings(settings);
    UI.toast?.("Ukuran teks diubah");
  });
});

document.querySelectorAll("[data-theme]").forEach(btn => {
  btn.addEventListener("click", () => {
    settings.theme = btn.dataset.theme;
    Storage.saveSettings(settings);
    applySettings(settings);
    UI.toast?.("Tema diubah");
  });
});

document.getElementById("soundBtn")?.addEventListener("click", async () => {
  const turnOn = !(settings.music || settings.sfx);
  settings.music = turnOn;
  settings.sfx = turnOn;

  Storage.saveSettings(settings);
  applySettings(settings);

  try {
    if (settings.music) await bgMusic.play();
    else bgMusic.pause();
  } catch (_) {}

  UI.toast?.(settings.music ? "Sound ON" : "Sound OFF");
});

// =========================================================
// B) ROLE MODAL FLOW
// =========================================================
document.getElementById("btnMulai")?.addEventListener("click", () => {
  closeAllFloating();
  UI.openModal("modalRole");
});

document.getElementById("chooseGuru")?.addEventListener("click", () => {
  UI.closeAll();
  UI.openModal("modalLoginGuru");
});

document.getElementById("chooseSiswa")?.addEventListener("click", () => {
  UI.closeAll();
  UI.openModal("modalLoginSiswa");
});

document.getElementById("toDaftarGuru")?.addEventListener("click", () => {
  UI.closeAll();
  UI.openModal("modalDaftarGuru");
});
document.getElementById("toLoginGuru")?.addEventListener("click", () => {
  UI.closeAll();
  UI.openModal("modalLoginGuru");
});

document.getElementById("toDaftarSiswa")?.addEventListener("click", () => {
  UI.closeAll();
  UI.openModal("modalDaftarSiswa");
});
document.getElementById("toLoginSiswa")?.addEventListener("click", () => {
  UI.closeAll();
  UI.openModal("modalLoginSiswa");
});

// =========================================================
// C) LOGIN / REGISTER
// =========================================================
document.getElementById("btnDaftarGuru")?.addEventListener("click", () => {
  const username = document.getElementById("guruNamaDaftar").value.trim();
  const pass = document.getElementById("guruPassDaftar").value.trim();

  if (!username || !pass) return UI.toast("Isi nama akun & kata sandi dulu ya.");
  const res = Storage.registerGuru(username, pass);
  UI.toast(res.msg);

  if (res.ok) {
    UI.closeAll();
    UI.openModal("modalLoginGuru");
    document.getElementById("guruNama").value = username;
    document.getElementById("guruPass").value = "";
  }
});

document.getElementById("btnLoginGuru")?.addEventListener("click", () => {
  const username = document.getElementById("guruNama").value.trim();
  const pass = document.getElementById("guruPass").value.trim();

  if (!username || !pass) return UI.toast("Isi nama akun & kata sandi dulu ya.");
  const res = Storage.loginGuru(username, pass);
  UI.toast(res.msg);

  if (res.ok) {
    closeAllFloating();
    UI.toast("Berhasil! (Nanti lanjut halaman guru)");
  }
});

document.getElementById("btnDaftarSiswa")?.addEventListener("click", () => {
  const depan = document.getElementById("siswaDepanDaftar").value.trim();
  const belakang = document.getElementById("siswaBelakangDaftar").value.trim();

  if (!depan || !belakang) return UI.toast("Isi nama depan & belakang dulu ya.");
  const res = Storage.registerSiswa(depan, belakang);
  UI.toast(res.msg);

  if (res.ok) {
    UI.closeAll();
    UI.openModal("modalLoginSiswa");
    document.getElementById("siswaDepan").value = depan;
    document.getElementById("siswaBelakang").value = belakang;
  }
});

document.getElementById("btnLoginSiswa")?.addEventListener("click", () => {
  const depan = document.getElementById("siswaDepan").value.trim();

  if (!depan) {
    UI.toast("Masukkan nama dulu ya.");
    return;
  }

  localStorage.setItem("dummy_siswa_nama", depan);
  window.location.href = "../../pages/siswa/siswa_home.html";
});

// =========================================================
// D) SIDEBAR MENU + SETTINGS BUTTON
// =========================================================
document.getElementById("menuBtn")?.addEventListener("click", openSidebar);
document.getElementById("sidebarClose")?.addEventListener("click", closeAllFloating);

document.querySelectorAll(".side-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".side-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const dest = btn.dataset.nav;
    closeSidebar();

    if (dest === "home") {
      UI.toast("Halaman utama");
      return;
    }
    if (dest === "profile") {
      UI.openModal("panelProfile");
      return;
    }
    if (dest === "about") {
      UI.openModal("panelAbout");
    }
  });
});

document.getElementById("settingsBtn")?.addEventListener("click", () => {
  closeSidebar();
  UI.openModal("modalSettings");
  if (audioUnlocked) tryPlayBgm();
});
