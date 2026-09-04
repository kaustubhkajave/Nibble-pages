(function () {
  "use strict";

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  // Motion is progressive enhancement: if the CDN is unavailable, the site stays fully visible.
  if (!gsap || !ScrollTrigger) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const media = gsap.matchMedia();
  const ease = "power3.out";

  function revealEach(selector, options) {
    const settings = options || {};

    gsap.utils.toArray(selector).forEach(function (element) {
      gsap.from(element, {
        x: settings.x || 0,
        y: settings.y === 0 ? 0 : settings.y || 16,
        opacity: 0,
        duration: settings.duration || 0.62,
        ease: ease,
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: element,
          start: settings.start || "top 88%",
          once: true,
        },
      });
    });
  }

  function revealGroup(containerSelector, childSelector, options) {
    const settings = options || {};

    gsap.utils.toArray(containerSelector).forEach(function (container) {
      const children = container.querySelectorAll(childSelector);

      if (!children.length) {
        return;
      }

      gsap.from(children, {
        x: settings.x || 0,
        y: settings.y === 0 ? 0 : settings.y || 16,
        opacity: 0,
        duration: settings.duration || 0.62,
        stagger: settings.stagger || 0.06,
        ease: ease,
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: container,
          start: settings.start || "top 88%",
          once: true,
        },
      });
    });
  }

  media.add("(prefers-reduced-motion: no-preference)", function () {
    const intro = gsap.timeline({ defaults: { ease: ease } });
    const homeHero = document.querySelector(".hero");
    const isWideLayout = window.matchMedia("(min-width: 901px)").matches;
    const hasSideBySidePanels = window.matchMedia("(min-width: 721px)").matches;
    const pageIntro = document.querySelector(
      ".support-hero > div:first-child, .page-hero > div, .recipes-hero > div, .recipe-page-copy",
    );
    const introMedia = document.querySelector(".support-art, .recipe-hero-media");

    intro.from(".site-header", {
      y: -10,
      opacity: 0,
      duration: 0.45,
      clearProps: "transform,opacity",
    });

    if (homeHero) {
      intro
        .from(
          ".hero-copy > *",
          {
            y: 16,
            opacity: 0,
            duration: 0.64,
            stagger: 0.055,
            clearProps: "transform,opacity",
          },
          "-=0.16",
        )
        .from(
          ".hero-stage",
          {
            x: isWideLayout ? 18 : 0,
            y: isWideLayout ? 8 : 14,
            scale: 0.985,
            opacity: 0,
            duration: 0.78,
            clearProps: "transform,opacity",
          },
          "-=0.62",
        )
        .from(
          ".scan-result, .recipe-preview",
          {
            y: 8,
            scale: 0.985,
            opacity: 0,
            duration: 0.42,
            stagger: 0.08,
            clearProps: "transform,opacity",
          },
          "-=0.3",
        );
    } else if (pageIntro) {
      intro.from(
        pageIntro.children,
        {
          y: 14,
          opacity: 0,
          duration: 0.6,
          stagger: 0.06,
          clearProps: "transform,opacity",
        },
        "-=0.16",
      );

      if (introMedia) {
        intro.from(
          introMedia,
          {
            x: hasSideBySidePanels ? 16 : 0,
            y: hasSideBySidePanels ? 8 : 12,
            scale: 0.99,
            opacity: 0,
            duration: 0.72,
            clearProps: "transform,opacity",
          },
          "-=0.52",
        );
      }
    }

    revealGroup(".proof-strip", "li", { y: 10, stagger: 0.07 });
    revealGroup(".section-heading", ".eyebrow, h2", { y: 14, stagger: 0.05 });
    revealGroup(".journey-grid", ".journey-step", { y: 18, stagger: 0.08 });
    revealGroup(".control-copy", ".eyebrow, h2, p:not(.eyebrow), .check-list", {
      y: 14,
      stagger: 0.055,
    });
    revealEach(".suggestion-board", { y: 18 });
    revealGroup(".principle-grid", "article", { y: 14, stagger: 0.07 });
    revealGroup(".plus-copy", ".eyebrow, h2, p:not(.eyebrow), .button", {
      y: 14,
      stagger: 0.055,
    });
    revealEach(
      ".plus-banner > img",
      hasSideBySidePanels ? { x: 14, y: 0 } : { x: 0, y: 10 },
    );

    revealEach(".summary-card, .support-contact", { y: 14 });
    revealEach(".support-faq .faq-section", { y: 14 });
    revealGroup(".recipe-principles", "li", { y: 10, stagger: 0.06 });
    revealEach(".recipe-catalog", { y: 14 });
    revealGroup(".recipe-facts", ".recipe-fact", { y: 10, stagger: 0.05 });
    revealEach(".recipe-ingredients", { y: 14 });
    revealGroup(".recipe-method-list", ".recipe-step", { y: 14, stagger: 0.055 });
    revealEach(".recipe-note, .recipe-cta", { y: 14 });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        ScrollTrigger.refresh();
      });
    }

    window.addEventListener(
      "load",
      function () {
        ScrollTrigger.refresh();
      },
      { once: true },
    );
  });

  media.add(
    "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
    function () {
      const heroImage = document.querySelector(".ingredient-photo > img");

      if (!heroImage) {
        return;
      }

      gsap.fromTo(
        heroImage,
        {
          yPercent: -1.25,
          scale: 1.035,
          transformOrigin: "50% 50%",
        },
        {
          yPercent: 1.25,
          scale: 1.035,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    },
  );
})();
