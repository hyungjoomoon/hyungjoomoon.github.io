(() => {
  'use strict';
  document.documentElement.classList.add('js-enabled');

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.site-nav');
  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    menu?.classList.remove('is-open');
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  menu?.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  matchMedia('(min-width: 721px)').addEventListener('change', closeMenu);

  const publications = document.querySelector('[data-publications]');
  if (publications) {
    const buttons = [...publications.querySelectorAll('[data-pub-filter]')];
    const rows = [...publications.querySelectorAll('[data-publication]')];
    const query = document.getElementById('publication-query');
    const year = document.getElementById('publication-year');
    const count = document.getElementById('publication-count');
    const empty = document.getElementById('no-publications');
    const searchParams = new URLSearchParams(location.search);
    let type = buttons.some((button) => button.dataset.pubFilter === searchParams.get('type')) ? searchParams.get('type') : 'all';
    const update = () => {
      const term = query.value.trim().toLocaleLowerCase();
      let visible = 0;
      rows.forEach((row) => {
        const match = (type === 'all' || row.dataset.type === type) && (year.value === 'all' || row.dataset.year === year.value) && row.textContent.toLocaleLowerCase().includes(term);
        row.hidden = !match;
        if (match) visible++;
      });
      count.textContent = visible;
      empty.hidden = visible !== 0;
      buttons.forEach((button) => {
        const active = button.dataset.pubFilter === type;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    };
    buttons.forEach((button) => button.addEventListener('click', () => { type = button.dataset.pubFilter; update(); }));
    query.addEventListener('input', update);
    year.addEventListener('change', update);
    document.getElementById('reset-publications').addEventListener('click', () => {
      type = 'all'; query.value = ''; year.value = 'all'; update(); query.focus();
    });
    update();
  }

  // An illustrative wave field, drawn locally. This is a visual motif, not measured data.
  const canvas = document.getElementById('wireless-field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const control = document.querySelector('.field-control');
  if (!ctx) { if (control) control.hidden = true; return; }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches;
  let visible = true;
  let width = 0, height = 0, frame = 0, time = 0, last = 0;
  const nodes = [ [-.85, -.42], [.5, .1], [-.18, .8] ];
  const project = (x, y, z) => {
    const scale = width * .32;
    return [width * .5 + (x * .92 - y * .56) * scale, height * .61 + (x * .28 + y * .48 - z) * scale];
  };
  const elevation = (x, y) => {
    let z = 0;
    for (let i = 0; i < nodes.length; i++) {
      const [nx, ny] = nodes[i];
      const r = Math.hypot(x - nx, y - ny);
      z += Math.cos(r * 5.6 - time * .65 + i * .8) * Math.exp(-r * 1.5) * .35;
    }
    return z + .48 * Math.exp(-((x - .12) ** 2 + (y + .05) ** 2) * 1.3);
  };
  const draw = () => {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const extent = 1.38, divisions = 48, step = extent * 2 / divisions;
    // A subtle ground plane establishes depth beneath the radio field.
    ctx.lineWidth = .65;
    ctx.strokeStyle = 'rgba(83, 123, 191, .10)';
    for (let axis = 0; axis < 2; axis++) {
      for (let i = 0; i <= 12; i++) {
        const v = -extent + i * extent / 6;
        const start = axis ? project(v, -extent, -.28) : project(-extent, v, -.28);
        const end = axis ? project(v, extent, -.28) : project(extent, v, -.28);
        ctx.beginPath(); ctx.moveTo(...start); ctx.lineTo(...end); ctx.stroke();
      }
    }
    for (let axis = 0; axis < 2; axis++) {
      for (let i = 0; i <= divisions; i++) {
        const fixed = -extent + i * step;
        const alpha = .18 + .37 * Math.pow(Math.sin(i / divisions * Math.PI), 1.1);
        ctx.strokeStyle = `rgba(33, 89, 222, ${alpha})`;
        ctx.lineWidth = i % 4 === 0 ? .9 : .55;
        ctx.beginPath();
        for (let j = 0; j <= divisions; j++) {
          const variable = -extent + j * step;
          const x = axis ? fixed : variable, y = axis ? variable : fixed;
          const point = project(x, y, elevation(x, y));
          if (j === 0) ctx.moveTo(...point); else ctx.lineTo(...point);
        }
        ctx.stroke();
      }
    }
    // Sparse sampling points make the surface feel like a represented environment.
    for (let i = 0; i <= divisions; i += 4) {
      for (let j = 0; j <= divisions; j += 4) {
        const x = -extent + i * step, y = -extent + j * step;
        const point = project(x, y, elevation(x, y));
        ctx.fillStyle = 'rgba(32, 84, 191, .54)';
        ctx.beginPath(); ctx.arc(...point, .9, 0, Math.PI * 2); ctx.fill();
      }
    }
    nodes.forEach(([x,y], i) => {
      const point = project(x, y, elevation(x,y));
      const floor = project(x, y, -.28);
      ctx.setLineDash([2, 4]); ctx.strokeStyle = 'rgba(33, 89, 222, .38)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(...point); ctx.lineTo(...floor); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(33, 89, 222, .21)';
      ctx.beginPath(); ctx.arc(...point, 10 + Math.sin(time + i) * 2, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#2159de'; ctx.beginPath(); ctx.arc(...point, 3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
    });
  };
  const tick = (now) => {
    frame = 0;
    if (paused || !visible || document.hidden) { last = 0; return; }
    if (!last || now - last >= 40) {
      time += last ? Math.min((now - last) / 1000, .1) : 0;
      last = now; draw();
    }
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    control?.setAttribute('aria-label', paused ? 'Play field animation' : 'Pause field animation');
    control?.setAttribute('aria-pressed', String(paused));
    if (control) control.innerHTML = paused ? 'PLAY <span aria-hidden="true">▷</span>' : 'PAUSE <span aria-hidden="true">Ⅱ</span>';
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  };
  new ResizeObserver((entries) => {
    const rect = entries[0].contentRect;
    width = rect.width; height = rect.height;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0); draw();
  }).observe(canvas);
  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; sync(); }).observe(canvas);
  control?.addEventListener('click', () => { paused = !paused; sync(); });
  motion.addEventListener('change', (event) => { paused = event.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  sync();
})();
