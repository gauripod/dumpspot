# DumpSpot

**Post your dump here.**
A civic garbage-reporting tool. No accounts, no friction — a name, a location, a photo. Reports go live on the map immediately.

---

## What's built

**Feed — Map view**

- Interactive map, country-level default zoom, auto-centers to viewer's location via silent IP lookup
- Category SVG pins per garbage type, popup with photo + details + link to full report
- Filters by state, area, category — updates map and list simultaneously

**Feed — List view**

- Chronological grouping: Today / Yesterday / This Week / older by month
- Alternating left/right headings per group
- Row cards with location, area, category chips, reporter name, local timestamp

**Report form**

- 3-column layout on desktop, single column on mobile
- Location autocomplete via Nominatim (OpenStreetMap), no API key required
- 9 garbage category icon cards + type of site tags + severity tags
- Photo upload — drag/drop, up to 6, auto-compressed to WebP 1280px 82% quality in browser before upload

**Detail page**

- Mirrors report form layout exactly
- Mini map with location circle highlight
- Report ID, submitted time in viewer's local timezone (original IST shown in brackets for non-India viewers)

---

## Stack

| Layer           | What                                          |
| --------------- | --------------------------------------------- |
| Frontend        | HTML + CSS + JS — no framework, no build step |
| Maps            | Leaflet.js v1.9.4                             |
| Map tiles       | CartoDB Voyager                               |
| Location search | Nominatim (OpenStreetMap)                     |
| IP geolocation  | ipapi.co — silent, no prompt                  |
| Fonts           | Playfair Display · Space Mono · DM Sans       |
| Backend         | Postgres + object storage                     |
| Hosting         | Netlify                                       |

---

## Design system

### Palette

```
--bg    #070c07   base
--s1    #0d140d   nav / card surface
--s2    #111a11   inputs / fields
--b1    #1a2a1a   border subtle
--b2    #243624   border default
--b3    #2e452e   border emphasis
--tx    #ddeedd   text primary
--mu    #527052   text muted
--fa    #2e422e   text faint
--pk    #ff2d78   accent pink
```

### Typography

| Role                              | Font             | Style     |
| --------------------------------- | ---------------- | --------- |
| Logo · headings · submit button   | Playfair Display | Italic    |
| Labels · tags · meta · timestamps | Space Mono       | Regular   |
| Body · inputs                     | DM Sans          | 400 / 500 |

### Section label colors

- Location / Notes → `#6a9a8a`
- Type of site → `#8a7a4a`
- Severity → `#8a5a6a`
- Garbage category → `#4a7a8a`

---

## Files

```
index.html       markup + script imports
style.css        all styles
app.js           all logic
config.js        credentials — gitignored, never pushed
favicon.svg      bin icon
netlify.toml     build command
.gitignore
```

---

## Database schema

Two tables:

```sql
create table reports (
  id          text primary key,
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
  ts          timestamptz default now()
);

create table report_photos (
  id          uuid primary key default gen_random_uuid(),
  report_id   text references reports(id) on delete cascade,
  url         text not null,
  position    int
);
```
---

## Config

`config.js` — create locally, never commit:

```js
const DB_URL = "your_db_url";
const DB_KEY = "your_publishable_key";
const LOCK_INSPECT_ENV = false;
```

Set `LOCK_INSPECT_ENV = true` on production to disable right-click and devtools.

### Netlify env vars

- `DB_URL`
- `DB_KEY`
- `LOCK_INSPECT_ENV` → `true`

`netlify.toml` generates `config.js` from these at build time.

---

## Running locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

---

## Report ID format

`DS-YYYYMMDD-HHMMSS-XXXX` — date, time, 4-char hex. Unique, immutable, shown on success screen and detail page.

---

## What's not built yet

- No auth — reporter name is a plain text field
- No report moderation or flagging
- No map clustering for dense areas
- No editing or deleting reports after submit
- Coordinates fall back to random if location is typed manually without selecting from autocomplete
