/*
 * Lead-action and campaign-attribution tracking for GA4.
 *
 * This file intentionally does not count a CTA click as a completed lead.
 * `generate_lead` is reserved for a confirmed form/booking success and can be
 * fired by the existing Housecall Pro success confirmation page via
 * `window.BlastTracking.trackLeadSubmit()`.
 */
(() => {
  // Website call conversions use a Google forwarding number. Google routes that
  // number to Blast's existing Housecall Pro tracking line (979-310-6577).
  // Keep both visible numbers and click-to-call links in sync; no click itself
  // is counted as a qualified call. Google applies the 60-second call threshold.
  if (["blast-mech.com", "www.blast-mech.com"].includes(window.location.hostname)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("config", "AW-18440794915");
    window.gtag("config", "AW-18440794915/yBEUCMqi2q8dEKPmoNlE", {
      phone_conversion_number: "281-506-4822",
      phone_conversion_callback: (formattedNumber, mobileNumber) => {
        const digits = String(mobileNumber || "").replace(/\D/g, "");
        if (!formattedNumber || !/^1?\d{10}$/.test(digits)) return;
        const dialNumber = "+" + (digits.length === 10 ? "1" + digits : digits);
        document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
          const current = link.getAttribute("href").replace(/\D/g, "");
          if (current !== "12815064822" && current !== "2815064822") return;
          link.setAttribute("href", "tel:" + dialNumber);
          if (link.hasAttribute("aria-label")) {
            link.setAttribute("aria-label", link.getAttribute("aria-label").replace(/281[\s.-]*506[\s.-]*4822/g, formattedNumber));
          }
        });
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let textNode;
        while ((textNode = walker.nextNode())) {
          if (textNode.parentElement.closest("script, style, noscript, textarea")) continue;
          textNode.nodeValue = textNode.nodeValue.replace(/(?:\(281\)|281)[\s.-]*506[\s.-]*4822/g, formattedNumber);
        }
      },
    });
  }

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
