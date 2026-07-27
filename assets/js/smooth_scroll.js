(function () {
  "use strict";

  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var precisePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  var lenis = null;

  function shouldEnable() {
    return !reduceMotionQuery.matches && precisePointerQuery.matches && typeof window.Lenis === "function";
  }

  function dispatchScroll(instance) {
    window.dispatchEvent(new CustomEvent("site:scroll", {
      detail: {
        progress: instance.progress,
        velocity: instance.velocity,
        direction: instance.direction,
        scroll: instance.scroll
      }
    }));
  }

  function enable() {
    if (lenis || !shouldEnable()) return;

    lenis = new window.Lenis({
      autoRaf: true,
      anchors: { offset: -76 },
      duration: 0.95,
      smoothWheel: true,
      syncTouch: false,
      stopInertiaOnNavigate: true,
      prevent: function (node) {
        return Boolean(node.closest && node.closest("[data-lenis-prevent], .modal, .table-responsive"));
      }
    });

    document.documentElement.classList.add("lenis-enabled");
    lenis.on("scroll", dispatchScroll);
  }

  function disable() {
    if (!lenis) return;
    lenis.destroy();
    lenis = null;
    document.documentElement.classList.remove("lenis-enabled");
  }

  function refresh() {
    if (shouldEnable()) enable();
    else disable();
  }

  window.siteScroll = {
    scrollTo: function (target, options) {
      if (lenis) {
        lenis.scrollTo(target, options || {});
        return;
      }
      if (target === "top") target = 0;
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: reduceMotionQuery.matches ? "auto" : "smooth" });
      } else if (target && target.scrollIntoView) {
        target.scrollIntoView({ behavior: reduceMotionQuery.matches ? "auto" : "smooth" });
      }
    },
    stop: function () { if (lenis) lenis.stop(); },
    start: function () { if (lenis) lenis.start(); },
    resize: function () { if (lenis) lenis.resize(); },
    isEnabled: function () { return Boolean(lenis); }
  };

  document.addEventListener("visibilitychange", function () {
    if (!lenis) return;
    if (document.hidden) lenis.stop();
    else if (!document.body.classList.contains("modal-open")) lenis.start();
  });
  window.addEventListener("site:modal-open", function () { if (lenis) lenis.stop(); });
  window.addEventListener("site:modal-close", function () { if (lenis) lenis.start(); });
  window.addEventListener("load", enable);
  reduceMotionQuery.addEventListener("change", refresh);
  precisePointerQuery.addEventListener("change", refresh);
}());
