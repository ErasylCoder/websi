(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const setScrollProgress = () => {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop || 0;
    const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
    const progress = Math.min(1, Math.max(0, scrollTop / max));
    doc.style.setProperty('--scroll-progress', progress.toFixed(4));
  };
  setScrollProgress();
  window.addEventListener('scroll', setScrollProgress, { passive: true });
  window.addEventListener('resize', setScrollProgress, { passive: true });

  const navLinks = Array.from(document.querySelectorAll('.menu a[href^="#"]'));
  const sectionById = new Map(
    navLinks
      .map((a) => (a.getAttribute('href') || '').slice(1))
      .filter(Boolean)
      .map((id) => [id, document.getElementById(id)])
      .filter(([, el]) => !!el)
  );

  if (navLinks.length) {
    const setActive = (id) => {
      navLinks.forEach((a) => a.classList.toggle('active', (a.getAttribute('href') || '') === `#${id}`));
    };

    if ('IntersectionObserver' in window && sectionById.size) {
      const ids = Array.from(sectionById.keys());
      const io = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
          if (!visible || !(visible.target instanceof HTMLElement)) return;
          const id = visible.target.id;
          if (ids.includes(id)) setActive(id);
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: [0.12, 0.22, 0.32] }
      );
      sectionById.forEach((el) => io.observe(el));
    }

    navLinks.forEach((a) => {
      a.addEventListener('click', (event) => {
        const href = a.getAttribute('href') || '';
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (!target) return;

        event.preventDefault();
        const headerH = header ? header.getBoundingClientRect().height : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.history.pushState({}, '', href);
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  const revealTargets = Array.from(
    document.querySelectorAll(
      [
        '.hero__layout > *',
        '.section',
        '.card',
        '.services__hero',
        '.service-card',
        '.appointment__hero',
        '.appointment-card',
        '.photo-frame',
        '.faq details',
        '.doc-card'
      ].join(',')
    )
  );

  if (revealTargets.length) {
    revealTargets.forEach((el, index) => {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', `${Math.min(index, 10) * 55}ms`);
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((el) => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
      );
      revealTargets.forEach((el) => io.observe(el));
    }
  }

  const body = document.body;
  if (body) requestAnimationFrame(() => body.classList.add('page-ready'));

  if (!prefersReducedMotion) {
    document.addEventListener('click', (event) => {
      const a = event.target instanceof Element ? event.target.closest('a') : null;
      if (!a) return;

      const href = a.getAttribute('href') || '';
      const target = a.getAttribute('target');
      const rel = a.getAttribute('rel') || '';

      const isExternal = a.origin && a.origin !== window.location.origin;
      const isHash = href.startsWith('#');
      const isDownload = a.hasAttribute('download');
      const opensNewTab = target === '_blank' || rel.includes('noopener') || rel.includes('noreferrer');

      if (isExternal || isHash || isDownload || opensNewTab) return;
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      event.preventDefault();
      document.body.classList.add('page-leave');
      window.setTimeout(() => (window.location.href = a.href), 170);
    });
  }

  const appointmentForm = document.getElementById('appointment-form');
  const appointmentStatus = document.getElementById('form-status');
  if (appointmentForm && appointmentStatus) {
    appointmentForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = appointmentForm.elements.name?.value?.trim?.() || '';
      const phone = appointmentForm.elements.phone?.value?.trim?.() || '';
      const message = appointmentForm.elements.message?.value?.trim?.() || '';

      if (!name || !phone) {
        appointmentStatus.textContent = 'Аты-жөніңіз бен байланыс нөмірін толтырыңыз.';
        appointmentStatus.classList.add('form-status--error', 'form-status--visible');
        appointmentStatus.classList.remove('form-status--success');
        return;
      }

      const text = [
        'Сәлеметсіз бе! Мен кеңеске жазылғым келеді.',
        '',
        'Аты-жөнім: ' + name,
        'Байланыс нөмірі: ' + phone,
        'Сұраныс: ' + (message || '-')
      ].join('\n');

      window.open('https://wa.me/77071679445?text=' + encodeURIComponent(text), '_blank', 'noopener');
      appointmentStatus.textContent = '✔ Сіз сұраныс жібердіңіз.';
      appointmentStatus.classList.add('form-status--success', 'form-status--visible');
      appointmentStatus.classList.remove('form-status--error');
      appointmentForm.reset();
    });
  }

  const galleryImgs = Array.from(document.querySelectorAll('.gallery__img'));
  if (galleryImgs.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Фото');
    lightbox.innerHTML = `
      <div class="lightbox__panel" role="document">
        <div class="lightbox__topbar">
          <p class="lightbox__title" id="lightboxTitle">Фото</p>
          <button type="button" class="lightbox__close" aria-label="Жабу">Жабу</button>
        </div>
        <img class="lightbox__img" alt="" />
      </div>
    `;

    const imgEl = lightbox.querySelector('.lightbox__img');
    const titleEl = lightbox.querySelector('#lightboxTitle');
    const closeBtn = lightbox.querySelector('.lightbox__close');

    const close = () => {
      lightbox.classList.remove('is-open');
      document.documentElement.style.removeProperty('overflow');
    };

    const open = (src, alt) => {
      if (!(imgEl instanceof HTMLImageElement) || !(titleEl instanceof HTMLElement)) return;
      imgEl.src = src;
      imgEl.alt = alt || 'Фото';
      titleEl.textContent = alt || 'Фото';
      document.documentElement.style.overflow = 'hidden';
      lightbox.classList.add('is-open');
      closeBtn?.focus?.();
    };

    document.body.appendChild(lightbox);

    closeBtn?.addEventListener('click', close);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });

    galleryImgs.forEach((img) => {
      img.addEventListener('click', (event) => {
        if (prefersReducedMotion) return;
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        open(img.currentSrc || img.src, img.alt || '');
      });
    });
  }
})();
