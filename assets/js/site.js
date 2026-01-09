/* /assets/js/site.js */
(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function bindHeader() {
    var header = qs("[data-dd-header]");
    if (!header) return;

    var burger = qs("[data-dd-burger]", header);
    var mobile = qs("[data-dd-mobile]", header);
    if (!burger || !mobile) return;

    function closeMenu() {
      burger.setAttribute("aria-expanded", "false");
      mobile.hidden = true;
    }

    function toggleMenu() {
      var expanded = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", expanded ? "false" : "true");
      mobile.hidden = expanded ? true : false;
    }

    burger.addEventListener("click", toggleMenu);

    header.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (a && !mobile.hidden) closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia && window.matchMedia("(min-width: 901px)").matches) {
        closeMenu();
      }
    });
  }

  function waitlistSubmit(ev) {
    ev.preventDefault();
    var toast = document.getElementById("waitlistToast");
    if (!toast) return false;

    toast.style.display = "block";
    toast.textContent = "Thanks. You are on the list.";
    clearTimeout(window.__ddToastT);
    window.__ddToastT = setTimeout(function () {
      toast.style.display = "none";
      toast.textContent = "";
    }, 2200);

    try {
      ev.target.reset();
    } catch (e) {}
    return false;
  }

  window.DD = window.DD || {};
  window.DD.waitlistSubmit = waitlistSubmit;

  onReady(function () {
    bindHeader();
    window.addEventListener("dd:includes:ready", bindHeader);
  });
})();
