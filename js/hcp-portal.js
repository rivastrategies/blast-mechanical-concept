/*
 * Housecall Pro customer portal integration.
 *
 * Single source of truth for the HCP destination URL. To change where
 * "Customer Portal" links point (e.g. once the live HCP customer journey
 * has been verified), update HCP_PORTAL_URL below -- nothing else needs
 * to change across the site.
 *
 * Any element with a `data-hcp-portal` attribute is treated as an HCP
 * portal link: its href is set here, it opens safely in a new tab, and
 * (if GTM/GA4's dataLayer is present) a tracking event fires on click.
 * The value of the attribute is used as the tracking "location" label,
 * e.g. data-hcp-portal="footer".
 */
(() => {
  const HCP_PORTAL_URL = "https://client.housecallpro.com/customer_portal/request-link?token=b6381014245d408988e971f5c1bcef45";

  const links = document.querySelectorAll("[data-hcp-portal]");
  if (!links.length) return;

  links.forEach((link) => {
    link.href = HCP_PORTAL_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    link.addEventListener("click", () => {
      // Prepared for GTM/GA4 once implemented; no-ops safely until then.
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: "hcp_portal_click",
          link_location: link.getAttribute("data-hcp-portal") || "unspecified",
        });
      }
    });
  });
})();
