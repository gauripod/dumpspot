/* ═══════════════════════════════════════
   DUMPSPOT — FEED.JS
   Map init, markers, list render,
   filters (state / area / category),
   map ↔ list view toggle
═══════════════════════════════════════ */

let map, mLayer;
let curView = 'map';
let activeFiltered = [];

// ── MAP INIT ──
function initMap() {
  map = L.map('map', { zoomControl: true, scrollWheelZoom: true })
         .setView([20.5937, 78.9629], 5);

  // OpenStreetMap standard tiles — English labels, neutral grey-beige
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    // Grey tint via CSS in global.css (.leaflet-tile)
  }).addTo(map);

  // Grey tint applied via CSS: .leaflet-tile { filter: grayscale(1) brightness(0.88) contrast(1.05); }
  mLayer = L.layerGroup().addTo(map);

  buildCatFilter();
  buildStateFilter();
  applyFilters();
}

// ── PIN ICON ──
function makePinIcon(cats) {
  return L.divIcon({
    className: '',
    html: `<div class="dpin">${pinIcon(cats)}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32],
  });
}

// ── MARKERS ──
function renderMarkers(data) {
  mLayer.clearLayers();
  data.forEach(r => {
    const m = L.marker([r.lat, r.lng], { icon: makePinIcon(r.cats) }).addTo(mLayer);
    m.bindPopup(buildPopupHTML(r), { maxWidth: 270, minWidth: 220 });
    m.on('popupopen', () => {
      const btn = document.getElementById('pu-btn-' + r.id);
      if (btn) btn.onclick = () => openDetail(r.id);
    });
  });
}

function buildPopupHTML(r) {
  const imgEl = r.photos && r.photos.length
    ? `<div class="pu-img"><img src="${r.photos[0]}"></div>`
    : `<div class="pu-img">${ICONS.photo}</div>`;
  const cats = (r.cats || [])
    .map(c => `<span class="pu-cat">${catIcon(c)}<span>${c}</span></span>`)
    .join('');
  return `<div>
    ${imgEl}
    <div class="pu-body">
      <div class="pu-loc">${r.specific}</div>
      <div class="pu-area">${r.area}, ${r.state}</div>
      ${cats ? `<div class="pu-cats">${cats}</div>` : ''}
      ${r.notes ? `<div class="pu-notes">${r.notes}</div>` : ''}
      <div class="pu-meta">
        <span class="pu-by">by ${r.reporter}</span>
        <span class="pu-date">${r.date}</span>
      </div>
      <button class="pu-link" id="pu-btn-${r.id}">View full report →</button>
    </div>
  </div>`;
}

// ── LIST ──
function renderList(data) {
  const el = document.getElementById('list-inner');
  if (!data.length) {
    el.innerHTML = '<div class="lempty">No spots match this filter.</div>';
    return;
  }
  el.innerHTML = data.map(r => {
    const thumb = r.photos && r.photos.length
      ? `<img src="${r.photos[0]}">`
      : pinIcon(r.cats);
    const chips = (r.cats || [])
      .map(c => `<span class="chip">${catIcon(c)}<span>${c}</span></span>`)
      .join('');
    return `<div class="lcard" onclick="openDetail(${r.id})">
      <div class="lcard-thumb">${thumb}</div>
      <div class="lcard-body">
        <div class="lcard-loc">${r.specific}</div>
        <div class="lcard-area">${r.area}, ${r.state}</div>
        <div class="lcard-chips">${chips}</div>
        <div class="lcard-foot">
          <span class="lcard-by">by ${r.reporter}</span>
          <span class="lcard-date">${r.date}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── FILTERS ──
function buildStateFilter() {
  const el = document.getElementById('fs-state');
  [...new Set(reports.map(r => r.state))].sort().forEach(s => {
    const o = document.createElement('option');
    o.value = s; o.textContent = s;
    el.appendChild(o);
  });
}

function buildCatFilter() {
  const el = document.getElementById('fs-cat');
  CATS.forEach(c => {
    const o = document.createElement('option');
    o.value = c.key; o.textContent = c.label;
    el.appendChild(o);
  });
}

function applyFilters() {
  const state = document.getElementById('fs-state').value;
  const cat   = document.getElementById('fs-cat').value;

  // Rebuild area dropdown based on selected state
  const areaEl  = document.getElementById('fs-area');
  const prevArea = areaEl.value;
  areaEl.innerHTML = '<option value="">All areas</option>';
  [...new Set(
    reports.filter(r => !state || r.state === state).map(r => r.area)
  )].sort().forEach(a => {
    const o = document.createElement('option');
    o.value = a; o.textContent = a;
    areaEl.appendChild(o);
  });
  if (prevArea) areaEl.value = prevArea;
  const area = areaEl.value;

  const filtered = reports.filter(r => {
    if (state && r.state !== state) return false;
    if (area  && r.area  !== area)  return false;
    if (cat   && !(r.cats || []).includes(cat)) return false;
    return true;
  });

  activeFiltered = filtered;
  document.getElementById('cnt-n').textContent = filtered.length;
  renderMarkers(filtered);
  renderList(filtered);
}

// ── VIEW TOGGLE ──
function setView(v) {
  curView = v;
  document.getElementById('map-wrap').style.display  = v === 'map'  ? 'flex'  : 'none';
  document.getElementById('list-wrap').classList.toggle('on', v === 'list');
  document.getElementById('btn-map').classList.toggle('on',  v === 'map');
  document.getElementById('btn-list').classList.toggle('on', v === 'list');
  if (v === 'map' && map) setTimeout(() => map.invalidateSize(), 60);
}

// ── SIZING ──
function sizeViews() {
  const tb = document.querySelector('.toolbar');
  const h  = window.innerHeight - 52 - (tb ? tb.offsetHeight : 40);
  document.getElementById('map-wrap').style.height  = h + 'px';
  document.getElementById('list-wrap').style.height = h + 'px';
}

window.addEventListener('resize', sizeViews);
