document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("[data-steps-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-steps-track]");
  if (!track) return;

  let originals = Array.from(track.children);
  if (originals.length <= 1) return;

  // ====== helpers ======
  const isMobileSnap = () => window.matchMedia("(max-width: 600px)").matches;

  const setSnap = (on) => {
    // no seu CSS, no mobile é "x mandatory"
    track.style.scrollSnapType = on ? (isMobileSnap() ? "x mandatory" : "none") : "none";
  };

  const animateScrollTo = (left, duration = 650) => {
    const start = track.scrollLeft;
    const delta = left - start;
    const t0 = performance.now();

    // Desliga snap durante a animação (evita “pulo”)
    setSnap(false);

    const easeInOut = (t) => (t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2);

    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      track.scrollLeft = start + delta * easeInOut(p);

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        // Religa snap conforme breakpoint
        setSnap(true);
      }
    };

    requestAnimationFrame(tick);
  };

  // ====== loop “infinito” sem buraco ======
  // clona apenas o 1º (mantém seu comportamento atual)
  const firstClone = originals[0].cloneNode(true);
  firstClone.setAttribute("data-clone", "true");
  track.appendChild(firstClone);

  let slides = Array.from(track.children);
  const lastIndex = slides.length - 1; // clone

  let i = 0;
  const INTERVAL = 7000;

  const goTo = (index, smooth = true) => {
    const el = slides[index];
    if (!el) return;
    const targetLeft = el.offsetLeft;
    if (smooth) animateScrollTo(targetLeft, 650);
    else {
      setSnap(false);
      track.scrollLeft = targetLeft;
      setSnap(true);
    }
  };

  // começa no 1º
  goTo(0, false);

  let timer = null;
  const start = () => {
    if (timer) return;
    timer = setInterval(() => {
      i += 1;
      goTo(i, true);
    }, INTERVAL);
  };

  // quando chegar no clone, volta pro início “invisível”
  let scrollEndTimer = null;
  track.addEventListener("scroll", () => {
    if (scrollEndTimer) clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      if (i >= lastIndex) {
        i = 0;
        goTo(0, false); // reset instantâneo (fora de tela)
      }
    }, 220);
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (timer) { clearInterval(timer); timer = null; }
    i = 0;
    goTo(0, false);
    start();
  });

  start();
});
