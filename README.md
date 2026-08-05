# আমার এলাকা · Clean My Area

Housekeeping and hygiene programme for **Good & Fast Packaging Co. Ltd.**
A phone web app that replaces the printed roster: daily assignment, 50-point zone
inspection, standing-water log, and a live KPI screen.

Works offline. Installs to the home screen. Bilingual English / বাংলা.

---

## What's in here

```
clean-my-area/
├── index.html              the app shell
├── config.js               ← the only file you edit
├── css/style.css           the signage design system
├── js/
│   ├── data.js             29 zones, rotation, gates, criteria, translations
│   ├── schedule.js         date logic — the roster is computed, not stored
│   ├── store.js            device storage + push to Google Sheets
│   └── app.js              rendering and events
├── sw.js                   service worker — makes it work with no signal
├── manifest.json           home-screen install
├── apps-script/Code.gs     Google Sheets backend
├── python/cma_tools.py     roster seeder + monthly Excel report
└── .github/workflows/      auto-deploy on every push
```

Nothing to build. No npm, no bundler, no framework. Push the files and they are the site.

---

## Part 1 — Put it on GitHub Pages

### 1. Create the repository

Go to <https://github.com/new>.

- Repository name: `clean-my-area`
- **Public** (Pages is free only on public repos for personal accounts)
- Do **not** tick "Add a README" — you already have one

Create repository.

### 2. Upload the files

On the empty repo page, click **uploading an existing file**.

Drag the whole `clean-my-area` folder in. GitHub keeps the folder structure.
Commit message: `Initial app`. Click **Commit changes**.

> If drag-and-drop misses the hidden `.nojekyll` and `.github` folder, use the
> command line instead — see [Part 4](#part-4--command-line-if-you-prefer).
> `.nojekyll` matters: without it GitHub ignores files starting with `_`.

### 3. Turn on Pages

**Settings → Pages**

- Source: **GitHub Actions**

That's it. The workflow in `.github/workflows/pages.yml` runs automatically.
Watch it under the **Actions** tab — about a minute.

Your app is now live at:

```
https://abdulla-a-b.github.io/clean-my-area/
```

### 4. Install it on a phone

Open that URL on the phone.

- **Android / Chrome** — menu → *Add to Home screen*
- **iPhone / Safari** — share → *Add to Home Screen*

It opens full screen with no browser bar and works with no signal.

---

## Part 2 — Connect the Google Sheet

Skip this to start. The app works immediately with records on the device.
Do it before you rely on the data for anything that matters.

### 1. Create the sheet

New Google Sheet → name it **Clean My Area — Records**.

### 2. Add the backend

**Extensions → Apps Script.** Delete the placeholder code, paste all of
`apps-script/Code.gs`, save.

Run the `setup` function once from the toolbar. Authorise when Google asks.
Four tabs appear: `roster`, `inspection`, `vector`, `layer1`.

### 3. Publish it

**Deploy → New deployment → Web app**

| Setting | Value |
|---|---|
| Execute as | **Me** |
| Who has access | **Anyone** |

Copy the `/exec` URL.

### 4. Point the app at it

In GitHub, open `config.js` → pencil icon → paste your URL:

```js
const API_URL = "https://script.google.com/macros/s/AKfy.../exec";
```

Commit. The workflow redeploys in about a minute. Every save now lands in the Sheet.

> **After any change**, bump the cache version in `sw.js` — change `cma-v1` to
> `cma-v2`. Otherwise phones keep serving the old version from cache.

### 5. Monthly email

In Apps Script, edit the `to:` line in `emailMonthly` to add the Factory Manager
and HSE Officer. Then: clock icon (**Triggers**) → **Add Trigger** →
function `emailMonthly`, time-driven, **month timer**, 1st, 8–9am.

The monthly summary now sends itself. No laptop, no Python.

---

## Part 3 — Python (optional)

Two jobs the browser shouldn't do.

**Seed the sheet** — generates the 148-day roster, 6 Aug to 31 Dec 2026, with the
November season switch already applied:

```bash
python3 python/cma_tools.py seed --out ./seed
```

Then in the Sheet: **File → Import → Upload → Append to current sheet**.

**Formatted monthly report** — only if you need a file to attach to a board pack
or an audit response. The Apps Script email covers the routine case.

```bash
python3 python/cma_tools.py report --csv clean-my-area-2026-08-31.csv --month 2026-08
```

Needs `openpyxl`: `pip install openpyxl`

---

## Part 4 — Command line, if you prefer

```bash
cd clean-my-area
git init
git add .
git commit -m "Initial app"
git branch -M main
git remote add origin https://github.com/abdulla-a-b/clean-my-area.git
git push -u origin main
```

Then **Settings → Pages → Source: GitHub Actions**.

To update later:

```bash
git add .
git commit -m "Real area owners"
git push
```

Every push redeploys automatically.

---

## Before you roll it out

- [ ] Replace the placeholder area owners in `js/data.js` (the `Z` array) and
      `python/cma_tools.py` (`ZONES`). Same 29 rows in both files.
- [ ] Confirm Saturday is the declared weekly holiday. If it's Friday, change
      the `day===6` check in `js/schedule.js`.
- [ ] Add the factory public-holiday calendar to the Sheet's roster tab.
- [ ] Set `to:` in `emailMonthly` before enabling the trigger.

---

## Design notes

**The colour strip is the bucket.** Red sanitary, green food, blue medical and
general, yellow production — the same code as the Chemical & PPE register. A
cleaner who cannot read the zone name can still see which set to take. Colour
carries meaning here; it is not decoration.

**Built for a phone in bright light.** Light background, heavy black keylines,
48px minimum tap targets for gloved hands, bottom navigation within thumb reach.
Not dark mode — a dark screen is unreadable next to a factory window.

**The roster is computed, not stored.** `js/schedule.js` derives every day from
the 6-week cycle, the monsoon/dry switch and the third-Thursday training rule.
It keeps producing correct assignments into 2027 and beyond with no new data.

**Two rules live in the interface, not the manual.** It will not save if team
lead and verifier are the same name. It will not save an inspection with any
criterion left unscored.

---

## Licence

Internal use, Good & Fast Packaging Co. Ltd. and MBBC & Company.
