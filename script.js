const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const year = document.getElementById('year');

if (year) year.textContent = new Date().getFullYear();

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 18);
  });
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

const counters = document.querySelectorAll('[data-count]');
const statsGrid = document.querySelector('.stats-grid');
if (statsGrid && counters.length && 'IntersectionObserver' in window) {
  let countersStarted = false;
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || countersStarted) return;
      countersStarted = true;
      counters.forEach(counter => {
        const target = Number(counter.dataset.count);
        const duration = 900;
        const started = performance.now();
        const tick = now => {
          const progress = Math.min((now - started) / duration, 1);
          counter.textContent = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(tick);
          else counter.textContent = target;
        };
        requestAnimationFrame(tick);
      });
    });
  }, { threshold: 0.35 });
  statsObserver.observe(statsGrid);
} else {
  counters.forEach(counter => counter.textContent = counter.dataset.count);
}

// Integrity, honesty and trust slider
(() => {
  const slider = document.getElementById('valuesSlider');
  if (!slider) return;

  const slides = [...slider.querySelectorAll('.value-slide')];
  const dots = [...slider.querySelectorAll('.value-dot')];
  const currentLabel = slider.querySelector('.values-current');
  const prevButton = slider.querySelector('.values-prev');
  const nextButton = slider.querySelector('.values-next');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const interval = 6000;
  let current = 0;
  let timer = null;
  let touchStartX = 0;

  const restartProgress = () => {
    if (reduceMotion) return;
    slider.classList.remove('is-running');
    void slider.offsetWidth;
    slider.classList.add('is-running');
  };

  const stopAuto = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
    slider.classList.remove('is-running');
  };

  const startAuto = () => {
    if (reduceMotion || slides.length < 2) return;
    stopAuto();
    restartProgress();
    timer = window.setInterval(() => showSlide(current + 1), interval);
  };

  const restartAuto = () => {
    stopAuto();
    startAuto();
  };

  const showSlide = (index, userInitiated = false) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
    if (currentLabel) currentLabel.textContent = String(current + 1).padStart(2, '0');
    restartProgress();
    if (userInitiated) restartAuto();
  };

  prevButton?.addEventListener('click', () => showSlide(current - 1, true));
  nextButton?.addEventListener('click', () => showSlide(current + 1, true));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i, true)));

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);
  slider.addEventListener('focusin', stopAuto);
  slider.addEventListener('focusout', e => {
    if (!slider.contains(e.relatedTarget)) startAuto();
  });

  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  slider.addEventListener('touchend', e => {
    const distance = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 50) showSlide(current + (distance < 0 ? 1 : -1), true);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  showSlide(0);
  startAuto();
})();
