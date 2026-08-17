/*
 * Conversion event tracking for GA4.
 *
 * Fires named events for the actions that actually indicate a lead:
 * phone clicks, email clicks, and clicks on primary CTA buttons
 * (Call / Request Service / Quote / Schedule). Requires gtag.js to
 * already be loaded on the page (it is, sitewide, as of this build).
 *
 * Event names:
 *   phone_click  -- any tel: link
 *   email_click  -- any mailto: link
 *   cta_click    -- any .btn-call or .btn-primary button, labeled by
 *                    its visible text so Call/Quote/Schedule are
 *                    distinguishable in GA4 reporting
 */
(() => {
  if (typeof window.gtag !== "function") return;

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";

    if (href.startsWith("tel:")) {
      gtag("event", "phone_click", {
        link_url: href,
        page_path: window.location.pathname,
      });
      return;
    }

    if (href.startsWith("mailto:")) {
      gtag("event", "email_click", {
        link_url: href,
        page_path: window.location.pathname,
      });
      return;
    }

    if (link.classList.contains("btn-call") || link.classList.contains("btn-primary")) {
      gtag("event", "cta_click", {
        cta_label: link.textContent.trim().slice(0, 60),
        cta_href: href,
        page_path: window.location.pathname,
      });
    }
  });
})();
