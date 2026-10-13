(function () {
  var form = document.getElementById("waitlistForm");
  var toast = document.getElementById("waitlistToast");
  if (!form) return;
  var es = document.documentElement.lang === "es";
  var messages = {"Please submit from our website.":"Envía el formulario desde nuestro sitio.","Signups are temporarily unavailable. Please try again later.":"Las inscripciones no están disponibles temporalmente. Inténtalo más tarde.","Submission too large.":"El envío es demasiado grande.","Invalid submission.":"El envío no es válido.","Enter a valid email and agree to launch updates.":"Introduce un correo válido y acepta las novedades.","Complete the security check.":"Completa la comprobación de seguridad.","Security verification is unavailable. Please try again.":"La comprobación de seguridad no está disponible. Inténtalo de nuevo.","Security check expired. Please try again.":"La comprobación de seguridad ha caducado. Inténtalo de nuevo.","Thanks. You are on the list.":"Gracias. Tu inscripción está guardada.","We could not save your signup. Please try again later.":"No hemos podido guardar tu inscripción. Inténtalo más tarde."};
  form.addEventListener("focusin", function () {
    if (window.DDAnalytics) window.DDAnalytics.track("waitlist_start", { form_id: "waitlistForm" });
  }, { once: true });
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    var button = form.querySelector('button[type="submit"]');
    if (button.disabled) return;
    var fields = new FormData(form);
    button.disabled = true;
    form.setAttribute("aria-busy", "true");
    toast.style.display = "block";
    toast.textContent = es ? "Guardando tu inscripción…" : "Saving your signup…";
    try {
      var response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fields.get("email"), token: fields.get("cf-turnstile-response"), consent: fields.get("consent") === "on", language: es ? "es" : "en" }) });
      var result = await response.json();
      toast.textContent = es ? (messages[result.message] || "Inténtalo más tarde.") : (result.message || "Please try again later.");
      if (response.ok && result.ok) {
        form.reset();
        if (window.DDAnalytics) window.DDAnalytics.track("generate_lead", { form_id: "waitlistForm", method: "waitlist", lead_type: "waitlist" });
      } else if (window.DDAnalytics) {
        window.DDAnalytics.track("form_error", { form_id: "waitlistForm", error_category: "server_rejected" });
      }
    } catch {
      toast.textContent = es ? "No hemos podido guardar tu inscripción. Inténtalo más tarde." : "We could not save your signup. Please try again later.";
      if (window.DDAnalytics) window.DDAnalytics.track("form_error", { form_id: "waitlistForm", error_category: "network_error" });
    }
    finally {
      button.disabled = false;
      form.removeAttribute("aria-busy");
      if (window.turnstile) window.turnstile.reset();
    }
  });
})();
