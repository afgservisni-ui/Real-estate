/* AFG Real Estate — interactions */

(function () {
  'use strict';

  /* ── NAV scroll state ── */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile burger ── */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  const closeMenu = () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('open');
    nav.classList.remove('menu-open');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    navOverlay.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navOverlay.addEventListener('click', closeMenu);
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ── Scroll reveal ── */
  const revealObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Counter animation ── */
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const animateCounter = el => {
    const target = +el.dataset.target;
    const duration = 1800;
    const start = performance.now();
    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        statsObserver.unobserve(e.target);
      }
    }),
    { threshold: 0.5 }
  );
  document.querySelectorAll('.stat__num[data-target]').forEach(el => statsObserver.observe(el));

  /* ── Contact form ── */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const btn = form.querySelector('[type=submit]');
    btn.textContent = 'Odesílám…';
    btn.disabled = true;
    setTimeout(() => {
      successMsg.hidden = false;
      form.reset();
      btn.textContent = 'Odeslat zprávu';
      btn.disabled = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1200);
  });

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const linkMap = {};
  document.querySelectorAll('.nav__links a[href^="#"]').forEach(a => {
    linkMap[a.getAttribute('href').slice(1)] = a;
  });

  const navActiveObserver = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting && linkMap[e.target.id]) {
          Object.values(linkMap).forEach(l => l.removeAttribute('aria-current'));
          linkMap[e.target.id].setAttribute('aria-current', 'page');
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );
  sections.forEach(s => navActiveObserver.observe(s));
})();
