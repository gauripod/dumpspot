/* ═══════════════════════════════════════
   DUMPSPOT — DETAIL.JS
   Renders a single full report view
═══════════════════════════════════════ */

function renderDetail(r) {
  let photosHTML = '';

  if (r.photos && r.photos.length) {
    const n   = Math.min(r.photos.length, 6);
    const cls = ['', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6'][n] || 'n6';
    photosHTML = `<div class="det-photos ${cls}">
      ${r.photos.slice(0, 6).map((p, i) =>
        `<img class="det-photo dp${i}" src="${p}">`
      ).join('')}
    </div>`;
  } else {
    photosHTML = `<div class="det-nophoto">${ICONS.photo}</div>`;
  }

  const cats = (r.cats || [])
    .map(c => `<div class="det-cat">${catIcon(c)}<span>${c}</span></div>`)
    .join('');

  const types = (r.type || [])
    .map(t => `<span class="det-tag">${t}</span>`)
    .join('');

  const sevs = (r.sev || [])
    .map(s => `<span class="det-tag">${s}</span>`)
    .join('');

  document.getElementById('det-content').innerHTML = `
    ${photosHTML}
    <div class="det-area">${r.area}, ${r.state}</div>
    <div class="det-loc">${r.specific}</div>

    ${cats  ? `<div class="det-sec">
                 <div class="det-sec-label">Category</div>
                 <div class="det-cats">${cats}</div>
               </div>` : ''}

    ${types ? `<div class="det-sec">
                 <div class="det-sec-label">Site type</div>
                 <div class="det-tags">${types}</div>
               </div>` : ''}

    ${sevs  ? `<div class="det-sec">
                 <div class="det-sec-label">Severity</div>
                 <div class="det-tags">${sevs}</div>
               </div>` : ''}

    ${r.notes ? `<div class="det-sec">
                   <div class="det-sec-label">Notes</div>
                   <div class="det-notes">${r.notes}</div>
                 </div>` : ''}

    <div class="det-divider"></div>
    <div class="det-meta-row">
      <span class="det-reporter">Reported by ${r.reporter}</span>
      <span class="det-date">${r.date}</span>
    </div>
  `;
}
