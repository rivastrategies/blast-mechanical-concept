/*
 * Lead-action and campaign-attribution tracking for GA4.
 *
 * This file intentionally does not count a CTA click as a completed lead.
 * `generate_lead` is reserved for a confirmed form/booking success and can be
 * fired by the existing Housecall Pro success confirmation page via
 * `window.BlastTracking.trackLeadSubmit()`.
 */
(() => {
  const ATTRIBUTION_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "gclid",
    "gbraid",
    "wbraid",
    "msclkid",
    "fbclid",
  ];
  const STORAGE_KEY = "blast_campaign_attribution";

  const readStoredAttribution = () => {
    try {
      return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "{}") || {};
    } catch (_) {
      return {};
    }
  };

  const query = new URLSearchParams(window.location.search);
  const captured = {};
  ATTRIBUTION_KEYS.forEach((key) => {
    const value = query.get(key);
    if (value) captured[key] = value.slice(0, 250);
  });

  const attribution = {
    ...readStoredAttribution(),
    ...captured,
  };

  if (Object.keys(captured).length) {
    attribution.landing_page = window.location.pathname;
    attribution.captured_at = new Date().toISOString();
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    } catch (_) {
      // Tracking remains functional when session storage is unavailable.
    }
  }

  const pageContext = () => ({
    page_path: window.location.pathname,
    service_area: document.body.dataset.serviceArea || "",
    service_line: document.body.dataset.serviceLine || "",
    service_intent: document.body.dataset.serviceIntent || "",
    ...attribution,
  });

  const sendEvent = (name, parameters = {}) => {
    const payload = { ...pageContext(), ...parameters, send_to: "G-3FYJ43LB42" };
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function () { window.dataLayer.push(arguments); };
    }
    window.gtag("event", name, payload);
  };

  window.BlastTracking = {
    getAttribution: () => ({ ...attribution }),
    trackEvent: sendEvent,
    trackLeadSubmit: (details = {}) => {
      sendEvent("generate_lead", {
        lead_source: "housecall_pro",
        ...details,
      });
    },
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const shared = {
      link_url: href,
      link_text: link.textContent.trim().slice(0, 80),
      cta_location: link.dataset.ctaLocation ||
        (link.closest(".site-mobile-actions, .blast-mobile-actions") ? "mobile_bar" :
          link.closest("header, .blast-topbar") ? "header" :
          link.closest("footer") ? "footer" : "body"),
    };

    if (href.startsWith("tel:")) {
      sendEvent("phone_click", shared);
      return;
    }

    if (href.startsWith("mailto:")) {
      sendEvent("email_click", shared);
      return;
    }

    if (link.matches(".btn-call, .btn-primary, .blast-action, .blast-topbar-action, .site-mobile-actions a, .blast-mobile-actions a")) {
      sendEvent("cta_click", {
        ...shared,
        cta_label: shared.link_text.slice(0, 60),
        cta_href: href,
      });
    }
  });
})();
