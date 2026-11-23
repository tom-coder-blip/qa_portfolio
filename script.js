(function () {
  const root = document.documentElement;
  const bar = document.getElementById('bar');
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const themeToggle = document.getElementById('themeToggle');

  // ----- theme toggle -----
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // ----- mobile menu -----
  const closeMenu = () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  };
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // ----- nav border on scroll -----
  const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ----- reveal on scroll -----
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // ----- active nav link -----
  const links = [...nav.querySelectorAll('a')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  // ----- certificate lightbox -----
  const lb = document.getElementById('lightbox');
  const certBtns = [...document.querySelectorAll('.cert-btn')];
  if (lb && typeof lb.showModal === 'function') {
    const lbImg = document.getElementById('lbImg');
    const lbTitle = document.getElementById('lbTitle');
    const lbMeta = document.getElementById('lbMeta');
    let idx = 0;
    const show = i => {
      idx = (i + certBtns.length) % certBtns.length;
      const b = certBtns[idx];
      lbImg.src = b.dataset.src;
      lbImg.alt = 'Code College certificate: ' + b.dataset.title;
      lbTitle.textContent = b.dataset.title;
      lbMeta.textContent = b.dataset.meta;
    };
    certBtns.forEach((b, i) => b.addEventListener('click', () => { show(i); lb.showModal(); }));
    document.getElementById('lbClose').addEventListener('click', () => lb.close());
    document.getElementById('lbPrev').addEventListener('click', () => show(idx - 1));
    document.getElementById('lbNext').addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  } else {
    // No <dialog> support: open the image directly
    certBtns.forEach(b => b.addEventListener('click', () => window.open(b.dataset.src, '_blank')));
  }

  // ----- footer year -----
  document.getElementById('year').textContent = new Date().getFullYear();
})();
