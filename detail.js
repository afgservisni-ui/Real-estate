/* AFG Real Estate — Detail page interactions */

(function () {
  'use strict';

  /* ── Scroll reveal (re-use same pattern as main.js) ── */
  const revealObserver = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Sticky detail bar ── */
  const detailBar = document.getElementById('detailBar');
  if (detailBar) {
    const galleryEl = document.querySelector('.detail-hero__gallery');
    const barObserver = new IntersectionObserver(
      ([entry]) => detailBar.classList.toggle('visible', !entry.isIntersecting),
      { threshold: 0 }
    );
    if (galleryEl) barObserver.observe(galleryEl);
  }

  /* ── Gallery ── */
  const galleryImages = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&auto=format&fit=crop&q=80',
  ];

  let currentIdx = 0;
  const mainImg = document.getElementById('galleryMain');
  const counter = document.getElementById('galleryCounter');
  const thumbs = document.querySelectorAll('.gallery__thumb');

  function setGallerySlide(idx) {
    if (!mainImg) return;
    idx = (idx + galleryImages.length) % galleryImages.length;
    currentIdx = idx;

    mainImg.classList.remove('active');
    setTimeout(() => {
      mainImg.src = galleryImages[idx];
      mainImg.classList.add('active');
    }, 80);

    if (counter) counter.textContent = `${idx + 1} / ${galleryImages.length}`;

    thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
  }

  document.getElementById('galleryPrev')?.addEventListener('click', () => setGallerySlide(currentIdx - 1));
  document.getElementById('galleryNext')?.addEventListener('click', () => setGallerySlide(currentIdx + 1));

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => setGallerySlide(+thumb.dataset.idx));
  });

  /* keyboard navigation */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  setGallerySlide(currentIdx - 1);
    if (e.key === 'ArrowRight') setGallerySlide(currentIdx + 1);
  });

  /* ── Tabs ── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.getElementById(`tab-${target}`)?.classList.add('active');
    });
  });

  /* ── Units filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const unitRows = document.querySelectorAll('.unit-row');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      unitRows.forEach(row => {
        const show = filter === 'all' || row.dataset.type === filter;
        row.classList.toggle('hidden', !show);
      });
    });
  });

  /* ── Floor plan selector ── */
  const fpBtns = document.querySelectorAll('.fp-btn');
  const fpViews = document.querySelectorAll('.floorplan-img');

  fpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan;
      fpBtns.forEach(b => b.classList.remove('active'));
      fpViews.forEach(v => v.classList.add('hidden'));
      btn.classList.add('active');
      document.getElementById(plan)?.classList.remove('hidden');
    });
  });

  /* ── Progress bar animation ── */
  const progressFill = document.querySelector('.progress-bar-fill');
  if (progressFill) {
    const targetWidth = progressFill.style.width;
    progressFill.style.width = '0%';
    const progressObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => { progressFill.style.width = targetWidth; });
        progressObserver.unobserve(entry.target);
      }
    }, { threshold: 0.5 });
    progressObserver.observe(progressFill.parentElement);
  }

  /* ── Sidebar form ── */
  const sidebarForm = document.getElementById('sidebarForm');
  const sidebarSuccess = document.getElementById('sidebarSuccess');

  if (sidebarForm) {
    sidebarForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!sidebarForm.checkValidity()) { sidebarForm.reportValidity(); return; }
      const btn = sidebarForm.querySelector('[type=submit]');
      btn.textContent = 'Odesílám…';
      btn.disabled = true;
      setTimeout(() => {
        sidebarSuccess.hidden = false;
        sidebarForm.reset();
        btn.textContent = 'Odeslat poptávku';
        btn.disabled = false;
        sidebarSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1200);
    });
  }

  /* ── Save / Share buttons ── */
  const btnSave = document.getElementById('btnSave');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const saved = btnSave.classList.toggle('saved');
      btnSave.querySelector('svg').style.fill = saved ? 'currentColor' : 'none';
      btnSave.childNodes[btnSave.childNodes.length - 1].textContent = saved ? ' Uloženo' : ' Uložit projekt';
    });
  }

  const btnShare = document.getElementById('btnShare');
  if (btnShare) {
    btnShare.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({ title: 'Bydlení u Lázní', url: location.href });
        } catch {}
      } else {
        await navigator.clipboard.writeText(location.href);
        const orig = btnShare.childNodes[btnShare.childNodes.length - 1].textContent;
        btnShare.childNodes[btnShare.childNodes.length - 1].textContent = ' Zkopírováno!';
        setTimeout(() => { btnShare.childNodes[btnShare.childNodes.length - 1].textContent = orig; }, 2000);
      }
    });
  }

  /* ── "Mám zájem" links pre-fill form dispozice ── */
  document.querySelectorAll('.unit-row__cta:not(.unit-row__cta--dim)').forEach(link => {
    link.addEventListener('click', e => {
      const row = link.closest('.unit-row');
      const type = row?.dataset.type;
      const select = document.getElementById('s-unit');
      if (select && type) {
        const map = { '1kk': '1+kk (od 3 490 000 Kč)', '2kk': '2+kk (od 4 890 000 Kč)', '3kk': '3+kk (od 6 850 000 Kč)', '4kk': '4+kk / penthouse (od 11 490 000 Kč)' };
        select.value = map[type] || '';
      }
    });
  });

})();
