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

  // Production analytics is managed in GTM, with IDs controlled centrally.
  var config = window.DD_SITE_CONFIG;
  var analytics = config && config.analytics;
  var noindex = document.querySelector('meta[name="robots"][content*="noindex"]');
  if (analytics && analytics.productionHosts.indexOf(location.hostname) !== -1 &&
      !analytics.excludedPathPrefixes.some(function (prefix) { return location.pathname.indexOf(prefix) === 0; }) && !noindex) {
    if (window.DDAnalytics) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    var html = document.documentElement;
    var context = {
      language: (html.lang || "en").split("-")[0],
      pair_id: html.getAttribute("data-pair-id") || "unassigned",
      topic_cluster: html.getAttribute("data-topic-cluster") || "unassigned",
      template_type: html.getAttribute("data-template-type") || "unassigned"
    };
    // Bootstrap context and event defaults before the container starts.
    window.dataLayer.push(Object.assign({ ga4_measurement_id: analytics.ga4MeasurementId }, context));
    window.gtag("set", context);
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    addScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(analytics.gtmContainerId), { async: true });
    window.DDAnalytics = Object.freeze({
      track: function (eventName, parameters) {
        var allowed = {
          select_content: ["content_type", "item_id"], related_content_click: ["target_pair_id", "source_pair_id"],
          checklist_download: ["resource_id"], tool_complete: ["tool_id"], directory_outbound: ["resource_id", "resource_category"],
          affiliate_click: ["product_id", "partner_id"], waitlist_start: ["form_id"], generate_lead: ["form_id", "method", "lead_type"],
          language_switch: ["from_language", "to_language"], form_error: ["form_id", "error_category"],
          outbound_click: ["link_domain"], subscribe_click: [], whatsapp_click: []
        };
        if (!Object.prototype.hasOwnProperty.call(allowed, eventName)) return;
        var safe = Object.assign({}, context);
        allowed[eventName].forEach(function (key) {
          var value = parameters && parameters[key];
          // Only short controlled identifiers; never email, token, free text or full URL.
          if (typeof value === "string" && /^[A-Za-z0-9_.-]{1,80}$/.test(value)) safe[key] = value;
        });
        window.gtag("event", eventName, safe);
      }
    });
    document.addEventListener("click", function (event) {
      var link = event.target && event.target.closest ? event.target.closest("a") : null;
      if (!link) return;
      var url = new URL(link.href, location.href);
      var named = link.getAttribute("data-analytics-event");
      if (named) {
        window.DDAnalytics.track(named, {
          target_pair_id: link.getAttribute("data-target-pair-id"), source_pair_id: context.pair_id,
          item_id: link.getAttribute("data-item-id"), content_type: link.getAttribute("data-content-type"),
          resource_id: link.getAttribute("data-resource-id"), resource_category: link.getAttribute("data-resource-category"),
          product_id: link.getAttribute("data-product-id"), partner_id: link.getAttribute("data-partner-id"),
          from_language: context.language, to_language: link.getAttribute("hreflang")
        });
      } else if (url.hostname === "wa.me" || url.hostname === "api.whatsapp.com") {
        window.DDAnalytics.track("whatsapp_click");
      } else if (url.origin !== location.origin && /^https?:$/.test(url.protocol)) {
        window.DDAnalytics.track("outbound_click", { link_domain: url.hostname });
      } else if (url.pathname === "/subscribe/") {
        window.DDAnalytics.track("subscribe_click");
      }
    });
  }
})();
