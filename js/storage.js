// js/storage.js
const Storage = (() => {
  // ===== AUTH STORAGE =====
  const KEY_AUTH = "ui_skripsi_auth_v1";

  function _readAuth(){
    const raw = localStorage.getItem(KEY_AUTH);
    if(!raw) return { guru: [], siswa: [] };
    try { return JSON.parse(raw); }
    catch { return { guru: [], siswa: [] }; }
  }

  function _saveAuth(data){
    localStorage.setItem(KEY_AUTH, JSON.stringify(data));
  }

  // ===== GURU =====
  function registerGuru(username, password){
    const db = _readAuth();
    const exist = db.guru.some(g => g.username.toLowerCase() === username.toLowerCase());
    if(exist) return { ok:false, msg:"Nama akun guru sudah dipakai." };

    db.guru.push({ username, password });
    _saveAuth(db);
    return { ok:true, msg:"Akun guru berhasil dibuat." };
  }

  function loginGuru(username, password){
    const db = _readAuth();
    const found = db.guru.find(g =>
      g.username.toLowerCase() === username.toLowerCase() && g.password === password
    );
    if(!found) return { ok:false, msg:"Nama akun / kata sandi salah." };
    return { ok:true, msg:"Login guru berhasil." };
  }

  // ===== SISWA =====
  function registerSiswa(namaDepan, namaBelakang){
    const db = _readAuth();
    const full = (namaDepan + " " + namaBelakang).trim().toLowerCase();

    const exist = db.siswa.some(s => s.full.toLowerCase() === full);
    if(exist) return { ok:false, msg:"Akun siswa sudah ada." };

    db.siswa.push({ full, namaDepan, namaBelakang });
    _saveAuth(db);
    return { ok:true, msg:"Akun siswa berhasil dibuat." };
  }

  function loginSiswa(namaDepan, namaBelakang){
    const db = _readAuth();
    const full = (namaDepan + " " + namaBelakang).trim().toLowerCase();

    const found = db.siswa.find(s => s.full.toLowerCase() === full);
    if(!found) return { ok:false, msg:"Akun siswa tidak ditemukan." };

    return { ok:true, msg:"Login siswa berhasil." };
  }

  // ===== SETTINGS =====
  const KEY_SET = "ui_skripsi_settings_v1";

  const DEFAULT_SETTINGS = {
    theme: "light", // light | dark
    text: "md",     // sm | md | lg
    music: true,    // bgm on/off
    sfx: true       // click sfx on/off
  };

  function getSettings(){
    const raw = localStorage.getItem(KEY_SET);
    if(!raw) return { ...DEFAULT_SETTINGS };

    try {
      const parsed = JSON.parse(raw);
      // merge biar kalau ada field baru (mis. sfx) tetap aman
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function saveSettings(settings){
    // pastikan semua key ada
    const safe = { ...DEFAULT_SETTINGS, ...settings };
    localStorage.setItem(KEY_SET, JSON.stringify(safe));
  }

  return {
    registerGuru, loginGuru,
    registerSiswa, loginSiswa,
    getSettings, saveSettings
  };
})();
