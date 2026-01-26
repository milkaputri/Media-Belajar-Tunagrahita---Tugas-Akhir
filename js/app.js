/* =========================================================
   app.js (FINAL - stable)
   - Sidebar menu (home/profile/about)
   - Settings modal via tombol ⚙️
   - Role + login/daftar (guru/siswa)
   - Settings aktif: theme, text size, music mute, sfx click
   - FIX: tidak ada overlay nyangkut -> menu/settings tetap bisa diklik
========================================================= */

// ---------- Element refs ----------
const htmlEl = document.documentElement;

const overlay = document.getElementById("overlay");
const sidebar = document.getElementById("sidebar");
const modalSettings = document.getElementById("modalSettings");

const panelProfile = document.getElementById("panelProfile");
const panelAbout = document.getElementById("panelAbout");

const bgMusic = document.getElementById("bgMusic");
const sfxClick = document.getElementById("sfxClick");

// ---------- Overlay helpers ----------
function showOverlay() {
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}
function hideOverlay() {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

// ---------- Close helpers ----------
function closeSidebar() {
  sidebar?.setAttribute("aria-hidden", "true");
}
function closePanels() {
  panelProfile?.setAttribute("aria-hidden", "true");
  panelAbout?.setAttribute("aria-hidden", "true");
}
function closeSettings() {
  modalSettings?.setAttribute("aria-hidden", "true");
}

function closeAllFloating() {
  // tutup semua modal dari UI.js
  if (window.UI?.closeAll) UI.closeAll();

  closeSidebar();
  closePanels();
  closeSettings();
  hideOverlay();
}

// overlay click = tutup semuanya
overlay?.addEventListener("click", closeAllFloating);

// STOP klik di dalam card/modal supaya tidak “tembus” ke backdrop
document.querySelectorAll(".modal-card").forEach(card => {
  card.addEventListener("click", (e) => e.stopPropagation());
});
document.querySelectorAll(".panel").forEach(panel => {
  panel.addEventListener("click", (e) => e.stopPropagation());
});

// =========================================================
// A) SETTINGS ENGINE (theme, text size, music, sfx)
// =========================================================
let settings = Storage.getSettings();

// browser butuh interaksi user untuk play audio
let audioUnlocked = false;

function applySettings(s) {
  htmlEl.setAttribute("data-theme", s.theme); // light/dark
  htmlEl.setAttribute("data-text", s.text);  // sm/md/lg

  // active states
  document.querySelectorAll("[data-theme]").forEach(b => {
    b.classList.toggle("active", b.dataset.theme === s.theme);
  });
  document.querySelectorAll("[data-textsize]").forEach(b => {
    b.classList.toggle("active", b.dataset.textsize === s.text);
  });

  // icon mute (gabungan music + sfx)
  const soundBtn = document.getElementById("soundBtn");
  if (soundBtn) {
    const on = !!(s.music || s.sfx);
    soundBtn.textContent = on ? "🔊" : "🔇";
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
    // kalau diblock browser, biarkan; nanti coba lagi setelah user klik
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

// unlock audio setelah user klik pertama
async function unlockAudioOnce() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  await tryPlayBgm();
}

// ✅ klik tombol mana pun => sfx + unlock audio
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) playClickSfx();
  unlockAudioOnce();
}, { passive: true });

// text size buttons
document.querySelectorAll("[data-textsize]").forEach(btn => {
  btn.addEventListener("click", () => {
    settings.text = btn.dataset.textsize; // sm/md/lg
    Storage.saveSettings(settings);
    applySettings(settings);
    UI.toast?.("Ukuran teks diubah");
  });
});

// theme buttons
document.querySelectorAll("[data-theme]").forEach(btn => {
  btn.addEventListener("click", () => {
    settings.theme = btn.dataset.theme; // light/dark
    Storage.saveSettings(settings);
    applySettings(settings);
    UI.toast?.("Tema diubah");
  });
});

// mute/unmute (music + sfx sekaligus)
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
// B) MODAL CLOSE BUTTONS (X)
// =========================================================
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const id = btn.dataset.close;
    document.getElementById(id)?.setAttribute("aria-hidden", "true");

    // ✅ Tutup overlay kalau tidak ada modal/panel/sidebar yang sedang terbuka
    // paling aman: tutup semuanya biar state tidak nyangkut
    closeAllFloating();
  });
});

// close modal jika klik area gelap (backdrop modal)
document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.setAttribute("aria-hidden", "true");
      closeAllFloating();
    }
  });
});

// =========================================================
// C) ROLE MODAL FLOW
// =========================================================
document.getElementById("btnMulai")?.addEventListener("click", () => {
  closeAllFloating();
  UI.openModal("modalRole");
  showOverlay();
});

document.getElementById("chooseGuru")?.addEventListener("click", () => {
  UI.closeAll();
  UI.openModal("modalLoginGuru");
  showOverlay();
});

document.getElementById("chooseSiswa")?.addEventListener("click", () => {
  UI.closeAll();
  UI.openModal("modalLoginSiswa");
  showOverlay();
});

// switch guru login <-> daftar
document.getElementById("toDaftarGuru")?.addEventListener("click", () => {
  UI.closeAll();
  UI.openModal("modalDaftarGuru");
  showOverlay();
});
document.getElementById("toLoginGuru")?.addEventListener("click", () => {
  UI.closeAll();
  UI.openModal("modalLoginGuru");
  showOverlay();
});

// switch siswa login <-> daftar
document.getElementById("toDaftarSiswa")?.addEventListener("click", () => {
  UI.closeAll();
  UI.openModal("modalDaftarSiswa");
  showOverlay();
});
document.getElementById("toLoginSiswa")?.addEventListener("click", () => {
  UI.closeAll();
  UI.openModal("modalLoginSiswa");
  showOverlay();
});

// =========================================================
// D) LOGIN / REGISTER
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
    showOverlay();
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
    showOverlay();
    document.getElementById("siswaDepan").value = depan;
    document.getElementById("siswaBelakang").value = belakang;
  }
});

// document.getElementById("btnLoginSiswa")?.addEventListener("click", () => {
//   const depan = document.getElementById("siswaDepan").value.trim();
//   const belakang = document.getElementById("siswaBelakang").value.trim();

//   if (!depan || !belakang) return UI.toast("Isi nama depan & belakang dulu ya.");
//   const res = Storage.loginSiswa(depan, belakang);
//   UI.toast(res.msg);

//   if (res.ok) {
//     closeAllFloating();
//     UI.toast("Berhasil! (Nanti lanjut halaman siswa)");
//   }
// });

document.getElementById("btnLoginSiswa").addEventListener("click", () => {
  const depan = document.getElementById("siswaDepan").value.trim();

  if (!depan) {
    UI.toast("Masukkan nama dulu ya 🙂");
    return;
  }

  // simpan nama siswa (dummy)
  localStorage.setItem("dummy_siswa_nama", depan);

  window.location.href = "../../pages/siswa/siswa_home.html";
});



// =========================================================
// E) SIDEBAR MENU + SETTINGS BUTTON
// =========================================================
function openSidebar() {
  closePanels();
  closeSettings();
  UI.closeAll();
  sidebar.setAttribute("aria-hidden", "false");
  showOverlay();
}

document.getElementById("menuBtn")?.addEventListener("click", openSidebar);
document.getElementById("sidebarClose")?.addEventListener("click", closeAllFloating);

document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const dest = btn.dataset.nav;
    closePanels();
    closeSidebar();

    if (dest === "home") {
      closeAllFloating();
      UI.toast("Halaman utama");
    } else if (dest === "profile") {
      panelProfile.setAttribute("aria-hidden", "false");
      showOverlay();
    } else if (dest === "about") {
      panelAbout.setAttribute("aria-hidden", "false");
      showOverlay();
    }
  });
});

document.querySelectorAll("[data-closepanel]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById(btn.dataset.closepanel)?.setAttribute("aria-hidden", "true");
    closeAllFloating();
  });
});

// Settings modal via ⚙️
document.getElementById("settingsBtn")?.addEventListener("click", () => {
  closeSidebar();
  closePanels();
  UI.closeAll();

  modalSettings.setAttribute("aria-hidden", "false");
  showOverlay();

  // coba play bgm kalau settings.music ON dan sudah unlock
  if (audioUnlocked) tryPlayBgm();
});

