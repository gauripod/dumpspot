/* ═══════════════════════════════════════
   DUMPSPOT — REPORT.JS
   Step accordion, tag/category selection,
   photo upload, form submit
═══════════════════════════════════════ */

// ── STATE ──
const selTags = { type: [], sev: [] };
const selCats = [];
const upFiles = [];

// ── STEP ACCORDION ──
function toggleStep(id) {
  document.getElementById(id).classList.toggle('open');
}

function nextStep(cur, nxt) {
  document.getElementById(cur).classList.add('done');
  document.getElementById(cur).classList.remove('open');
  document.getElementById(nxt).classList.add('open');
  document.getElementById(nxt).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── TAG SELECTION ──
function initTags() {
  document.querySelectorAll('.tag').forEach(t => {
    t.addEventListener('click', () => {
      const g = t.dataset.g;
      t.classList.toggle('on');
      const v = t.textContent;
      if (t.classList.contains('on')) {
        selTags[g].push(v);
      } else {
        selTags[g] = selTags[g].filter(x => x !== v);
      }
    });
  });
}

// ── CATEGORY CARDS ──
function buildCatCards() {
  const grid = document.getElementById('cgrid');
  grid.innerHTML = CATS.map(c => `
    <div class="ccard" data-cat="${c.key}" onclick="toggleCat(this,'${c.key}')">
      <div class="ccard-ico">${ICONS[c.icon]}</div>
      <div class="ccard-lbl">${c.label}</div>
    </div>`
  ).join('');
}

function toggleCat(el, key) {
  el.classList.toggle('on');
  if (el.classList.contains('on')) {
    selCats.push(key);
  } else {
    const i = selCats.indexOf(key);
    if (i > -1) selCats.splice(i, 1);
  }
}

// ── UPLOAD ──
function initUpload() {
  const upArea  = document.getElementById('uparea');
  const upInput = document.getElementById('photo-input');

  upArea.addEventListener('dragover', e => { e.preventDefault(); upArea.classList.add('drag'); });
  upArea.addEventListener('dragleave', () => upArea.classList.remove('drag'));
  upArea.addEventListener('drop', e => {
    e.preventDefault();
    upArea.classList.remove('drag');
    addFiles([...e.dataTransfer.files]);
  });
  upInput.addEventListener('change', () => {
    addFiles([...upInput.files]);
    upInput.value = '';
  });
}

function addFiles(fs) {
  fs.forEach(f => {
    if (upFiles.length < 6 && f.type.startsWith('image/')) upFiles.push(f);
  });
  renderPreviews();
}

function renderPreviews() {
  const pGrid  = document.getElementById('pgrid');
  const upCnt  = document.getElementById('upcount');
  const upArea  = document.getElementById('uparea');
  const upInput = document.getElementById('photo-input');

  pGrid.innerHTML = '';
  if (!upFiles.length) {
    pGrid.style.display = 'none';
    upCnt.textContent = '';
    return;
  }
  pGrid.style.display = 'grid';
  upFiles.forEach((f, i) => {
    const d   = document.createElement('div'); d.className = 'pitem';
    const img = document.createElement('img'); img.src = URL.createObjectURL(f);
    const btn = document.createElement('button'); btn.className = 'prm'; btn.textContent = '✕';
    btn.onclick = () => { upFiles.splice(i, 1); renderPreviews(); };
    d.appendChild(img); d.appendChild(btn); pGrid.appendChild(d);
  });
  upCnt.textContent = `${upFiles.length}/6 photo${upFiles.length > 1 ? 's' : ''}`;
  const full = upFiles.length >= 6;
  upInput.disabled       = full;
  upArea.style.opacity   = full ? '0.5' : '1';
  upArea.style.pointerEvents = full ? 'none' : '';
}

// ── SUBMIT ──
function submitReport() {
  const name     = document.getElementById('rname').value.trim();
  const state    = document.getElementById('rstate').value.trim();
  const area     = document.getElementById('rarea').value.trim();
  const specific = document.getElementById('rspec').value.trim();

  if (!name || !state || !area || !specific) {
    alert('Name, state, area and specific location are required.');
    return;
  }
  if (!upFiles.length) {
    alert('Please add at least one photo.');
    return;
  }

  const r = {
    id:       Date.now(),
    reporter: name,
    state, area, specific,
    type:    [...selTags.type],
    cats:    [...selCats],
    sev:     [...selTags.sev],
    notes:   document.getElementById('rnotes').value.trim(),
    photos:  upFiles.map(f => URL.createObjectURL(f)),
    // TODO: replace random coords with Supabase + real geocoding
    lat: 20.5937 + (Math.random() - 0.5) * 14,
    lng: 78.9629 + (Math.random() - 0.5) * 14,
    date: new Date().toISOString().split('T')[0],
  };

  // Push to global store
  reports.push(r);

  // Update state filter dropdown if new state
  const stateEl = document.getElementById('fs-state');
  if (![...stateEl.options].find(o => o.value === state)) {
    const o = document.createElement('option');
    o.value = state; o.textContent = state;
    stateEl.appendChild(o);
  }

  // Refresh feed
  applyFilters();

  // Show success
  document.getElementById('form-screen').style.display = 'none';
  document.getElementById('succ').classList.add('on');
}

// ── RESET ──
function resetForm() {
  ['rname','rstate','rarea','rspec','rnotes'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.querySelectorAll('.tag.on').forEach(t => t.classList.remove('on'));
  document.querySelectorAll('.ccard.on').forEach(c => c.classList.remove('on'));
  Object.keys(selTags).forEach(k => selTags[k] = []);
  selCats.length = 0;
  upFiles.length = 0;
  renderPreviews();

  document.getElementById('form-screen').style.display = '';
  document.getElementById('succ').classList.remove('on');
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('open', 'done');
    if (i === 0) s.classList.add('open');
  });

  const upArea  = document.getElementById('uparea');
  const upInput = document.getElementById('photo-input');
  upInput.disabled = false;
  upArea.style.opacity = '1';
  upArea.style.pointerEvents = '';
}

// ── INIT ──
function initReport() {
  buildCatCards();
  initTags();
  initUpload();
}
