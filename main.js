/* ═══════════════════════════════════════
   DUMPSPOT — MAIN.JS
   Shared: icons, categories, seed data,
   page routing, anti-copy guard
═══════════════════════════════════════ */

// ── ANTI-COPY (browser) ──
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (
    (e.ctrlKey || e.metaKey) && ['u','s','a'].includes(e.key.toLowerCase())
  ) e.preventDefault();
  if (e.key === 'F12') e.preventDefault();
});

// ── SVG ICONS ──
const ICONS = {
  bin:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>`,
  flame: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2c0 0-4 4-4 8a4 4 0 008 0c0-2-1-4-1-4s-1 3-3 3-2-2-2-2 2-1 2-5z"/></svg>`,
  drop:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3L5 14a7 7 0 0014 0L12 3z"/></svg>`,
  brick: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="5" rx="1"/><rect x="2" y="12" width="9" height="5" rx="1"/><rect x="13" y="12" width="9" height="5" rx="1"/></svg>`,
  bolt:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>`,
  cross: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="9" y="2" width="6" height="20" rx="1"/><rect x="2" y="9" width="20" height="6" rx="1"/></svg>`,
  bone:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h10M5 7v10M19 7v10M7 19h10"/></svg>`,
  photo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
};

// ── CATEGORIES ──
const CATS = [
  { key: 'Plastic waste',    icon: 'bin',   label: 'Plastic'      },
  { key: 'Food waste',       icon: 'bin',   label: 'Food waste'   },
  { key: 'Construction',     icon: 'brick', label: 'Debris'       },
  { key: 'Nala / Sewage',    icon: 'drop',  label: 'Nala / Sewage'},
  { key: 'Burning garbage',  icon: 'flame', label: 'Burning'      },
  { key: 'E-waste',          icon: 'bolt',  label: 'E-waste'      },
  { key: 'Medical waste',    icon: 'cross', label: 'Medical'      },
  { key: 'Animal waste',     icon: 'bone',  label: 'Animal'       },
  { key: 'Mixed / general',  icon: 'bin',   label: 'Mixed'        },
];

function catIcon(key) {
  const c = CATS.find(x => x.key === key);
  return c ? ICONS[c.icon] : ICONS.bin;
}
function pinIcon(cats) {
  if (!cats || !cats.length) return ICONS.bin;
  return catIcon(cats[0]);
}

// ── SEED DATA ──
// Replace photos: [] with Supabase URLs when integrating
const SEED = [
  { id:1, reporter:"Arjun M.",  state:"Maharashtra", area:"Pune",      specific:"FC Road near Goodluck Café",       type:["Road"],         cats:["Plastic waste","Food waste"],          sev:["Moderate"],       notes:"Overflowing since 3 days",                 photos:[], lat:18.5204, lng:73.8567, date:"2026-03-18" },
  { id:2, reporter:"Divya K.",  state:"Karnataka",   area:"Bengaluru", specific:"Koramangala 5th Block drain",      type:["Nala / Drain"], cats:["Nala / Sewage"],                       sev:["Severe"],         notes:"Black water spilling onto road",            photos:[], lat:12.9352, lng:77.6245, date:"2026-03-17" },
  { id:3, reporter:"Ravi T.",   state:"Tamil Nadu",  area:"Chennai",   specific:"Anna Nagar market back lane",      type:["Market"],       cats:["Food waste","Mixed / general"],        sev:["Moderate"],       notes:"",                                         photos:[], lat:13.0850, lng:80.2101, date:"2026-03-19" },
  { id:4, reporter:"Sneha P.",  state:"Delhi",       area:"Shahdara",  specific:"Near Govt school gate",            type:["Near school"],  cats:["Plastic waste"],                       sev:["Minor"],          notes:"Kids walk through this daily",             photos:[], lat:28.6729, lng:77.2946, date:"2026-03-15" },
  { id:5, reporter:"Mohan R.",  state:"Telangana",   area:"Hyderabad", specific:"Begumpet footpath",                type:["Footpath"],     cats:["Construction"],                        sev:["Blocking road"],  notes:"Cannot walk on footpath at all",           photos:[], lat:17.4435, lng:78.4685, date:"2026-03-20" },
  { id:6, reporter:"Priya S.",  state:"West Bengal", area:"Kolkata",   specific:"Park Street side lane",            type:["Footpath"],     cats:["Mixed / general"],                     sev:["Moderate"],       notes:"",                                         photos:[], lat:22.5497, lng:88.3554, date:"2026-03-16" },
  { id:7, reporter:"Kiran B.",  state:"Rajasthan",   area:"Jaipur",    specific:"Sindhi Camp bus stand back",       type:["Road"],         cats:["Burning garbage"],                     sev:["Severe"],         notes:"Burning since morning, thick smoke",        photos:[], lat:26.9124, lng:75.7873, date:"2026-03-20" },
  { id:8, reporter:"Meena T.",  state:"Gujarat",     area:"Ahmedabad", specific:"Maninagar nala overflow",          type:["Nala / Drain"], cats:["Nala / Sewage"],                       sev:["Severe"],         notes:"",                                         photos:[], lat:22.9950, lng:72.6031, date:"2026-03-19" },
];

// ── GLOBAL REPORT STORE ──
// In production, replace with Supabase queries
let reports = [...SEED];

// ── PAGE ROUTING ──
let prevPage = 'pg-feed';

function goPage(id, from) {
  document.querySelectorAll('.pg').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.ntab').forEach(t => t.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  if (id === 'pg-feed')   document.querySelectorAll('.ntab')[0].classList.add('on');
  if (id === 'pg-report') document.querySelectorAll('.ntab')[1].classList.add('on');
  if (from) prevPage = from;
  if (id === 'pg-feed' && typeof map !== 'undefined' && map) {
    setTimeout(() => map.invalidateSize(), 60);
  }
  window.scrollTo(0, 0);
}

function goBack() {
  goPage(prevPage || 'pg-feed');
}

function openDetail(id) {
  const r = reports.find(x => x.id === id);
  if (!r) return;
  prevPage = 'pg-feed';
  renderDetail(r);
  goPage('pg-detail');
}
