/* /assets/js/includes.js */
(function () {
  async function inject(id, url) {
    var el = document.getElementById(id);
    if (!el) return;
    try {
      var res = await fetch(url, { cache: "no-store" });
      el.innerHTML = await res.text();
    } catch (e) {}
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    inject("siteHeader", "/assets/includes/header.html").then(function () {
      window.dispatchEvent(new Event("dd:includes:ready"));
    });
  });
})();
