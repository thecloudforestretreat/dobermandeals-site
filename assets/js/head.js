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

  // Production analytics is managed in GTM. Do not count previews or staging.
  if (["dobermandeals.com", "www.dobermandeals.com"].indexOf(location.hostname) !== -1 &&
      location.pathname.indexOf("/testing") !== 0) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    addScript("https://www.googletagmanager.com/gtm.js?id=GTM-TSFMW3ZV", { async: true });
    document.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link) return;
      var url = new URL(link.href, location.href);
      if (url.origin !== location.origin && /^https?:$/.test(url.protocol)) {
        window.gtag("event", "outbound_click", { link_domain: url.hostname });
      } else if (url.pathname === "/subscribe/") {
        window.gtag("event", "subscribe_click");
      }
    });
  }
})();
