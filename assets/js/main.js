(function () {
  "use strict";

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".nav a").forEach((a) =>
      a.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            e.target.style.setProperty("--reveal-delay", (i % 4) * 80 + "ms");
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Lightbox
  const galleryButtons = document.querySelectorAll(".gallery button[data-src]");
  if (galleryButtons.length) {
    const items = Array.from(galleryButtons).map((b, idx) => ({
      src: b.dataset.src,
      alt: b.dataset.alt || "",
      idx,
    }));

    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Galería ampliada");
    overlay.innerHTML = `
      <img class="lightbox__img" alt="" />
      <button type="button" class="lightbox__btn lightbox__btn--close" aria-label="Cerrar">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>
      </button>
      <button type="button" class="lightbox__btn lightbox__btn--prev" aria-label="Anterior">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M11 3L5 9l6 6" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>
      </button>
      <button type="button" class="lightbox__btn lightbox__btn--next" aria-label="Siguiente">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M7 3l6 6-6 6" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>
      </button>
      <div class="lightbox__counter" aria-live="polite"></div>
    `;
    document.body.appendChild(overlay);

    const imgEl = overlay.querySelector(".lightbox__img");
    const counter = overlay.querySelector(".lightbox__counter");
    const btnClose = overlay.querySelector(".lightbox__btn--close");
    const btnPrev = overlay.querySelector(".lightbox__btn--prev");
    const btnNext = overlay.querySelector(".lightbox__btn--next");

    let current = 0;
    let lastFocus = null;

    function show(idx) {
      current = (idx + items.length) % items.length;
      const it = items[current];
      imgEl.src = it.src;
      imgEl.alt = it.alt;
      counter.textContent = `${current + 1} / ${items.length}`;
    }

    function open(idx) {
      lastFocus = document.activeElement;
      show(idx);
      overlay.classList.add("is-open");
      document.documentElement.style.overflow = "hidden";
      btnClose.focus();
    }

    function close() {
      overlay.classList.remove("is-open");
      document.documentElement.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    galleryButtons.forEach((b, i) =>
      b.addEventListener("click", () => open(i))
    );
    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", () => show(current - 1));
    btnNext.addEventListener("click", () => show(current + 1));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
      else if (e.key === "Tab") {
        const focusables = [btnClose, btnPrev, btnNext];
        const i = focusables.indexOf(document.activeElement);
        e.preventDefault();
        const next = e.shiftKey ? (i - 1 + focusables.length) % focusables.length : (i + 1) % focusables.length;
        focusables[next].focus();
      }
    });
  }
})();
