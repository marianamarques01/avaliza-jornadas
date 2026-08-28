(() => {
  "use strict";

  const svg = document.querySelector(".journey-graph-svg");
  if (svg) {
    const nodes = Array.from(svg.querySelectorAll(".graph-node-link"));
    const edges = Array.from(svg.querySelectorAll(".graph-edge"));

    function clear() {
      nodes.forEach((n) => n.classList.remove("is-hot", "is-dim"));
      edges.forEach((e) => e.classList.remove("is-hot", "is-dim"));
    }

    function focus(id) {
      const related = new Set([id]);
      edges.forEach((edge) => {
        const from = edge.dataset.from;
        const to = edge.dataset.to;
        const hit = from === id || to === id;
        edge.classList.toggle("is-hot", hit);
        edge.classList.toggle("is-dim", !hit);
        if (hit) {
          related.add(from);
          related.add(to);
        }
      });
      nodes.forEach((node) => {
        const match = related.has(node.dataset.id);
        node.classList.toggle("is-hot", node.dataset.id === id);
        node.classList.toggle("is-dim", !match);
      });
    }

    nodes.forEach((node) => {
      node.addEventListener("mouseenter", () => focus(node.dataset.id));
      node.addEventListener("mouseleave", clear);
      node.addEventListener("focus", () => focus(node.dataset.id));
      node.addEventListener("blur", clear);
      node.addEventListener("click", (event) => {
        const href = node.getAttribute("href");
        if (!href) return;
        event.preventDefault();
        window.location.assign(href);
      });
    });
  }

  const toc = document.querySelector(".ops-toc");
  if (toc) {
    const links = Array.from(toc.querySelectorAll("a[href^='#']"));
    const sections = links
      .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
      .filter(Boolean);

    function setActive() {
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 120) current = section;
      }
      links.forEach((link) => {
        link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
      });
    }

    document.addEventListener("scroll", setActive, { passive: true });
    setActive();
  }

  document.querySelectorAll(".ops-search-input").forEach((input) => {
    const scope = input.closest("section") || document.body;
    const items = Array.from(scope.querySelectorAll(".ops-exception"));
    const empty = scope.querySelector(".ops-search-empty");
    const openState = new Map(items.map((item) => [item, item.open]));

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      items.forEach((item) => {
        const match = !q || item.textContent.toLowerCase().includes(q);
        item.hidden = !match;
        if (match) {
          visible += 1;
          item.open = q ? true : openState.get(item);
        }
      });
      if (empty) empty.hidden = visible !== 0 || !q;
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    });
  });
})();
