(function () {
  'use strict';

  const carousel = document.querySelector('[data-service-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('[data-service-track]');
  const prev = carousel.querySelector('[data-service-prev]');
  const next = carousel.querySelector('[data-service-next]');

  if (!track || !prev || !next) return;

  function getStep() {
    const card = track.querySelector('.service-case-card');
    if (!card) return 280;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || 18) || 18;
    return card.getBoundingClientRect().width + gap;
  }

  function updateButtons() {
    const maxScroll = track.scrollWidth - track.clientWidth - 4;
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= maxScroll;
    prev.style.opacity = prev.disabled ? '0.45' : '1';
    next.style.opacity = next.disabled ? '0.45' : '1';
  }

  prev.addEventListener('click', function () {
    track.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });

  next.addEventListener('click', function () {
    track.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', function () {
    window.requestAnimationFrame(updateButtons);
  }, { passive: true });

  window.addEventListener('resize', updateButtons);
  updateButtons();
})();
