/* ══════════════════════════════════════════════════════════
   HF FALAKNUMA ROAD — COMPLETE STREET STUDY
   Interaction & Animation Controller v3
   ══════════════════════════════════════════════════════════ */

/* ── Motion.dev with fallback ── */
let animate, stagger;
if (typeof Motion !== 'undefined') {
  animate = Motion.animate;
  stagger = Motion.stagger;
} else {
  animate = function(els, kf, opts) {
    const items = typeof els === 'string' ? [...document.querySelectorAll(els)]
      : (els instanceof Element ? [els] : [...(els || [])]);
    items.forEach(el => {
      if (!el) return;
      Object.entries(kf).forEach(([k, v]) => {
        const val = Array.isArray(v) ? v[v.length - 1] : v;
        if (k === 'opacity') el.style.opacity = val;
        else if (k === 'x') el.style.transform = `translateX(${val}px)`;
        else if (k === 'y') el.style.transform = `translateY(${val}px)`;
        else if (k === 'scale') el.style.transform = `scale(${val})`;
        else el.style[k] = val;
      });
    });
    return { finished: Promise.resolve() };
  };
  stagger = () => 0;
}

/* ══════════════════════════════════════════
   1. PRESENTATION SCALER
══════════════════════════════════════════ */
const scaler   = document.getElementById('presentation-scaler');
const DESIGN_W = 1920;
const DESIGN_H = 1080;

function scalePresentation() {
  if (!scaler) return;
  const sx = window.innerWidth  / DESIGN_W;
  const sy = window.innerHeight / DESIGN_H;
  const s  = Math.min(sx, sy);
  scaler.style.transform = `translate(-50%,-50%) scale(${s})`;
}

/* ══════════════════════════════════════════
   2. SLIDE NAVIGATION
══════════════════════════════════════════ */
const slides      = document.querySelectorAll('.slide');
const tabBtns     = document.querySelectorAll('.tab-btn');
const prevBtn     = document.getElementById('prev-btn');
const nextBtn     = document.getElementById('next-btn');
const hdrPrev     = document.getElementById('hdr-prev');
const hdrNext     = document.getElementById('hdr-next');
const progressFill= document.getElementById('progress-fill');
const curSlideEl  = document.getElementById('cur-slide');

const TOTAL = slides.length;
let current = 0;
let isAnimating = false;

function goTo(idx) {
  if (idx < 0 || idx >= TOTAL || idx === current || isAnimating) return;
  isAnimating = true;

  // Exit current slide
  slides[current].classList.remove('active');
  tabBtns[current].classList.remove('active');

  current = idx;

  // Enter new slide
  slides[current].classList.add('active');
  tabBtns[current].classList.add('active');

  // Update UI
  curSlideEl.textContent = current + 1;
  prevBtn.disabled  = current === 0;
  hdrPrev.disabled  = current === 0;
  nextBtn.disabled  = current === TOTAL - 1;
  hdrNext.disabled  = current === TOTAL - 1;

  // Style next button
  nextBtn.classList.toggle('active-btn', current < TOTAL - 1);

  // Progress bar
  progressFill.style.width = `${((current + 1) / TOTAL) * 100}%`;

  // Trigger slide-specific animation
  setTimeout(() => {
    runSlideAnimation(current);
    isAnimating = false;
  }, 50);
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
hdrPrev.addEventListener('click', prev);
hdrNext.addEventListener('click', next);

tabBtns.forEach(btn => btn.addEventListener('click', () => {
  goTo(parseInt(btn.dataset.target, 10));
}));

document.querySelectorAll('.next-slide-btn').forEach(b => b.addEventListener('click', next));

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown') next();
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev();
});

/* ══════════════════════════════════════════
   3. SLIDE-SPECIFIC ANIMATIONS
══════════════════════════════════════════ */
function runSlideAnimation(idx) {
  if (idx === 0) animSlide1();
  else if (idx === 1) animSlide2();
  else if (idx === 2) animSlide3();
  else if (idx === 3) animSlide4();
  else if (idx === 4) animSlide5();
}

function animSlide1() {
  animate('.s1-card',    { x: [-50, 0], opacity: [0, 1] }, { duration: 0.7, easing: 'ease-out' });
  animate('.corridor-line', { opacity: [0, 1] }, { duration: 0.8, delay: 0.2 });
  animate('.hotspot',    { scale: [0, 1], opacity: [0, 1] }, { duration: 0.4, delay: 0.7 });
  animate('.map-callout',{ scale: [0.85, 1], opacity: [0, 1] }, { duration: 0.5, delay: 0.9 });
  animate('.s1-legend > *', { x: [40, 0], opacity: [0, 1] }, { duration: 0.6, delay: stagger(0.12, { startDelay: 0.5 }) });
}

function animSlide2() {
  animate('#slide-1 .glass-light', { y: [30, 0], opacity: [0, 1] }, { duration: 0.6, delay: stagger(0.12) });
  animate('.metric-tile', { scale: [0.9, 1], opacity: [0, 1] }, { duration: 0.4, delay: stagger(0.05, { startDelay: 0.3 }) });
  renderCrossSection('existing');
}

function animSlide3() {
  animate('.issues-hdr', { y: [-20, 0], opacity: [0, 1] }, { duration: 0.5 });
  animate('.ic:not(.hidden)', { scale: [0.88, 1], opacity: [0, 1] }, { duration: 0.4, delay: stagger(0.06, { startDelay: 0.15 }) });
  animate('.timeline-card', { y: [20, 0], opacity: [0, 1] }, { duration: 0.5, delay: 0.4 });
  animate('.stats-bar', { y: [20, 0], opacity: [0, 1] }, { duration: 0.5, delay: 0.5 });
  countUpStats();
}

function animSlide4() {
  animate('#slide-3 .glass-light', { y: [30, 0], opacity: [0, 1] }, { duration: 0.6, delay: stagger(0.15) });
  animate('.at-row', { x: [-20, 0], opacity: [0, 1] }, { duration: 0.4, delay: stagger(0.07, { startDelay: 0.4 }) });
  animate('.gain-card', { y: [15, 0], opacity: [0, 1] }, { duration: 0.4, delay: stagger(0.08, { startDelay: 0.6 }) });
  buildStaticSections();
}

function animSlide5() {
  animate('.vision-title-card', { y: [-30, 0], opacity: [0, 1] }, { duration: 0.7 });
  animate('.ve-card', { y: [40, 0], opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.06, { startDelay: 0.4 }) });
}

/* ══════════════════════════════════════════
   4. CROSS-SECTION DATA & RENDERER
══════════════════════════════════════════ */
const existingSegs = [
  { lbl:'Footpath (Encroached)', w:0.5, cls:'ped', desc:'Fully occupied by vendors, utility boxes, and parked two-wheelers. Pedestrians forced onto carriageway.' },
  { lbl:'Informal Parking', w:1.5, cls:'prk', desc:'Unmanaged parallel parking on both sides. Reduces effective carriageway from 12m to ~8m at peak hours.' },
  { lbl:'Mixed Traffic Lane', w:4.0, cls:'car', desc:'Undivided two-way traffic mixing motorcycles, autos, and pedestrians. No lane discipline or markings.' },
  { lbl:'Mixed Traffic Lane', w:4.0, cls:'car', desc:'Opposite direction flow. High pedestrian-vehicle conflict zone due to absence of footpath.' },
  { lbl:'Informal Parking', w:1.5, cls:'prk', desc:'Encroachment from shops and vendors combined with parked vehicles blocks the shoulder zone entirely.' },
  { lbl:'Footpath (Absent)', w:0.5, cls:'ped', desc:'Non-existent footpath. Residents walk on the road edge with no protection from traffic.' }
];

const proposedSegs = [
  { lbl:'Footpath + Green', w:1.5, cls:'ped', desc:'Wide, continuous, shaded footpath with tactile guidance strips and tree pits at 8m intervals.' },
  { lbl:'Cycle Track', w:1.0, cls:'cyc', desc:'Protected, green-painted cycling lane with physical bollard separation from the carriageway.' },
  { lbl:'Carriageway', w:3.5, cls:'car', desc:'Organised northbound traffic lane with clear markings, speed management measures, and raised crossings.' },
  { lbl:'Carriageway', w:3.5, cls:'car', desc:'Organised southbound traffic lane mirroring north. No on-street parking permitted.' },
  { lbl:'Cycle Track', w:1.0, cls:'cyc', desc:'South-side protected cycle track providing safe, continuous cycling from Makkanagar to Sonal Road.' },
  { lbl:'Footpath + Green', w:1.5, cls:'ped', desc:'South-side footpath with integrated bio-swale drainage, street furniture, and LED luminaires.' }
];

const metricsExisting = {
  carriage: '8 m',   carriage_d: 'Mixed 2-way traffic',
  footpath: '~0.5 m', footpath_d: 'Encroached / absent',
  cycle: 'NIL',      cycle_d: 'No provision',      cycleClass: 'red',
  trees: 'NIL',      trees_d: 'No shade / greenery', treesClass: 'red',
  parking: '1.5 m',  parking_d: 'Both sides informal'
};
const metricsProposed = {
  carriage: '7 m',    carriage_d: 'Organised 2 lanes × 3.5m',
  footpath: '1.5 m',  footpath_d: 'Shaded + tactile (×2)',
  cycle: '1.0 m',    cycle_d: 'Protected track (×2)', cycleClass: 'green',
  trees: '8m spacing', trees_d: 'Native shade trees',   treesClass: 'green',
  parking: 'NIL',    parking_d: 'Relocated off-street'
};

let sectionMode = 'existing';

function renderCrossSection(mode) {
  sectionMode = mode;
  const segs    = mode === 'existing' ? existingSegs : proposedSegs;
  const metrics = mode === 'existing' ? metricsExisting : metricsProposed;
  const bar     = document.getElementById('cs-bar');
  const title   = document.getElementById('cs-title');
  if (!bar) return;

  // Update title
  title.textContent = mode === 'existing'
    ? 'EXISTING CROSS-SECTION · 12m ROW'
    : 'PROPOSED CROSS-SECTION · 12m ROW';

  // Update metrics
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('m-carriage', metrics.carriage); set('d-carriage', metrics.carriage_d);
  set('m-footpath', metrics.footpath); set('d-footpath', metrics.footpath_d);
  set('m-cycle', metrics.cycle);
  set('m-trees', metrics.trees);
  set('m-parking', metrics.parking); set('d-parking', metrics.parking_d);

  const cycEl = document.getElementById('m-cycle');
  if (cycEl) { cycEl.className = `mt-val ${metrics.cycleClass}`; }
  const treeEl = document.getElementById('m-trees');
  if (treeEl) { treeEl.className = `mt-val ${metrics.treesClass}`; }

  // Rebuild bar
  bar.innerHTML = '';
  const total = segs.reduce((s, sg) => s + sg.w, 0);

  segs.forEach((seg, i) => {
    const block = document.createElement('div');
    block.className = `cs-block ${seg.cls}`;
    block.style.flex = `0 0 ${(seg.w / total) * 100}%`;
    block.innerHTML = `<span class="bl">${seg.lbl}</span><span class="bw">${seg.w}m</span>`;

    block.addEventListener('mouseenter', () => {
      document.querySelectorAll('#cs-bar .cs-block').forEach(b => b.classList.remove('active-seg'));
      block.classList.add('active-seg');
      const nm = document.getElementById('csi-name');
      const wd = document.getElementById('csi-width');
      const dc = document.getElementById('csi-desc');
      if (nm) nm.textContent = seg.lbl;
      if (wd) wd.textContent = `${seg.w}m`;
      if (dc) dc.textContent = seg.desc;
    });

    if (i === 0) {
      block.classList.add('active-seg');
      const nm = document.getElementById('csi-name');
      const wd = document.getElementById('csi-width');
      const dc = document.getElementById('csi-desc');
      if (nm) nm.textContent = seg.lbl;
      if (wd) wd.textContent = `${seg.w}m`;
      if (dc) dc.textContent = seg.desc;
    }
    bar.appendChild(block);
  });

  // Animate blocks in
  animate('#cs-bar .cs-block', { scaleY: [0.7, 1], opacity: [0, 1] }, { duration: 0.4, delay: stagger(0.04) });
}

// Toggle existing / proposed in slide 2
const btnExisting   = document.getElementById('btn-existing');
const btnProposedS2 = document.getElementById('btn-proposed-s2');
if (btnExisting) {
  btnExisting.addEventListener('click', () => {
    if (sectionMode === 'existing') return;
    btnExisting.classList.add('active');
    btnProposedS2.classList.remove('active');
    renderCrossSection('existing');
  });
}
if (btnProposedS2) {
  btnProposedS2.addEventListener('click', () => {
    if (sectionMode === 'proposed') return;
    btnProposedS2.classList.add('active');
    btnExisting.classList.remove('active');
    renderCrossSection('proposed');
  });
}

/* ══════════════════════════════════════════
   5. SLIDE 4 — STATIC SECTION BARS
══════════════════════════════════════════ */
function buildStaticSections() {
  buildStaticBar('.cs-existing-static', existingSegs);
  buildStaticBar('.cs-proposed-static', proposedSegs);
}

function buildStaticBar(selector, segs) {
  const bar = document.querySelector(selector);
  if (!bar) return;
  bar.innerHTML = '';
  const total = segs.reduce((s, sg) => s + sg.w, 0);
  segs.forEach(seg => {
    const b = document.createElement('div');
    b.className = `cs-block ${seg.cls}`;
    b.style.flex = `0 0 ${(seg.w / total) * 100}%`;
    b.innerHTML = `<span class="bw" style="font-size:.75rem">${seg.w}m</span>`;
    bar.appendChild(b);
  });
}

/* ══════════════════════════════════════════
   6. SLIDE 3 — ISSUES FILTER & LINKING
══════════════════════════════════════════ */
const filterPills = document.querySelectorAll('.fp');
const issueCards  = document.querySelectorAll('.ic');
const tlSpots     = document.querySelectorAll('.tl-spot');

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const sev = pill.dataset.sev;

    issueCards.forEach(card => {
      const match = sev === 'all' || card.dataset.sev === sev;
      card.classList.toggle('hidden', !match);
      const hs = document.querySelector(`.tl-spot[data-id="${card.dataset.id}"]`);
      if (hs) hs.style.opacity = match ? '1' : '0.2';
    });

    animate('.ic:not(.hidden)', { scale: [0.9, 1], opacity: [0, 1] }, { duration: 0.35, delay: stagger(0.05) });
  });
});

issueCards.forEach(card => {
  const hs = document.querySelector(`.tl-spot[data-id="${card.dataset.id}"]`);
  card.addEventListener('mouseenter', () => {
    issueCards.forEach(c => c.classList.remove('active-ic'));
    card.classList.add('active-ic');
    tlSpots.forEach(s => s.classList.remove('active-hs'));
    if (hs) hs.classList.add('active-hs');
  });
  card.addEventListener('mouseleave', () => {
    card.classList.remove('active-ic');
    if (hs) hs.classList.remove('active-hs');
  });
});

tlSpots.forEach(spot => {
  const card = document.querySelector(`.ic[data-id="${spot.dataset.id}"]`);
  spot.addEventListener('mouseenter', () => {
    tlSpots.forEach(s => s.classList.remove('active-hs'));
    spot.classList.add('active-hs');
    issueCards.forEach(c => c.classList.remove('active-ic'));
    if (card && !card.classList.contains('hidden')) card.classList.add('active-ic');
  });
  spot.addEventListener('mouseleave', () => {
    spot.classList.remove('active-hs');
    if (card) card.classList.remove('active-ic');
  });
});

/* ══════════════════════════════════════════
   7. STATS COUNTER ANIMATION
══════════════════════════════════════════ */
function countUpStats() {
  document.querySelectorAll('.sb-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    if (target === 0) { el.textContent = '0'; return; }
    let count = 0;
    const steps = target;
    const interval = setInterval(() => {
      count++;
      el.textContent = count;
      if (count >= target) clearInterval(interval);
    }, 1200 / steps);
  });
}

/* ══════════════════════════════════════════
   8. INITIALISE
══════════════════════════════════════════ */
function init() {
  scalePresentation();
  window.addEventListener('resize', scalePresentation);

  // Initialise button states
  prevBtn.disabled  = true;
  hdrPrev.disabled  = true;
  nextBtn.disabled  = false;
  hdrNext.disabled  = false;
  nextBtn.classList.add('active-btn');
  progressFill.style.width = `${(1 / TOTAL) * 100}%`;
  curSlideEl.textContent = '1';

  // Run Slide 1 intro
  runSlideAnimation(0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
