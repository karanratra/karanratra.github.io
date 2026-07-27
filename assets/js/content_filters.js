(() => {
  const normalize = (value) => (value || "").toLowerCase().trim();

  const setActiveChip = (root, selected) => {
    root.querySelectorAll("[data-category]").forEach((chip) => {
      const active = chip.dataset.category === selected;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
  };

  const setupCardFilter = (rootSelector, itemSelector) => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const scope = root.closest("section") || document;
    const items = [...scope.querySelectorAll(itemSelector)];
    const search = root.querySelector("[data-filter-search]");
    const status = root.querySelector("[data-filter-status]");
    const empty = scope.querySelector("[data-filter-empty]");
    let category = "all";

    const update = () => {
      const query = normalize(search?.value);
      let visible = 0;
      items.forEach((item) => {
        const categoryMatch = category === "all" || item.dataset.category === category;
        const searchMatch = !query || normalize(item.textContent).includes(query);
        item.hidden = !(categoryMatch && searchMatch);
        if (!item.hidden) visible += 1;
      });
      if (status) status.textContent = `${visible} ${visible === 1 ? "result" : "results"}`;
      if (empty) empty.hidden = visible !== 0;
    };

    root.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-category]");
      if (!chip) return;
      category = chip.dataset.category;
      setActiveChip(root, category);
      update();
    });
    search?.addEventListener("input", update);
    update();
  };

  const setupPublicationFilter = () => {
    const root = document.querySelector("[data-publication-filter]");
    if (!root) return;

    const sections = [...document.querySelectorAll(".publication-year")];
    const items = sections.flatMap((section) => [...section.querySelectorAll("ol.bibliography > li")]);
    const search = root.querySelector("[data-filter-search]");
    const status = root.querySelector("[data-filter-status]");
    let topic = "all";
    let contentType = "all";
    items.forEach((item) => {
      const metadata = item.querySelector("[data-publication-topic]");
      item.dataset.topic = metadata?.dataset.publicationTopic || "distributed";
      item.dataset.contentType = metadata?.dataset.publicationType || "paper";
    });

    const update = () => {
      const query = normalize(search?.value);
      let visible = 0;
      items.forEach((item) => {
        const topicMatch = topic === "all" || item.dataset.topic === topic;
        const typeMatch = contentType === "all" || item.dataset.contentType === contentType;
        const searchMatch = !query || normalize(item.textContent).includes(query);
        item.hidden = !(topicMatch && typeMatch && searchMatch);
        if (!item.hidden) visible += 1;
      });
      sections.forEach((section) => {
        section.hidden = !section.querySelector("ol.bibliography > li:not([hidden])");
      });
      if (status) status.textContent = `${visible} ${visible === 1 ? "publication" : "publications"}`;
    };

    root.addEventListener("click", (event) => {
      const topicChip = event.target.closest("[data-topic]");
      const typeChip = event.target.closest("[data-content-type]");
      if (!topicChip && !typeChip) return;
      if (topicChip) topic = topicChip.dataset.topic;
      if (typeChip) contentType = typeChip.dataset.contentType;
      const selector = topicChip ? "[data-topic]" : "[data-content-type]";
      const selected = topicChip || typeChip;
      root.querySelectorAll(selector).forEach((button) => {
        const active = button === selected;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      update();
    });
    search?.addEventListener("input", update);
    update();
  };

  const setupResume = () => {
    document.querySelector("[data-print-resume]")?.addEventListener("click", () => window.print());
    const links = [...document.querySelectorAll(".cv-section-nav a")];
    if (!("IntersectionObserver" in window) || !links.length) return;
    const byId = new Map(links.map((link) => [link.hash.slice(1), link]));
    const observer = new IntersectionObserver((entries) => {
      entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
        links.forEach((link) => link.classList.remove("is-active"));
        byId.get(entry.target.id)?.classList.add("is-active");
      });
    }, { rootMargin: "-25% 0px -65%", threshold: 0 });
    document.querySelectorAll(".cv-section-card[id]").forEach((section) => observer.observe(section));
  };

  document.addEventListener("DOMContentLoaded", () => {
    setupPublicationFilter();
    setupCardFilter("[data-repository-filter]", "[data-repository-item]");
    setupCardFilter("[data-volunteering-filter]", "[data-volunteering-item]");
    setupResume();
  });
})();
