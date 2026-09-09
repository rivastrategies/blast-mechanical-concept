/*
 * Records a confirmed HCP lead only when the approved success redirect includes
 * `?status=confirmed`. A session flag prevents refreshes from duplicating the
 * browser-side event. This route must not be used until HCP confirms success.
 */
(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("status") !== "confirmed") return;

  const storageKey = "blast_hcp_lead_confirmation_recorded";
  try {
    if (window.sessionStorage.getItem(storageKey) === "1") return;
  } catch (_) {
    // Continue without deduplication when session storage is unavailable.
  }

  if (typeof window.BlastTracking?.trackLeadSubmit !== "function") return;

  window.BlastTracking.trackLeadSubmit({
    lead_type: "service_request",
    conversion_stage: "new_lead",
    confirmation_method: "hcp_redirect",
  });

  try {
    window.sessionStorage.setItem(storageKey, "1");
  } catch (_) {
    // The conversion event has already been sent.
  }
})();
