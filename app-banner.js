(function () {
  "use strict";

  // "Open in Nibble" bar for phone browsers. Nibble is iPhone-only, so:
  // - iPhone Safari gets Apple's Smart App Banner from the apple-itunes-app meta tag,
  //   which knows whether the app is installed, so this bar stays out of its way.
  // - Other iPhone browsers and in-app browsers try the nibble:// scheme (a recipe page
  //   opens that recipe) and fall back to the download page if nothing takes over.
  //   Universal Links can't help here: iOS ignores them for same-site links.
  // - Android gets the download page directly. Desktop gets nothing.
  // Recipe pages also have an inline button (.recipe-app-cta) that follows the same
  // rules, but shows on every device and can't be dismissed.
  const ua = navigator.userAgent;
  const isIPhone = /iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isIPhoneSafari = isIPhone && /Version\/[\d.]+.*Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua);
  const canTryApp = isIPhone && !isIPhoneSafari;
  const dismissKey = "nibble-app-banner-dismissed";
  const dismissDays = 30;

  const slug = location.pathname.match(/^\/recipes\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/)?.[1];
  const appUrl = slug ? "nibble://recipe-link/" + slug : "nibble://";

  function openApp(event, downloadUrl) {
    event.preventDefault();
    let left = false;
    const markLeft = function () {
      left = true;
    };
    const onVisibility = function () {
      if (document.hidden) left = true;
    };
    // An app switch or the browser's "Open in Nibble?" prompt takes focus away.
    // If none of that happens the app isn't installed, so go to the download page.
    window.addEventListener("blur", markLeft);
    window.addEventListener("pagehide", markLeft);
    document.addEventListener("visibilitychange", onVisibility);
    window.setTimeout(function () {
      window.removeEventListener("blur", markLeft);
      window.removeEventListener("pagehide", markLeft);
      document.removeEventListener("visibilitychange", onVisibility);
      if (!left && !document.hidden) location.href = downloadUrl;
    }, 1600);
    location.href = appUrl;
  }

  // The page links the inline button to the download page; this only adjusts it.
  const cta = document.querySelector(".recipe-app-cta");
  if (cta) {
    const label = cta.querySelector(".recipe-app-cta-label");
    if (canTryApp) {
      label.textContent = "Open in Nibble";
      cta.addEventListener("click", function (event) {
        openApp(event, cta.href);
      });
    } else if (!isIPhone) {
      label.textContent = "Get Nibble for iPhone";
    }
  }

  if (!canTryApp && !isAndroid) {
    return;
  }
  if (document.body.classList.contains("page-download")) {
    return;
  }

  try {
    const dismissedAt = Number(localStorage.getItem(dismissKey));
    if (dismissedAt && Date.now() - dismissedAt < dismissDays * 864e5) {
      return;
    }
  } catch (error) {
    // Storage blocked: show the bar, it just won't remember a dismissal.
  }

  const downloadUrl = "/download/?src=site-banner" + (isAndroid ? "-android" : "");

  const banner = document.createElement("aside");
  banner.className = "app-banner";
  banner.setAttribute("aria-label", "Nibble app");
  banner.innerHTML =
    '<img class="app-banner-icon" src="/assets/icon.png" alt="" width="44" height="44">' +
    '<span class="app-banner-copy"><strong></strong><span></span></span>' +
    '<a class="app-banner-action"></a>' +
    '<button class="app-banner-close" type="button" aria-label="Dismiss">' +
    '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
    "</button>";

  const action = banner.querySelector(".app-banner-action");
  banner.querySelector("strong").textContent = "Nibble";
  banner.querySelector(".app-banner-copy span").textContent = isAndroid
    ? "Recipe app for iPhone"
    : slug
      ? "Cook this in the app"
      : "Snap your fridge, get dinner";
  action.textContent = isAndroid ? "Get" : "Open";
  action.href = downloadUrl;

  if (isIPhone) {
    action.addEventListener("click", function (event) {
      openApp(event, downloadUrl);
    });
  }

  banner.querySelector(".app-banner-close").addEventListener("click", function () {
    try {
      localStorage.setItem(dismissKey, String(Date.now()));
    } catch (error) {
      // Dismissed for this page view only.
    }
    banner.remove();
    document.documentElement.classList.remove("has-app-banner");
  });

  document.body.appendChild(banner);
  document.documentElement.classList.add("has-app-banner");
})();
