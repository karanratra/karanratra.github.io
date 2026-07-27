(function () {
  "use strict";

  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var lastScrollY = window.scrollY;
  var ticking = false;

  function animateCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    function formatValue(element, value) {
      return (element.dataset.prefix || "") + value.toLocaleString() + (element.dataset.suffix || "");
    }

    function showFinal(element) {
      element.textContent = formatValue(element, Number(element.dataset.count));
    }

    if (reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
      counters.forEach(showFinal);
      return;
    }

    counters.forEach(function (element) {
      element.setAttribute("aria-label", formatValue(element, Number(element.dataset.count)));
      element.textContent = formatValue(element, 0);
      element.classList.add("counter-ready");
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || entry.target.dataset.counted === "true") return;
        var element = entry.target;
        var target = Number(element.dataset.count);
        var index = Array.prototype.indexOf.call(counters, element);
        var delay = 180 + Math.max(0, index) * 140;
        var duration = 1900 + Math.max(0, index) * 120;
        element.dataset.counted = "true";

        window.setTimeout(function () {
          var started = performance.now();
          element.classList.add("is-counting");

          function frame(now) {
            var progress = Math.min(1, (now - started) / duration);
            var eased = 1 - Math.pow(1 - progress, 4);
            var value = Math.round(target * eased);
            element.textContent = formatValue(element, value);
            if (progress < 1) {
              window.requestAnimationFrame(frame);
            } else {
              showFinal(element);
              element.classList.remove("is-counting");
              element.classList.add("counter-complete");
            }
          }

          window.requestAnimationFrame(frame);
        }, delay);

        observer.unobserve(element);
      });
    }, { threshold: 0.55 });

    counters.forEach(function (counter) { observer.observe(counter); });
  }

  function initializeHero() {
    var hero = document.querySelector(".hero-intro");
    if (!hero) return;
    var portrait = hero.querySelector(".hero-portrait__frame");

    hero.querySelectorAll(".hero-proof-strip span").forEach(function (pill, index) {
      pill.style.setProperty("--pill-delay", (180 + index * 65) + "ms");
      pill.classList.add("hero-pill-ready");
    });

    if (reduceMotionQuery.matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    hero.addEventListener("pointermove", function (event) {
      var bounds = hero.getBoundingClientRect();
      var x = (event.clientX - bounds.left) / bounds.width;
      var y = (event.clientY - bounds.top) / bounds.height;
      hero.style.setProperty("--hero-x", (x * 100) + "%");
      hero.style.setProperty("--hero-y", (y * 100) + "%");
      if (portrait) {
        portrait.style.setProperty("--portrait-x", ((x - 0.5) * 7) + "px");
        portrait.style.setProperty("--portrait-y", ((y - 0.5) * 5) + "px");
      }
    }, { passive: true });

    hero.addEventListener("pointerleave", function () {
      hero.style.removeProperty("--hero-x");
      hero.style.removeProperty("--hero-y");
      if (portrait) {
        portrait.style.removeProperty("--portrait-x");
        portrait.style.removeProperty("--portrait-y");
      }
    });
  }

  function initializeNavigation() {
    var navbar = document.getElementById("navbar");
    var nav = document.getElementById("navbarNav");
    if (!navbar || !nav) return;
    var indicator = nav.querySelector(".nav-active-indicator");
    var activeLink = nav.querySelector(".nav-item.active > .nav-link");

    function positionIndicator() {
      if (!indicator || !activeLink || window.innerWidth < 576) return;
      var navBounds = nav.getBoundingClientRect();
      var linkBounds = activeLink.getBoundingClientRect();
      indicator.style.width = linkBounds.width + "px";
      indicator.style.transform = "translate3d(" + (linkBounds.left - navBounds.left) + "px, 0, 0)";
      indicator.classList.add("is-positioned");
    }

    function updateNavbar(scrollY, direction) {
      navbar.classList.toggle("navbar-scrolled", scrollY > 24);
      navbar.classList.toggle("navbar-compact", scrollY > 140 && direction > 0 && !nav.classList.contains("show"));
    }

    function nativeScrollUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var current = window.scrollY;
        updateNavbar(current, current >= lastScrollY ? 1 : -1);
        lastScrollY = current;
        ticking = false;
      });
    }

    window.addEventListener("scroll", nativeScrollUpdate, { passive: true });
    window.addEventListener("site:scroll", function (event) {
      updateNavbar(event.detail.scroll || window.scrollY, event.detail.direction || 1);
    });
    window.addEventListener("resize", positionIndicator, { passive: true });
    window.addEventListener("load", positionIndicator);

    if (window.jQuery) {
      window.jQuery(nav).on("shown.bs.collapse", function () {
        navbar.classList.remove("navbar-compact");
      });
      window.jQuery(nav).on("hidden.bs.collapse", function () {
        var toggle = navbar.querySelector(".navbar-toggler");
        if (toggle && document.activeElement && nav.contains(document.activeElement)) toggle.focus();
      });
    }

    nav.querySelectorAll("a.nav-link:not(.dropdown-toggle)").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth >= 576 || !window.jQuery || !nav.classList.contains("show")) return;
        window.jQuery(nav).collapse("hide");
      });
    });

    updateNavbar(window.scrollY, 1);
    positionIndicator();
  }

  function initializePageTransitions() {
    var transitionLabel = document.querySelector("[data-transition-label]");
    var transitionMessages = [
      [/^\/$/, "Returning to fulfillment architecture"],
      [/^\/publications\/?/, "Opening research and systems thinking"],
      [/^\/repositories\/?/, "Opening platform engineering work"],
      [/^\/impact\/?/, "Opening enterprise-scale impact"],
      [/^\/resume\/?/, "Opening engineering leadership profile"],
      [/^\/volunteering\/?/, "Opening community leadership"],
      [/^\/memberships\/?/, "Opening professional recognition"],
      [/^\/blog\/?/, "Opening architecture insights"],
      [/^\/connect\/?/, "Opening a professional conversation"]
    ];

    function messageFor(pathname) {
      var match = transitionMessages.find(function (entry) { return entry[0].test(pathname); });
      return match ? match[1] : "Opening enterprise platform view";
    }

    window.addEventListener("pageshow", function () {
      document.documentElement.classList.remove("page-is-leaving");
    });

    if (document.documentElement.classList.contains("page-transition-arrival")) {
      try {
        if (transitionLabel) transitionLabel.textContent = window.sessionStorage.getItem("portfolio-transition-label") || messageFor(window.location.pathname);
        window.sessionStorage.removeItem("portfolio-transition");
        window.sessionStorage.removeItem("portfolio-transition-label");
      } catch (error) { /* Storage may be disabled. */ }
      window.setTimeout(function () {
        document.documentElement.classList.remove("page-transition-arrival");
      }, 240);
    }

    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var link = event.target.closest("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download") || link.dataset.noTransition !== undefined) return;
      var url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname || url.hash || reduceMotionQuery.matches) return;

      event.preventDefault();
      var message = messageFor(url.pathname);
      if (transitionLabel) transitionLabel.textContent = message;
      try {
        window.sessionStorage.setItem("portfolio-transition", "1");
        window.sessionStorage.setItem("portfolio-transition-label", message);
      } catch (error) { /* Storage may be disabled. */ }
      document.documentElement.classList.add("page-is-leaving");
      window.setTimeout(function () { window.location.assign(url.href); }, 220);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    animateCounters();
    initializeHero();
    initializeNavigation();
    initializePageTransitions();
    document.documentElement.classList.add("page-is-ready");
  });
}());
