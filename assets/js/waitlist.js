(function () {
  var form = document.getElementById("waitlistForm");
  var toast = document.getElementById("waitlistToast");
  if (!form) return;
  form.addEventListener("focusin", function () {
    if (window.DDAnalytics) window.DDAnalytics.track("waitlist_start", { form_id: "waitlistForm" });
  }, { once: true });
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    var button = form.querySelector('button[type="submit"]');
    if (button.disabled) return;
    var fields = new FormData(form);
    button.disabled = true;
    toast.style.display = "block";
    toast.textContent = "Saving your signup…";
    try {
      var response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fields.get("email"), token: fields.get("cf-turnstile-response"), consent: fields.get("consent") === "on" }) });
      var result = await response.json();
      toast.textContent = result.message || "Please try again later.";
      if (response.ok && result.ok) {
        form.reset();
        if (window.DDAnalytics) window.DDAnalytics.track("generate_lead", { form_id: "waitlistForm", method: "waitlist", lead_type: "waitlist" });
      } else if (window.DDAnalytics) {
        window.DDAnalytics.track("form_error", { form_id: "waitlistForm", error_category: "server_rejected" });
      }
    } catch {
      toast.textContent = "We could not save your signup. Please try again later.";
      if (window.DDAnalytics) window.DDAnalytics.track("form_error", { form_id: "waitlistForm", error_category: "network_error" });
    }
    finally {
      button.disabled = false;
      if (window.turnstile) window.turnstile.reset();
    }
  });
})();
