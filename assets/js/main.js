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

  // Keep unfinished manuscripts in the current DGIST calendar year, even without a rebuild.
  const currentYear = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Seoul' }).format(new Date());
  document.querySelectorAll('[data-publication][data-type="progress"]').forEach((row) => {
    row.dataset.year = currentYear;
    row.querySelector('[data-publication-year]').textContent = currentYear;
  });

  const publications = document.querySelector('[data-publications]');
  if (publications) {
    const buttons = [...publications.querySelectorAll('[data-pub-filter]')];
    const rows = [...publications.querySelectorAll('[data-publication]')];
    const query = document.getElementById('publication-query');
    const year = document.getElementById('publication-year');
    const years = [...new Set(rows.map((row) => row.dataset.year))].sort((a, b) => Number(b) - Number(a));
    year.replaceChildren(new Option('All years', 'all'), ...years.map((value) => new Option(value, value)));
    const count = document.getElementById('publication-count');
    const empty = document.getElementById('no-publications');
    const searchParams = new URLSearchParams(location.search);
    let type = buttons.some((button) => button.dataset.pubFilter === searchParams.get('type')) ? searchParams.get('type') : 'all';
    const update = () => {
      const term = query.value.trim().toLocaleLowerCase();
      let visible = 0;
      rows.forEach((row) => {
        const matchesType = type === 'all' || (type === 'preprint' ? row.dataset.preprint === 'true' : row.dataset.type === type);
        const match = matchesType && (year.value === 'all' || row.dataset.year === year.value) && row.textContent.toLocaleLowerCase().includes(term);
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
    year.addEventListener('change', () => {
      type = 'all';
      update();
    });
    document.getElementById('reset-publications').addEventListener('click', () => {
      type = 'all'; query.value = ''; year.value = 'all'; update(); query.focus();
    });
    update();
  }
})();
