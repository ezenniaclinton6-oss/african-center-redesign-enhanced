const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 18);
});

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

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const counters = document.querySelectorAll('[data-count]');
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

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);

const slides = Array.from(document.querySelectorAll('.slide'));
const dots = Array.from(document.querySelectorAll('.slider-dot'));
let currentSlide = 0;
let slideTimer;

function showSlide(index) {
  currentSlide = index;
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
}

function nextSlide() {
  showSlide((currentSlide + 1) % slides.length);
}

function startSlider() {
  slideTimer = setInterval(nextSlide, 4200);
}

function resetSlider() {
  clearInterval(slideTimer);
  startSlider();
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    showSlide(Number(dot.dataset.slide));
    resetSlider();
  });
});

const slider = document.getElementById('heroSlider');
if (slider && slides.length > 0) {
  slider.addEventListener('mouseenter', () => clearInterval(slideTimer));
  slider.addEventListener('mouseleave', startSlider);
  showSlide(0);
  startSlider();
}
