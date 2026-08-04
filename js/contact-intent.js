(() => {
  const serviceSelect = document.querySelector("#service-type");
  if (!serviceSelect) return;

  const intent = new URLSearchParams(window.location.search).get("intent");
  const serviceByIntent = {
    quote: "AC Replacement",
    schedule: "Maintenance Membership",
    iaq: "Indoor Air Quality",
  };

  if (serviceByIntent[intent]) serviceSelect.value = serviceByIntent[intent];
})();
