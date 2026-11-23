(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Hero: place the photo and pin the two labels to the ship, whatever the screen size.
  const hero = $('[data-hero]'), ship = $('[data-ship]'), nav = $('[data-nav]');
  const set = (el, attrs) => Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  const layout = () => {
    const vw = hero.clientWidth, vh = hero.clientHeight, portrait = vh > vw, R = 3200 / 2305;
    const L = portrait ? 1.25 * vw : 1.02 * vw, h = L / R;
    const sx = (portrait ? 0.55 : 0.56) * vw, sy = Math.max((portrait ? 0.28 : 0.33) * vh, portrait ? h / 2 : 0);
    const left = sx - 0.485 * L, top = sy - h / 2;
    Object.assign(ship.style, { width: L + 'px', height: h + 'px', left: left + 'px', top: top + 'px' });
    const at = (u, v) => [left + u * L, top + v * h];
    const [bowX, bowY] = at(0.106, 0.5), [brX, brY] = at(0.797, 0.5);
    const rise = (portrait ? 0.105 : 0.17) * vh, ly = sy - rise;
    const ax = portrait ? bowX + 4 : bowX * 0.42;
    set($('[data-course]'), { x1: bowX - 6, y1: bowY, x2: 0, y2: bowY });
    set($('[data-lead="a"]'), { x1: ax, y1: bowY, x2: ax, y2: ly + 8 });
    set($('[data-lead="b"]'), { x1: brX, y1: brY, x2: brX, y2: ly + 8 });
    set($('[data-dot="a"]'), { cx: ax, cy: bowY });
    set($('[data-dot="b"]'), { cx: brX, cy: brY });
    $$('[data-rings] circle').forEach((c, i) => set(c, { cx: brX, cy: brY, r: [0.11, 0.22, 0.34][i] * L }));
    const [fx0, fy0] = at(0.440, 0.396), [fx1, fy1] = at(0.512, 0.440), c = Math.max(6, 0.008 * L);
    set($('[data-frame]'), { d: `M${fx0} ${fy0 + c}V${fy0}h${c}M${fx1 - c} ${fy0}h${c}v${c}M${fx1} ${fy1 - c}V${fy1}h${-c}M${fx0 + c} ${fy1}h${-c}v${-c}` });
    const [tx0, ty0] = at(0.098, 0.398), [tx1, ty1] = at(0.872, 0.607), tc = 0.014 * L;
    set($('[data-track]', hero), { d: `M${tx0} ${ty0 + tc}V${ty0}h${tc}M${tx1 - tc} ${ty0}h${tc}v${tc}M${tx1} ${ty1 - tc}V${ty1}h${-tc}M${tx0 + tc} ${ty1}h${-tc}v${-tc}` });
    Object.assign($('[data-mark="a"]').style, { left: ax - 2 + 'px', top: ly + 'px' });
    Object.assign($('[data-mark="b"]').style, { right: vw - brX - 2 + 'px', top: ly + 'px' });
  };
  layout();
  addEventListener('resize', layout);
  requestAnimationFrame(() => hero.classList.add('ready'));

  const onScroll = () => nav.classList.toggle('solid', scrollY > hero.offsetHeight - 80);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  // Reference projects as tabs. Without JS all three simply follow one another.
  document.documentElement.classList.add('js');
  const refs = $('[data-refs]'), rnav = $('[data-refs-nav]'), items = $$('.ref', refs);
  rnav.setAttribute('role', 'tablist');
  items.forEach(el => { const rows = $$('.layers li', el); rows.forEach((li, i) => { li.style.setProperty('--i', i); li.style.setProperty('--n', rows.length); }); });
  let current = 0;
  const tabs = items.map((el, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = el.dataset.name; b.addEventListener('click', () => show(i)); rnav.append(b); return b; });
  function show(i, focus) {
    current = (i + items.length) % items.length;
    items.forEach((el, k) => el.classList.toggle('active', k === current));
    tabs.forEach((b, k) => { b.setAttribute('aria-selected', k === current); b.tabIndex = k === current ? 0 : -1; });
    if (focus) tabs[current].focus();
  }
  rnav.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1, true); } if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1, true); } });
  show(0);
})();
