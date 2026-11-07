// Café Antigua — interacciones mínimas, sin librerías.
(() => {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  // Barra sólida al bajar
  const pintar = () => nav.classList.toggle('solida', window.scrollY > 40 || menu.classList.contains('abierto'));
  pintar();
  window.addEventListener('scroll', pintar, { passive: true });

  // Menú en celular
  const cerrar = () => {
    menu.classList.remove('abierto');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    pintar();
  };
  burger.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    burger.setAttribute('aria-expanded', String(abierto));
    burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    pintar();
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', cerrar));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && cerrar());

  // Aparecer al hacer scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
      io.observe(el);
    });
  } else {
    items.forEach((el) => el.classList.add('visible'));
  }

  // Contadores de las cifras
  const contar = (el) => {
    const fin = Number(el.dataset.count);
    const t0 = performance.now();
    const paso = (t) => {
      const p = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { contar(e.target); io2.unobserve(e.target); } }), { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach((el) => io2.observe(el));
  }

  document.getElementById('anio').textContent = new Date().getFullYear();
})();
