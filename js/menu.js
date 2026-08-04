const menuButton = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".primary-nav");

if (menuButton && siteMenu) {
  const closeMenu = () => {
    siteMenu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menu";
  };

  menuButton.addEventListener("click", () => {
    const isOpen = siteMenu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "Close Menu" : "Menu";
  });

  siteMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const currentPath = window.location.pathname.replace(/index\.html$/, "").replace(/\/$/, "");
  siteMenu.querySelectorAll("a").forEach((link) => {
    const linkPath = new URL(link.href, window.location.href).pathname.replace(/\/$/, "");
    if (linkPath === currentPath) link.setAttribute("aria-current", "page");
  });
}
