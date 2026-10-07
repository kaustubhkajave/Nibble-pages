(function () {
  "use strict";

  // Collapses the header links behind a menu button on narrow screens. Without this
  // script the CSS falls back to showing every link in a second header row.
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const root = document.documentElement;

  if (!toggle || !nav) {
    root.classList.remove("has-nav-toggle");
    return;
  }

  root.classList.add("has-nav-toggle");

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    root.classList.toggle("nav-open", open);
  }

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  toggle.addEventListener("click", function () {
    setOpen(!isOpen());
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      setOpen(false);
    }
  });

  document.addEventListener("click", function (event) {
    if (isOpen() && !event.target.closest(".site-header")) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia("(min-width: 721px)").addEventListener("change", function (event) {
    if (event.matches) {
      setOpen(false);
    }
  });
})();
