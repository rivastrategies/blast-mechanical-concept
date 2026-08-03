(() => {
  const cta = document.querySelector('.blast-plan-slidein');
  const closeButton = document.querySelector('.blast-plan-close');
  const trigger = document.querySelector('.blast-about-band');
  const storageKey = 'blastMaintenanceCtaDismissed';

  if (!cta || !closeButton || !trigger) return;

  try {
    if (sessionStorage.getItem(storageKey) === '1') return;
  } catch (_) {
    // Continue without session persistence when browser storage is unavailable.
  }

  const showCta = () => {
    cta.classList.add('is-visible');
    cta.setAttribute('aria-hidden', 'false');
  };

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    window.setTimeout(showCta, 500);
  }, { threshold: 0.12 });

  observer.observe(trigger);

  closeButton.addEventListener('click', () => {
    cta.classList.remove('is-visible');
    cta.setAttribute('aria-hidden', 'true');
    try {
      sessionStorage.setItem(storageKey, '1');
    } catch (_) {
      // Closing still works when browser storage is unavailable.
    }
  });
})();
