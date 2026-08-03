const menuButton = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".primary-nav");

if (menuButton && siteMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = siteMenu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "Close Menu" : "Menu";
  });

  siteMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      siteMenu.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
    }
  });
}
