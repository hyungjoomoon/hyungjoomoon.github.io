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
    year.addEventListener('change', update);
    document.getElementById('reset-publications').addEventListener('click', () => {
      type = 'all'; query.value = ''; year.value = 'all'; update(); query.focus();
    });
    update();
  }

  // A Channel2World-inspired illustration, not a visualization of measured data.
  // Reflection paths use the image-source construction for a planar facade.
  const canvas = document.getElementById('wireless-field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const control = document.querySelector('.field-control');
  if (!ctx) { if (control) control.hidden = true; return; }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches, still = motion.matches;
  let visible = true;
  let width = 0, height = 0, frame = 0, time = .35, last = 0;
  const blue = [33, 89, 222], reflected = [40, 140, 186], structure = [75, 115, 167];
  const bs = [-1.2, .56, .5];
  const wall = { left: -.65, right: 1.18, front: -.52, back: -1.03, top: .84 };
  const cycleDuration = 22, signalSpeed = 2.5, shotCount = 12, reconstructionShots = 9;
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const smooth = (v) => { v = clamp(v); return v * v * (3 - 2 * v); };
  const rgba = (color, alpha) => `rgba(${color.join(',')},${alpha})`;
  const mix = (a, b, t) => a.map((value, i) => value + (b[i] - value) * t);
  const distance = (a, b) => Math.hypot(...a.map((value, i) => b[i] - value));
  const mobileAt = (t) => [.7 + .4 * Math.sin(t * .23 - .7), .82 + .12 * Math.cos(t * .23 - .7), .15];
  const project = ([x, y, z]) => {
    const scale = Math.min((width - 45) / 3.5, (height - 88) / 1.75);
    return [width * .46 + (x * .92 - y * .56) * scale,
      height * .65 + (x * .23 + y * .38 - z * .78) * scale];
  };
  const line = (points, color, weight = 1, dash = []) => {
    ctx.strokeStyle = color; ctx.lineWidth = weight; ctx.setLineDash(dash);
    ctx.beginPath();
    points.forEach((point, i) => { if (i) ctx.lineTo(...point); else ctx.moveTo(...point); });
    ctx.stroke(); ctx.setLineDash([]);
  };
  const dot = (point, radius, color) => {
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(...point, radius, 0, Math.PI * 2); ctx.fill();
  };
  const polygon = (points) => {
    ctx.beginPath();
    points.forEach((point, i) => { if (i) ctx.lineTo(...point); else ctx.moveTo(...point); });
    ctx.closePath();
  };
  const label = (text, point) => {
    ctx.font = `400 ${width < 380 ? 8 : 9}px "Geist Mono", monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const size = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(247,250,255,.9)';
    ctx.fillRect(point[0] - size / 2 - 5, point[1] - 7, size + 10, 14);
    ctx.fillStyle = '#426186'; ctx.fillText(text, ...point);
  };

  const reflectionPoint = (source, target) => {
    const mirrored = [target[0], 2 * wall.front - target[1], target[2]];
    return mix(source, mirrored, (wall.front - source[1]) / (mirrored[1] - source[1]));
  };
  const radioPath = (emitted, uplink, bounce) => {
    const source = uplink ? mobileAt(emitted) : bs;
    let target = uplink ? bs : mobileAt(emitted);
    let points, length;
    // Predict the receiver position at arrival so a packet reaches the moving UE.
    for (let i = 0; i < 4; i++) {
      points = bounce ? [source, reflectionPoint(source, target), target] : [source, target];
      length = points.slice(1).reduce((sum, point, j) => sum + distance(points[j], point), 0);
      if (!uplink) target = mobileAt(emitted + length / signalSpeed);
    }
    return { points, emitted, length, hit: emitted + distance(points[0], points[1]) / signalSpeed };
  };

  // Facade samples precede their connecting edges as successive reflections arrive.
  const mesh = [], samples = [];
  const revealOrder = ([x, y, z]) => .78 * (
    .68 * (x - wall.left) / (wall.right - wall.left) +
    .18 * (wall.front - y) / (wall.front - wall.back) + .14 * z / wall.top);
  const addEdge = (a, b, weight = .65) => mesh.push({ a, b, weight, order: revealOrder(mix(a, b, .5)) });
  for (let col = 0; col <= 7; col++) {
    const x = wall.left + (wall.right - wall.left) * col / 7;
    for (let row = 0; row <= 3; row++) {
      const z = wall.top * row / 3;
      const point = [x, wall.front, z];
      samples.push(point);
      if (row < 3) addEdge(point, [x, wall.front, z + wall.top / 3], col === 0 || col === 7 ? 1.25 : .65);
      if (col < 7) addEdge(point, [x + (wall.right - wall.left) / 7, wall.front, z], row === 0 || row === 3 ? 1.25 : .65);
    }
  }
  for (const x of [wall.left, wall.right]) {
    for (const z of [0, wall.top]) addEdge([x, wall.front, z], [x, wall.back, z], 1.05);
    addEdge([x, wall.back, 0], [x, wall.back, wall.top], 1.05);
  }
  for (const z of [0, wall.top]) addEdge([wall.left, wall.back, z], [wall.right, wall.back, z], 1.05);
  for (let col = 1; col < 7; col++) {
    const x = wall.left + (wall.right - wall.left) * col / 7;
    addEdge([x, wall.front, wall.top], [x, wall.back, wall.top], .5);
  }
  for (let row = 1; row < 3; row++) addEdge([wall.right, wall.front, wall.top * row / 3], [wall.right, wall.back, wall.top * row / 3], .6);

  const drawBuilding = (progress, opacity) => {
    if (progress <= 0 || opacity <= 0) return;
    const front = [[wall.left, wall.front, 0], [wall.right, wall.front, 0],
      [wall.right, wall.front, wall.top], [wall.left, wall.front, wall.top]];
    polygon(front.map(project)); ctx.fillStyle = rgba(structure, .025 * progress * opacity); ctx.fill();
    mesh.forEach(({ a, b, weight, order }) => {
      const amount = smooth((progress - order) / .2);
      if (!amount) return;
      line([project(a), project(mix(a, b, amount))], rgba(structure, (.32 + .38 * amount) * opacity), weight);
    });
    samples.forEach((point) => {
      const amount = smooth((progress - revealOrder(point) + .07) / .14);
      if (amount) dot(project(point), 1.1, rgba(reflected, amount * opacity * .78));
    });
  };

  const drawPulse = (path, color) => {
    const age = time - path.emitted;
    if (age < 0 || age > path.length / signalSpeed + .35) return;
    const opacity = 1 - smooth((age - path.length / signalSpeed) / .35);
    const points = path.points.map(project);
    line(points, rgba(color, .18 * opacity), .85, path.points.length > 2 ? [3, 5] : []);
    let traveled = age * signalSpeed;
    for (let i = 0; i < points.length - 1; i++) {
      const length = distance(path.points[i], path.points[i + 1]);
      if (traveled > length) { traveled -= length; continue; }
      const fraction = clamp(traveled / length);
      const head = mix(points[i], points[i + 1], fraction);
      line([mix(points[i], points[i + 1], Math.max(0, fraction - .16)), head], rgba(color, .88), 1.8);
      dot(head, 5, rgba(color, .09)); dot(head, 2.2, rgba(color, .95));
      // A narrow wavefront travels to the facade, then propagates from the bounce.
      const angle = Math.atan2(points[i + 1][1] - points[i][1], points[i + 1][0] - points[i][0]);
      const radius = distance(points[i], head);
      for (let ring = 0; ring < 3; ring++) {
        const r = radius - ring * 6;
        if (r <= 3) continue;
        ctx.strokeStyle = rgba(color, (.26 - ring * .065) * Math.sin(fraction * Math.PI));
        ctx.lineWidth = .9; ctx.beginPath();
        ctx.arc(...points[i], r, angle - .17, angle + .17); ctx.stroke();
      }
      break;
    }
  };
  const drawImpact = (path) => {
    const age = time - path.hit;
    if (age < 0 || age > 1.25) return;
    const hit = path.points[1], opacity = 1 - age / 1.25;
    ctx.save();
    polygon([[wall.left, wall.front, 0], [wall.right, wall.front, 0],
      [wall.right, wall.front, wall.top], [wall.left, wall.front, wall.top]].map(project));
    ctx.clip();
    for (let ring = 0; ring < 2; ring++) {
      const radius = .05 + age * .36 - ring * .08;
      if (radius <= 0) continue;
      const points = Array.from({ length: 41 }, (_, i) => {
        const angle = i / 40 * Math.PI * 2;
        return project([hit[0] + Math.cos(angle) * radius, wall.front, hit[2] + Math.sin(angle) * radius]);
      });
      line(points, rgba(reflected, opacity * .42), .9);
    }
    dot(project(hit), 4, rgba(reflected, opacity * .12));
    dot(project(hit), 1.8, rgba(reflected, opacity));
    ctx.restore();
  };

  const drawDevices = (ue) => {
    const foot = project([bs[0], bs[1], 0]), antenna = project(bs);
    const left = project([bs[0] - .095, bs[1], 0]);
    const right = project([bs[0] + .095, bs[1], 0]);
    line([left, antenna, right, left], '#58739a', 1.25);
    for (let i = 1; i <= 3; i++) {
      const f = i / 4;
      line([mix(left, antenna, f), mix(right, antenna, Math.min(1, f + .25))], 'rgba(88,115,154,.6)', .8);
      line([mix(right, antenna, f), mix(left, antenna, Math.min(1, f + .25))], 'rgba(88,115,154,.6)', .8);
    }
    ctx.fillStyle = '#f8fbff'; ctx.strokeStyle = '#2159de'; ctx.lineWidth = 1.2;
    ctx.fillRect(antenna[0] - 4, antenna[1] - 10, 8, 19);
    ctx.strokeRect(antenna[0] - 4, antenna[1] - 10, 8, 19);
    dot(antenna, 2, rgba(blue, 1));
    label('BS', [foot[0], foot[1] + 18]);

    const ground = project([ue[0], ue[1], 0]), port = project(ue);
    ctx.fillStyle = 'rgba(55,95,156,.1)'; ctx.beginPath();
    ctx.ellipse(ground[0], ground[1] + 3, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f8fbff'; ctx.strokeStyle = '#2159de'; ctx.lineWidth = 1.2;
    const phoneHeight = Math.max(17, ground[1] - port[1] + 5);
    ctx.fillRect(port[0] - 6, ground[1] - phoneHeight, 12, phoneHeight);
    ctx.strokeRect(port[0] - 6, ground[1] - phoneHeight, 12, phoneHeight);
    line([[port[0] - 2, ground[1] - 3], [port[0] + 2, ground[1] - 3]], rgba(blue, .5), 1);
    dot(port, 2.2, rgba(blue, 1));
    label('MOBILE UE', [ground[0] + 39, ground[1] - 5]);
  };

  const draw = () => {
    if (width < 80 || height < 80) return;
    ctx.clearRect(0, 0, width, height); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // A quiet isometric ground plane keeps the radio paths and inferred facade legible.
    for (let i = 0; i <= 12; i++) {
      const x = -1.32 + i * 2.64 / 12, y = -1.1 + i * 2.08 / 12;
      line([project([x, -1.1, 0]), project([x, .98, 0])], rgba(structure, .075), .6);
      line([project([-1.32, y, 0]), project([1.32, y, 0])], rgba(structure, .075), .6);
    }
    const ue = mobileAt(time);
    const trail = Array.from({ length: 45 }, (_, i) => {
      const point = mobileAt(time - 7 + i / 44 * 12);
      return project([point[0], point[1], 0]);
    });
    line(trail, rgba(structure, .22), .8, [2, 5]);
    const cycleStart = Math.floor(time / cycleDuration) * cycleDuration;
    const phase = time - cycleStart;
    const shots = Array.from({ length: shotCount }, (_, i) => radioPath(cycleStart + .4 + i * 1.5, i % 2 === 1, true));
    const progress = shots.slice(0, reconstructionShots).reduce((sum, shot) => sum + smooth((time - shot.hit) / .9), 0) / reconstructionShots;
    const opacity = 1 - smooth((phase - 18) / 3.5);
    drawBuilding(still ? 1 : progress, still ? 1 : opacity);
    line([project(bs), project(ue)], rgba(blue, .15), .9);
    if (still) {
      const reflection = radioPath(time - .95, false, true);
      drawPulse(reflection, reflected); drawImpact(reflection);
      drawPulse(radioPath(time - .3, true, false), blue);
    } else {
      shots.forEach((shot) => { drawPulse(shot, reflected); drawImpact(shot); });
      const current = Math.floor(time / 1.1);
      for (let i = Math.max(0, current - 2); i <= current; i++) drawPulse(radioPath(i * 1.1, i % 2 === 1, false), blue);
    }
    drawDevices(ue);
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
    control?.setAttribute('aria-label', paused ? 'Play Channel2World animation' : 'Pause Channel2World animation');
    control?.setAttribute('aria-pressed', String(paused));
    if (control) control.innerHTML = paused ? 'PLAY <span aria-hidden="true">▷</span>' : 'PAUSE <span aria-hidden="true">Ⅱ</span>';
    draw();
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
  control?.addEventListener('click', () => { paused = !paused; if (!paused) still = false; sync(); });
  motion.addEventListener('change', (event) => { paused = event.matches; still = event.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  document.fonts?.ready.then(draw);
  sync();
})();
