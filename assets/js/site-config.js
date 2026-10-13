/* Public configuration only. Never put API tokens or Turnstile secrets here.
   Future WhatsApp widget reads DD_SITE_CONFIG.contact.whatsapp. */
(function () {
  "use strict";
  var config = {
    version: 1,
    site: { name: "Doberman Deals", origin: "https://dobermandeals.com", defaultLanguage: "en", plannedLanguages: ["en", "es"] },
    analytics: {
      gtmContainerId: "GTM-TSFMW3ZV",
      ga4MeasurementId: "G-FGX9MBEM2R",
      productionHosts: ["dobermandeals.com", "www.dobermandeals.com"],
      excludedPathPrefixes: ["/testing"],
      cloudflareWebAnalytics: "managed_by_cloudflare_dashboard"
    },
    internalLinks: { minimumContextualInlinks: 6, minimumContextualOutlinks: 6, countLanguageSwitcher: false, countGlobalNavigation: false },
    contact: {
      email: "dobermandeals3@gmail.com",
      formEndpoint: "/api/contact",
      turnstileSiteKey: "0x4AAAAAAFUoea6FuYPHMyRz",
      paths: { en: "/about/contact/", es: "/es/nosotros/contacto/" },
      whatsapp: {
        enabled: false,
        phoneE164: "",
        messages: { en: "Hi Doberman Deals! I have a question.", es: "¡Hola Doberman Deals! Tengo una pregunta." },
        labels: { en: "Chat on WhatsApp", es: "Escríbenos por WhatsApp" }
      }
    }
  };
  function freeze(value) {
    Object.keys(value).forEach(function (key) { if (value[key] && typeof value[key] === "object") freeze(value[key]); });
    return Object.freeze(value);
  }
  window.DD_SITE_CONFIG = freeze(config);
  window.DDContact = Object.freeze({
    whatsappUrl: function (language) {
      var wa = config.contact.whatsapp;
      if (!wa.enabled || !/^\+[1-9]\d{7,14}$/.test(wa.phoneE164)) return null;
      var locale = language === "es" ? "es" : "en";
      return "https://wa.me/" + wa.phoneE164.slice(1) + "?text=" + encodeURIComponent(wa.messages[locale]);
    }
  });
})();
