/* /assets/js/site.js
   The Cloud Forest Retreat (TCFR)
   - Injects /assets/includes/header.html into #siteHeader (once)
   - Injects /assets/includes/footer.html into #siteFooter (optional, once)
   - Reliable mobile hamburger open/close (no "stuck open")
   - Mobile accordion groups
   - Sticky scrolled state (.is-scrolled)
   - GA4 loader: G-D3W4SP5MGX
   ASCII-only.
*/
(function () {
  "use strict";

  var GA_ID = "G-D3W4SP5MGX";
  var HEADER_MOUNT_ID = "siteHeader";
  var FOOTER_MOUNT_ID = "siteFooter";
  var HEADER_URL = "/assets/includes/header.html";
  var FOOTER_URL = "/assets/includes/footer.html";

  /* =========================
     GA4
     ========================= */
  function initGA4() {
    if (window.__TCFR_GA4_LOADED__) return;
    window.__TCFR_GA4_LOADED__ = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };

    var hasGtag = document.querySelector(
      'script[src^="https://www.googletagmanager.com/gtag/js?id="]'
    );

    if (!hasGtag) {
      var s = document.createElement("script");
      s.async = true;
      s.src =
        "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
      document.head.appendChild(s);
    }

    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      anonymize_ip: true,
      send_page_view: true
    });
  }

  /* =========================
     Helpers
     ========================= */
  function qs(root, sel) {
    return root ? root.querySelector(sel) : null;
  }

  function qsa(root, sel) {
    return root ? Array.prototype.slice.call(root.querySelectorAll(sel)) : [];
  }

  function hasHeaderAlready(mount) {
    if (!mount) return false;
    return !!qs(mount, "[data-tcfr-header]");
  }

  function safeText(res) {
    return res && typeof res.text === "function" ? res.text() : Promise.resolve("");
  }

  function fetchHtml(url) {
    // Cache-bust lightly for staging; harmless in prod.
    var u = url + (url.indexOf("?") === -1 ? "?" : "&") + "v=" + Date.now();
    return fetch(u, { cache: "no-store" }).then(function (res) {
      if (!res.ok) return "";
      return safeText(res);
    }).catch(function () {
      return "";
    });
  }

  function injectOnce(mountId, url, markerAttr) {
    var mount = document.getElementById(mountId);
    if (!mount) return Promise.resolve(null);

    if (markerAttr && qs(mount, "[" + markerAttr + "]")) {
      return Promise.resolve(mount);
    }

    // If mount already has content and no marker, do not overwrite.
    if (mount.innerHTML && mount.innerHTML.trim().length > 0 && !markerAttr) {
      return Promise.resolve(mount);
    }

    return fetchHtml(url).then(function (html) {
      if (!html) return mount;
      mount.innerHTML = html;
      return mount;
    });
  }

  /* =========================
     Header behavior (robust)
     ========================= */
  function ensureClosed(header) {
    document.documentElement.classList.remove("tcfr-navOpen");

    var burger = qs(header, ".tcfr-burger");
    var panel = qs(header, ".tcfr-mobilePanel");
    var overlay = qs(header, ".tcfr-mobileOverlay");

    if (burger) burger.setAttribute("aria-expanded", "false");

    // Keep hidden attributes consistent (even if CSS controls display).
    if (panel) panel.hidden = true;
    if (overlay) overlay.hidden = true;

    // Collapse accordions
    qsa(header, ".tcfr-mGroup").forEach(function (btn) {
      btn.setAttribute("aria-expanded", "false");
      var id = btn.getAttribute("aria-controls");
      var sub = id ? document.getElementById(id) : null;
      if (sub) sub.hidden = true;
    });

    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }

  function openMenu(header) {
    if (!header) return;

    var burger = qs(header, ".tcfr-burger");
    var panel = qs(header, ".tcfr-mobilePanel");
    var overlay = qs(header, ".tcfr-mobileOverlay");

    if (!burger || !panel || !overlay) return;

    // Only open on mobile widths
    if (window.innerWidth >= 901) return;

    document.documentElement.classList.add("tcfr-navOpen");
    burger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    overlay.hidden = false;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }

  function closeMenu(header) {
    if (!header) return;
    ensureClosed(header);
  }

  function toggleMenu(header) {
    var isOpen = document.documentElement.classList.contains("tcfr-navOpen");
    if (isOpen) closeMenu(header);
    else openMenu(header);
  }

  function bindHeaderOnce(header) {
    if (!header || header.__tcfrBound) return;
    header.__tcfrBound = true;

    // Force CLOSED at startup to prevent "stuck open" from any prior CSS/HTML state
    ensureClosed(header);

    // Click handling (delegated inside header)
    header.addEventListener("click", function (e) {
      var t = e.target;
      if (!t) return;

      var burger = t.closest ? t.closest(".tcfr-burger") : null;
      if (burger && header.contains(burger)) {
        e.preventDefault();
        toggleMenu(header);
        return;
      }

      var closeBtn = t.closest ? t.closest(".tcfr-close") : null;
      if (closeBtn && header.contains(closeBtn)) {
        e.preventDefault();
        closeMenu(header);
        return;
      }

      var overlay = t.closest ? t.closest(".tcfr-mobileOverlay") : null;
      if (overlay && header.contains(overlay)) {
        e.preventDefault();
        closeMenu(header);
        return;
      }

      var group = t.closest ? t.closest(".tcfr-mGroup") : null;
      if (group && header.contains(group)) {
        e.preventDefault();
        var id = group.getAttribute("aria-controls");
        var sub = id ? document.getElementById(id) : null;
        if (!sub) return;

        var isOpen = group.getAttribute("aria-expanded") === "true";
        group.setAttribute("aria-expanded", isOpen ? "false" : "true");
        sub.hidden = isOpen ? true : false;
        return;
      }

      // Any mobile link click closes
      var link = t.closest ? t.closest(".tcfr-navMobile a[href]") : null;
      if (link && header.contains(link)) {
        closeMenu(header);
      }
    });

    // ESC closes
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu(header);
    });

    // Clicking outside header closes if open
    document.addEventListener("click", function (e) {
      if (!document.documentElement.classList.contains("tcfr-navOpen")) return;
      if (!header.contains(e.target)) closeMenu(header);
    });

    // Resize to desktop closes
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 901) closeMenu(header);
    });

    // Sticky scroll class
    function onScroll() {
      var y = window.scrollY || 0;
      header.classList.toggle("is-scrolled", y > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function tryInitHeaderFromMount() {
    var mount = document.getElementById(HEADER_MOUNT_ID);
    if (!mount) return null;

    // Header markup is <header class="tcfr-header" data-tcfr-header>
    var header = qs(mount, "[data-tcfr-header]") || qs(mount, ".tcfr-header") || qs(mount, "header");
    if (!header) return null;

    bindHeaderOnce(header);
    return header;
  }

  function observeHeaderMount() {
    var mount = document.getElementById(HEADER_MOUNT_ID);
    if (!mount) return;

    // If injected later, init when it appears
    var mo = new MutationObserver(function () {
      var header = tryInitHeaderFromMount();
      if (header) mo.disconnect();
    });

    mo.observe(mount, { childList: true, subtree: true });
  }

  /* =========================
     Boot
     ========================= */
  function boot() {
    initGA4();

    var headerMount = document.getElementById(HEADER_MOUNT_ID);

    var headerPromise = headerMount && hasHeaderAlready(headerMount)
      ? Promise.resolve(headerMount)
      : injectOnce(HEADER_MOUNT_ID, HEADER_URL, "data-tcfr-header");

    var footerPromise = injectOnce(FOOTER_MOUNT_ID, FOOTER_URL, null);

    Promise.all([headerPromise, footerPromise]).then(function () {
      // Init immediately if present, otherwise observe
      if (!tryInitHeaderFromMount()) observeHeaderMount();
    }).catch(function () {
      // Still try init; worst case you get content but no JS
      if (!tryInitHeaderFromMount()) observeHeaderMount();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
