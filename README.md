# DumpSpot

**Post your dump here.**  
A civic garbage-reporting tool. No accounts, no friction — a name, a location, a photo.

---

## What this is

DumpSpot lets anyone pin a garbage spot on a map. People report what they see: a burning heap on the road, a blocked nala, plastic dumped near a school. Reports show up on a live map and a filterable list. The goal is visibility — more reports, more pressure on civic bodies to act.

---

## Tech stack

| Layer          | Tool                                          | Why                                        |
| -------------- | --------------------------------------------- | ------------------------------------------ |
| Frontend       | Vanilla HTML/CSS/JS                           | No build step, no framework, runs anywhere |
| Maps           | [Leaflet.js](https://leafletjs.com/) v1.9.4   | Open source, lightweight, works offline    |
| Map tiles      | OpenStreetMap standard                        | Free, English labels, neutral grey         |
| Fonts          | Google Fonts (Unbounded, Space Mono, DM Sans) |                                            |
| Backend (next) | [Supabase](https://supabase.com)              | Postgres + Storage + Auth, free tier       |

---

## Design system

### Palette

```
--bg   #07090a   Near-black with a hint of blue-grey (base)
--s1   #0e1114   Surface 1 (nav, cards)
--s2   #141820   Surface 2 (inputs, thumbnails)
--s3   #1a1f28   Surface 3 (dark fills)
--b1   #1e2530   Border subtle
--b2   #28333f   Border default
--b3   #334050   Border emphasis
--tx   #dde4ee   Text primary
--mu   #5a6878   Text muted
--fa   #303b48   Text faint / placeholder
--pk   #ff2d78   Accent — neon pink (logos, highlights, CTAs only)
```

### Typography

| Role                       | Font       | Weight  | Size        |
| -------------------------- | ---------- | ------- | ----------- |
| Logo, page titles          | Unbounded  | 900     | 1–2.1rem    |
| Labels, tags, dates, meta  | Space Mono | 400/700 | 0.56–0.7rem |
| Body, inputs, descriptions | DM Sans    | 400/500 | 0.82–0.9rem |

### Interaction rules

- **Hover**: border lifts from `--b1` → `--b2`, no background flash
- **Selected / active**: `--pk10` background + `--pk35` border
- **Focus ring**: `box-shadow: 0 0 0 3px var(--pk10)`
- **Button press**: `scale(0.99)` on primary buttons only
- **Pink glow**: only on the submit button and the logo title — nowhere else

### Icons

All icons are inline SVG, `stroke="currentColor"`, `fill="none"`, `stroke-width="1.5"`.

| Category               | Icon shape       |
| ---------------------- | ---------------- |
| Plastic / Food / Mixed | Bin (trash can)  |
| Burning garbage        | Flame            |
| Nala / Sewage          | Water drop       |
| Construction debris    | Brick stack      |
| E-waste                | Bolt / lightning |
| Medical waste          | Cross            |
| Animal waste           | Bone             |

---

## File structure

```
dumpspot/
├── index.html      # Shell: nav, all page containers, script/style imports
├── global.css      # Design tokens, reset, nav, shared components (tags, chips, buttons)
├── feed.css        # Feed page: toolbar, map pins, popups, list cards
├── report.css      # Report page: step accordion, upload area
├── detail.css      # Detail page: photo grid, report layout
├── main.js         # Icons, categories, seed data, page routing, anti-copy
├── feed.js         # Map init, markers, list render, filters, view toggle
├── detail.js       # renderDetail() — builds the full report view
└── report.js       # Steps, tags, category cards, upload, submit, reset
```

**Load order in index.html**: `main.js` → `detail.js` → `feed.js` → `report.js`  
(main.js must be first — everything else depends on `ICONS`, `CATS`, `reports`, `goPage`)

---

## What's mocked right now

- `reports` array in `main.js` is in-memory seed data
- Photos are `blob:` URLs (created from local files, gone on refresh)
- `lat/lng` on new submissions are random (near India)
- No persistence — refresh = back to seed data

---

## Supabase integration (next step)

### Tables needed

```sql
-- reports
create table reports (
  id          uuid primary key default gen_random_uuid(),
  reporter    text not null,
  state       text not null,
  area        text not null,
  specific    text not null,
  type        text[],
  cats        text[],
  sev         text[],
  notes       text,
  lat         float8,
  lng         float8,
  created_at  timestamptz default now()
);

-- photos (linked to reports)
create table photos (
  id          uuid primary key default gen_random_uuid(),
  report_id   uuid references reports(id) on delete cascade,
  url         text not null,
  created_at  timestamptz default now()
);
```

### Storage bucket

- Bucket name: `report-photos`
- Public read access: yes
- Upload via: `supabase.storage.from('report-photos').upload(path, file)`

### What to swap in code

1. **`main.js`** — replace `SEED` fetch with `supabase.from('reports').select('*, photos(*)')`
2. **`report.js` `submitReport()`** — POST to `reports` table, upload photos to storage, insert rows into `photos`
3. **`feed.js` `buildStateFilter()`** — derive states from live data instead of seed

---

## Anti-copy

Right-click, Ctrl+U, Ctrl+S, Ctrl+A, and F12 are blocked via JS in `main.js`.  
Text selection is disabled globally via CSS (`user-select: none`) except in form inputs.

---

## Notes

- Map tiles are from OpenStreetMap, English labels only. Language switching is not implemented yet — planned for a later version.
- Coordinates for new reports are currently randomised. Real implementation needs either browser geolocation (`navigator.geolocation`) or a geocoding API (Nominatim is free, no key needed).
