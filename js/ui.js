const UI = (() => {
  function _getModal(id){
    const el = document.getElementById(id);
    if (!el) return null;
    if (window.bootstrap?.Modal) return bootstrap.Modal.getOrCreateInstance(el);
    return null;
  }

  function openModal(id){
    const modal = _getModal(id);
    if (modal) {
      modal.show();
      return;
    }
    document.getElementById(id)?.setAttribute("aria-hidden", "false");
  }
  function closeModal(id){
    const modal = _getModal(id);
    if (modal) {
      modal.hide();
      return;
    }
    document.getElementById(id)?.setAttribute("aria-hidden", "true");
  }
  function closeAll(){
    document.querySelectorAll(".modal").forEach(m => {
      if (window.bootstrap?.Modal) {
        bootstrap.Modal.getOrCreateInstance(m).hide();
      } else {
        m.setAttribute("aria-hidden","true");
      }
    });
  }

  function toast(msg){
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
  }

  return { openModal, closeModal, closeAll, toast };
})();
