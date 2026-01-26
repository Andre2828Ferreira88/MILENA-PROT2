document.addEventListener("DOMContentLoaded", () => {

  const btn = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const closeBtn = document.querySelector("[data-nav-close]");

  if (!btn || !menu) return;

  const open = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? close() : open();
  });

  if (closeBtn) closeBtn.addEventListener("click", close);

  // clicar fora do painel fecha
  menu.addEventListener("click", (e) => {
    if (e.target === menu) close();
  });

  // clicar em um link fecha
  menu.querySelectorAll("a[href^='#']").forEach(a => {
    a.addEventListener("click", () => close());
  });

  // ESC fecha
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});
