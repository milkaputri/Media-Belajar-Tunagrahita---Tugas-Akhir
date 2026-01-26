const UI = (() => {
  function openModal(id){
    document.getElementById(id).setAttribute("aria-hidden", "false");
  }
  function closeModal(id){
    document.getElementById(id).setAttribute("aria-hidden", "true");
  }
  function closeAll(){
    document.querySelectorAll(".modal").forEach(m => m.setAttribute("aria-hidden","true"));
  }

  function toast(msg){
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
  }

  return { openModal, closeModal, closeAll, toast };
})();
