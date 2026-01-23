document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("[data-steps-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-steps-track]");
  if (!track) return;

  const INTERVAL = 7000;

  let timer = null;
  let i = 0;
  let originalLen = 0;
  let slides = [];

  const setSmooth = (on) => {
    track.style.scrollBehavior = on ? "smooth" : "auto";
  };

  const goTo = (index, smooth = true) => {
    const el = slides[index];
    if (!el) return;
    setSmooth(smooth);
    track.scrollTo({ left: el.offsetLeft, behavior: smooth ? "smooth" : "auto" });
  };

  const cleanupClones = () => {
    track.querySelectorAll("[data-clone='true']").forEach(n => n.remove());
  };

  const getVisibleCount = (baseEl) => {
    if (!baseEl) return 1;

    const cs = getComputedStyle(track);
    const gap = parseFloat(cs.gap || cs.columnGap || "0") || 0;

    const slideW = baseEl.getBoundingClientRect().width;
    const viewportW = track.clientWidth;

    // Quantos cards cabem no viewport (considerando gap)
    const unit = slideW + gap;
    const count = Math.max(1, Math.round((viewportW + gap) / unit));

    return count;
  };

  const build = () => {
    cleanupClones();

    const originals = Array.from(track.children).filter(el => el.getAttribute("data-clone") !== "true");
    originalLen = originals.length;

    if (originalLen <= 1) return;

    const visibleCount = Math.min(originalLen, getVisibleCount(originals[0]));

    // Clona os primeiros N (N = quantidade visível) para não gerar “buraco”
    for (let k = 0; k < visibleCount; k++) {
      const clone = originals[k].cloneNode(true);
      clone.setAttribute("data-clone", "true");
      track.appendChild(clone);
    }

    slides = Array.from(track.children);
    i = 0;
    goTo(0, false);
  };

  const start = () => {
    if (timer) return;
    timer = setInterval(() => {
      i += 1;
      goTo(i, true);
    }, INTERVAL);
  };

  const stop = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  // Reset invisível quando chegar no "início clonado"
  let scrollEndTimer = null;
  track.addEventListener("scroll", () => {
    if (scrollEndTimer) clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      // Quando i chega no começo dos clones, volta pro 0 real sem animação
      if (i >= originalLen) {
        i = 0;
        goTo(0, false);
      }
    }, 120);
  }, { passive: true });

  window.addEventListener("resize", () => {
    stop();
    build();
    start();
  });

  build();
  start();
});
