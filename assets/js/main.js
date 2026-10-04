(function () {
  "use strict";

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    const nav = document.getElementById(toggle.getAttribute("aria-controls"));
    const mobile = window.matchMedia("(max-width: 719px)");

    function setMenu(open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      nav.inert = mobile.matches && !open;
    }

    toggle.addEventListener("click", () =>
      setMenu(toggle.getAttribute("aria-expanded") !== "true")
    );
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setMenu(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
    mobile.addEventListener("change", () => setMenu(false));
    document.documentElement.classList.add("nav-ready");
    setMenu(false);
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            e.target.style.setProperty("--reveal-delay", (i % 4) * 80 + "ms");
            e.target.classList.remove("is-pending");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );
    revealEls.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("is-pending");
        io.observe(el);
      }
    });
  }

  // Lightbox
  const galleryButtons = document.querySelectorAll(".gallery button[data-src]");
  if (galleryButtons.length) {
    const items = Array.from(galleryButtons).map((b) => {
      const image = b.querySelector("img");
      const crop = b.querySelector(".visual-crop");
      return {
        src: b.dataset.src,
        alt: b.dataset.alt || "",
        width: crop ? Number(crop.style.getPropertyValue("--crop-width")) : Number(image.getAttribute("width")),
        height: crop ? Number(crop.style.getPropertyValue("--crop-height")) : Number(image.getAttribute("height")),
        cropStyle: crop ? crop.getAttribute("style") : "",
      };
    });

    const overlay = document.createElement("dialog");
    overlay.className = "lightbox";
    overlay.setAttribute("aria-label", "Galería ampliada");
    overlay.innerHTML = `
      <div class="lightbox__media"><img class="lightbox__img" alt="" /></div>
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
    const media = overlay.querySelector(".lightbox__media");
    const counter = overlay.querySelector(".lightbox__counter");
    const btnClose = overlay.querySelector(".lightbox__btn--close");
    const btnPrev = overlay.querySelector(".lightbox__btn--prev");
    const btnNext = overlay.querySelector(".lightbox__btn--next");
    btnPrev.hidden = btnNext.hidden = items.length === 1;
    imgEl.addEventListener("load", () => { imgEl.style.visibility = ""; });

    let current = 0;
    let lastFocus = null;

    function show(idx) {
      current = (idx + items.length) % items.length;
      const it = items[current];
      if (imgEl.getAttribute("src") !== it.src) imgEl.style.visibility = "hidden";
      media.classList.toggle("visual-crop", Boolean(it.cropStyle));
      media.style.cssText = it.cropStyle;
      media.style.setProperty("--visual-ratio", it.width / it.height);
      imgEl.src = it.src;
      imgEl.alt = it.alt;
      counter.textContent = `${current + 1} / ${items.length}`;
    }

    function open(idx) {
      lastFocus = document.activeElement;
      show(idx);
      overlay.showModal();
      document.documentElement.style.overflow = "hidden";
      btnClose.focus();
    }

    function close() {
      overlay.close();
    }

    overlay.addEventListener("close", () => {
      document.documentElement.style.overflow = "";
      lastFocus.focus();
    });

    galleryButtons.forEach((b, i) =>
      b.addEventListener("click", () => open(i))
    );
    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", () => show(current - 1));
    btnNext.addEventListener("click", () => show(current + 1));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    overlay.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        show(current + (e.key === "ArrowLeft" ? -1 : 1));
      }
    });
  }
})();
