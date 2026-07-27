(function () {
  "use strict";

  function initializePublicationToggles() {
    if (!window.jQuery) return;

    window.jQuery("button.abstract").on("click", function () {
      var panel = window.jQuery(this).parent().parent().find(".abstract.hidden");
      panel.toggleClass("open");
      this.setAttribute("aria-expanded", panel.hasClass("open") ? "true" : "false");
      window.jQuery(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
      window.jQuery(this).siblings("button.bibtex").attr("aria-expanded", "false");
    });

    window.jQuery("button.bibtex").on("click", function () {
      var panel = window.jQuery(this).parent().parent().find(".bibtex.hidden");
      panel.toggleClass("open");
      this.setAttribute("aria-expanded", panel.hasClass("open") ? "true" : "false");
      window.jQuery(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
      window.jQuery(this).siblings("button.abstract").attr("aria-expanded", "false");
    });

    window.jQuery("a").removeClass("waves-effect waves-light");
  }

  function initializeReveals() {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var revealGroups = [
      [".hero-kicker", "up", 0],
      [".hero-intro__content", "left", 70],
      [".hero-portrait__frame", "scale", 140],
      [".featured-section, .card, .impact-card, .case-study-card, .vol-card, .repo-focus-card", "up", 0]
    ];
    var revealItems = [];

    revealGroups.forEach(function (group) {
      document.querySelectorAll(group[0]).forEach(function (element) {
        if (element.dataset.revealInitialized === "true") return;
        element.dataset.revealInitialized = "true";
        element.dataset.reveal = element.dataset.reveal || group[1];
        element.style.setProperty("--reveal-delay", (element.dataset.revealDelay || group[2]) + "ms");
        element.classList.add("reveal-item");
        revealItems.push(element);
      });
    });

    document.querySelectorAll(".metric-card").forEach(function (element, index) {
      if (element.dataset.revealInitialized === "true") return;
      element.dataset.revealInitialized = "true";
      element.dataset.reveal = element.dataset.reveal || "up";
      element.style.setProperty("--reveal-delay", Math.min(index * 70, 280) + "ms");
      element.classList.add("reveal-item");
      revealItems.push(element);
    });

    if (!revealItems.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach(function (element) {
        element.classList.add("is-revealed");
      });
      return;
    }

    document.documentElement.classList.add("motion-ready");
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -8%",
      threshold: 0.08
    });

    revealItems.forEach(function (element) {
      observer.observe(element);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initializePublicationToggles();
    initializeReveals();
  });
}());
