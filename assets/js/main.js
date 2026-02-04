document.addEventListener("DOMContentLoaded", () => {

  const btn = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const closeBtn = document.querySelector("[data-nav-close]");

  if (!btn || !menu) return;

  const open = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? close() : open();
  });

  if (closeBtn) closeBtn.addEventListener("click", close);

  // clicar fora do painel fecha
  menu.addEventListener("click", (e) => {
    if (e.target === menu) close();
  });

  // clicar em um link fecha
  menu.querySelectorAll("a[href^='#']").forEach(a => {
    a.addEventListener("click", () => close());
  });

  // ESC fecha
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("[data-pain-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-pain-track]");
  const slides = Array.from(slider.querySelectorAll("[data-pain-slide]"));
  if (!track || slides.length === 0) return;

  const setActive = () => {
    const center = track.scrollLeft + track.clientWidth / 2;

    let best = slides[0];
    let bestDist = Infinity;

    for (const s of slides) {
      const sCenter = s.offsetLeft + s.clientWidth / 2;
      const dist = Math.abs(center - sCenter);
      if (dist < bestDist) {
        bestDist = dist;
        best = s;
      }
    }

    slides.forEach(s => s.classList.toggle("is-active", s === best));
  };

  // inicial
  setActive();

  // atualiza durante scroll (com debounce leve)
  let t = null;
  track.addEventListener("scroll", () => {
    if (t) cancelAnimationFrame(t);
    t = requestAnimationFrame(setActive);
  }, { passive: true });

  window.addEventListener("resize", setActive);
});
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("[data-pain-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-pain-track]");
  const slides = Array.from(slider.querySelectorAll("[data-pain-slide]"));
  const prevBtn = slider.querySelector("[data-pain-prev]");
  const nextBtn = slider.querySelector("[data-pain-next]");
  if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

  const getActiveIndex = () => {
    const center = track.scrollLeft + track.clientWidth / 2;
    let bestI = 0;
    let bestDist = Infinity;

    slides.forEach((s, idx) => {
      const sCenter = s.offsetLeft + s.clientWidth / 2;
      const dist = Math.abs(center - sCenter);
      if (dist < bestDist) { bestDist = dist; bestI = idx; }
    });

    return bestI;
  };

  const go = (idx) => {
    const el = slides[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  prevBtn.addEventListener("click", () => {
    const i = getActiveIndex();
    const prev = (i - 1 + slides.length) % slides.length; // loop infinito
    go(prev);
  });

  nextBtn.addEventListener("click", () => {
    const i = getActiveIndex();
    const next = (i + 1) % slides.length; // loop infinito
    go(next);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("[data-steps-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-steps-track]");
  const cards = Array.from(track?.querySelectorAll(".step") || []);
  const prev = slider.querySelector("[data-steps-prev]");
  const next = slider.querySelector("[data-steps-next]");
  if (!track || cards.length === 0 || !prev || !next) return;

  const getActiveIndex = () => {
    const left = track.scrollLeft;
    let bestI = 0, bestDist = Infinity;
    cards.forEach((c, i) => {
      const dist = Math.abs(c.offsetLeft - left);
      if (dist < bestDist) { bestDist = dist; bestI = i; }
    });
    return bestI;
  };

  const go = (idx) => {
    const el = cards[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  prev.addEventListener("click", () => {
    const i = getActiveIndex();
    go(Math.max(0, i - 1));
  });

  next.addEventListener("click", () => {
    const i = getActiveIndex();
    go(Math.min(cards.length - 1, i + 1));
  });
});
// =========================
// PRELOADER (premium)
// =========================
(() => {
  const pre = document.getElementById("preloader");
  const fill = document.getElementById("preloaderFill");
  if (!pre || !fill) return;

  // trava scroll
  document.documentElement.classList.add("is-loading");
  document.body.classList.add("is-loading");

  let p = 0;
  let raf = null;

  // progresso fake suave (vai até 92% antes do load real)
  const tick = () => {
    const target = 100;
    const speed = 0.10; // ajuste (0.6 mais lento / 1.0 mais rápido)
    if (p < target) p = Math.min(target, p + speed);
    fill.style.width = `${p.toFixed(1)}%`;
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  const finish = () => {
    if (raf) cancelAnimationFrame(raf);

    // completa
    p = 100;
    fill.style.width = "100%";
    fill.parentElement?.setAttribute("aria-valuenow", "100");

    // pequena pausa pra ficar “premium”
    setTimeout(() => {
      pre.classList.add("is-hidden");
      document.documentElement.classList.remove("is-loading");
      document.body.classList.remove("is-loading");
    }, 350);
  };

  // some quando tudo estiver carregado (imagens, etc)
  window.addEventListener("load", () => {
    // garante que não some “instantâneo” (fica mais profissional)
    setTimeout(finish, 1200);
  });

  // fallback: se o load demorar muito, remove em no máximo 4s
  setTimeout(() => {
    if (!pre.classList.contains("is-hidden")) finish();
  }, 4000);
})();
// ===============================
// INCLUDED "Netflix" auto-scroll
// (pausa só segurando)
// ===============================
(function initIncludedCatalog(){
  const slider = document.querySelector("[data-included-slider]");
  const track  = document.querySelector("[data-included-track]");
  if(!slider || !track) return;

  // duplica os cards para loop infinito
  const originals = Array.from(track.children);
  if(originals.length < 2) return;

  if(!track.dataset.cloned){
    originals.forEach(node => track.appendChild(node.cloneNode(true)));
    track.dataset.cloned = "1";
  }

  let x = 0;
  let paused = false;
  let speed = 0.55; // diminui: 0.25 = bem lento
  let rafId = null;

  const getHalfWidth = () => {
    let w = 0;
    const children = Array.from(track.children);
    const half = Math.floor(children.length / 2);

    for(let i=0;i<half;i++){
      const el = children[i];
      const rect = el.getBoundingClientRect();
      w += rect.width;
    }

    const gap = parseFloat(getComputedStyle(track).gap || 0);
    w += gap * (half - 1);
    return w;
  };

  let halfWidth = 0;

  const recalc = () => {
    // espera layout estabilizar
    halfWidth = getHalfWidth();
  };

  window.addEventListener("resize", recalc);
  setTimeout(recalc, 50);

  function tick(){
    if(!paused){
      x -= speed;
      if(Math.abs(x) >= halfWidth) x = 0;
      track.style.transform = `translate3d(${x}px,0,0)`;
    }
    rafId = requestAnimationFrame(tick);
  }

  const pause = () => { paused = true; track.classList.add("is-paused"); };
  const resume = () => { paused = false; track.classList.remove("is-paused"); };

  // "segurar" no PC e no mobile (pointer events)
  slider.addEventListener("pointerdown", pause);
  window.addEventListener("pointerup", resume);
  window.addEventListener("pointercancel", resume);

  // start
  cancelAnimationFrame(rafId);
  tick();
})();
