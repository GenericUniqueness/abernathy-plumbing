document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.querySelector(".site-nav");
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const revealEls = Array.from(document.querySelectorAll(".reveal-on-scroll"));
  const yearEls = Array.from(document.querySelectorAll("[data-year]"));
  const hero = document.querySelector(".hero-water");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuPanel = document.querySelector("[data-mobile-menu]");
  const menuCloseTargets = Array.from(document.querySelectorAll("[data-menu-close]"));

  // Current year
  const year = new Date().getFullYear();
  yearEls.forEach(el => { el.textContent = String(year); });

  // Scroll state for nav
  const updateNav = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 60);
  };
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  // Mobile menu
  if (menuToggle && menuPanel) {
    const setOpen = (open) => {
      menuToggle.setAttribute("aria-expanded", String(open));
      menuPanel.hidden = !open;
      menuPanel.classList.toggle("hidden", !open);
      document.body.style.overflow = open ? "hidden" : "";
    };

    setOpen(false);

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });

    menuCloseTargets.forEach(node => {
      node.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("click", (e) => {
      if (!menuPanel.hidden && !menuPanel.contains(e.target) && !menuToggle.contains(e.target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Active nav link
  if ("IntersectionObserver" in window && navLinks.length && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.remove("is-active"));
        const active = document.querySelector(`[data-nav="${entry.target.id}"]`);
        if (active) active.classList.add("is-active");
      });
    }, { threshold: 0.38, rootMargin: "-12% 0px -55% 0px" });

    sections.forEach(sec => navObserver.observe(sec));
  }

  // Reveal on scroll
  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  // Hero ambient drift
  if (hero && !reduceMotion) {
    let t = 0;
    const tick = () => {
      t += 0.004;
      const x = Math.sin(t) * 10;
      const y = Math.cos(t * 0.9) * 8;
      hero.style.setProperty("--hero-shift-x", `${x}px`);
      hero.style.setProperty("--hero-shift-y", `${y}px`);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Respect reduced motion
  if (reduceMotion) {
    document.documentElement.style.scrollBehavior = "auto";
    revealEls.forEach(el => el.classList.add("is-visible"));
    if (hero) {
      hero.style.setProperty("--hero-shift-x", "0px");
      hero.style.setProperty("--hero-shift-y", "0px");
    }
  }
});