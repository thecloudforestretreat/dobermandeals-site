/* /assets/js/head.js */
(function () {
  var HEAD = document.head;

  function addLink(rel, href, extra) {
    if (!href) return;
    var exists = HEAD.querySelector('link[rel="' + rel + '"][href="' + href + '"]');
    if (exists) return;

    var l = document.createElement("link");
    l.rel = rel;
    l.href = href;

    if (extra) {
      Object.keys(extra).forEach(function (k) {
        l.setAttribute(k, extra[k]);
      });
    }
    HEAD.appendChild(l);
  }

  function addScript(src, attrs) {
    if (!src) return null;
    var exists = HEAD.querySelector('script[src="' + src + '"]');
    if (exists) return exists;

    var s = document.createElement("script");
    s.src = src;

    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] === true) s.setAttribute(k, k);
        else if (attrs[k] !== false && attrs[k] != null) s.setAttribute(k, String(attrs[k]));
      });
    }

    HEAD.appendChild(s);
    return s;
  }

  // Fonts
  addLink("preconnect", "https://fonts.googleapis.com");
  addLink("preconnect", "https://fonts.gstatic.com", { crossorigin: "" });

  addLink(
    "stylesheet",
    "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Open+Sans:wght@400;600;700;800&family=Roboto:wght@400;500;700&display=swap"
  );

  // GA4
  (function injectGA4() {
    var MEASUREMENT_ID = "G-FGX9MBEM2R";

    try {
      if (typeof window.gtag === "function") return;

      var existing = HEAD.querySelector(
        'script[src^="https://www.googletagmanager.com/gtag/js?id="]'
      );
      if (existing) return;

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };

      addScript(
        "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID),
        { async: true }
      );

      window.gtag("js", new Date());
      window.gtag("config", MEASUREMENT_ID, { anonymize_ip: true });
    } catch (e) {}
  })();
})();
