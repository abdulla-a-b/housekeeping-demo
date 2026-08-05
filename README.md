# আমার এলাকা · Clean My Area

Housekeeping and hygiene programme for **Good & Fast Packaging Co. Ltd.**
A phone web app that replaces the printed roster: daily assignment, 50-point zone
inspection, standing-water log, and a live KPI screen.

Works offline. Installs to the home screen. Bilingual English / বাংলা.

---

## If your page looks like plain text on a white background

Every heading stacked in Times New Roman, no colour, all screens at once —
that means **the CSS and JS files did not upload**. The HTML arrived, nothing else did.
It is the commonest GitHub Pages problem and it is not a code fault.

**Check it in ten seconds.** Open your repo on github.com. You should see all
these files sitting at the top level, not inside folders:

```
index.html   style.css   config.js   data.js
schedule.js  store.js    app.js      sw.js
manifest.json  icon-192.png  icon-512.png
```

If `style.css` and `app.js` are missing, that is your answer. Upload them.

**Why it happens.** Dragging a folder into GitHub's web uploader often drops or
flattens nested folders like `css/` and `js/`. This version has **no subfolders
at all**, so there is nothing left to lose.

**Still broken?** Open `standalone.html` instead — see the bottom of this page.

---

## What's in here

| File | What it is |
|---|---|
| `index.html` | The app shell |
| `style.css` | The signage design system |
| `config.js` | **← the only file you edit** |
| `data.js` | 29 zones, rotation, gates, criteria, translations |
| `schedule.js` | Date logic — the roster is computed, not stored |
| `store.js` | Device storage + push to Google Sheets |
| `app.js` | Rendering and events |
| `sw.js` | Service worker — makes it work with no signal |
| `manifest.json` | Home-screen install |
| `standalone.html` | Everything in one file — the fallback |
| `Code.gs` | Google Sheets backend (paste into Apps Script) |
| `cma_tools.py` | Roster seeder + monthly Excel report |

Nothing to build. No npm, no bundler, no framework.

---

## Part 1 — Put it on GitHub Pages

### 1. Create the repository

<https://github.com/new> → name it, set **Public**, do not add a README.

### 2. Upload

Click **uploading an existing file**. Now — this is the part that went wrong before:

> **Select all the files, not the folder.**
> Open the folder, press Ctrl+A (or Cmd+A), and drag *the files themselves* into
> the browser. Dragging the folder is what loses things.

Confirm the file list on screen shows `style.css` and `app.js` before you commit.

Commit message: `Initial app` → **Commit changes**.

### 3. Turn on Pages

**Settings → Pages → Source: GitHub Actions**

Watch the **Actions** tab. About a minute. Then open your URL:

```
https://abdulla-a-b.github.io/<your-repo-name>/
```

You should see a black header, a yellow-and-black hazard stripe, and six tabs
along the bottom. If you see plain text, go back to the top of this page.

### 4. Install on a phone

- **Android / Chrome** — menu → *Add to Home screen*
- **iPhone / Safari** — share → *Add to Home Screen*

Opens full screen, no browser bar, works with no signal.

---

## Part 2 — Connect the Google Sheet

Optional. The app works immediately with records saved on the device. Do this
before you rely on the data for an audit.

1. New Google Sheet → **Clean My Area — Records**
2. **Extensions → Apps Script**, paste all of `Code.gs`, save
3. Run `setup` once from the toolbar, authorise. Four tabs appear.
4. **Deploy → New deployment → Web app** — Execute as **Me**, access **Anyone**
5. Copy the `/exec` URL into `config.js` on GitHub:

```js
const API_URL = "https://script.google.com/macros/s/AKfy.../exec";
```

**After any change, bump the cache version in `sw.js`** — `cma-v2` to `cma-v3`.
Otherwise phones keep serving the old version from cache and you will think the
deploy failed.

### Monthly email

In Apps Script, add the Factory Manager and HSE Officer to the `to:` line in
`emailMonthly`. Then clock icon (**Triggers**) → **Add Trigger** → function
`emailMonthly`, time-driven, **month timer**, 1st, 8–9am. It sends itself.

---

## Part 3 — Python (optional)

```bash
python3 cma_tools.py seed --out ./seed
```

Generates the 148-day roster, 6 Aug to 31 Dec 2026, with the November season
switch applied. Import into the Sheet: **File → Import → Upload → Append**.

```bash
python3 cma_tools.py report --csv clean-my-area-2026-08-31.csv --month 2026-08
```

Formatted monthly Excel — only if you need a file for a board pack or audit
response. The Apps Script email covers the routine case. Needs `pip install openpyxl`.

---

## Part 4 — Command line, if you prefer

This never loses folders:

```bash
cd clean-my-area
git init
git add .
git commit -m "Initial app"
git branch -M main
git remote add origin https://github.com/abdulla-a-b/<your-repo-name>.git
git push -u origin main
```

Then **Settings → Pages → Source: GitHub Actions**. Every later push redeploys.

---

## The fallback: `standalone.html`

One file. The CSS and all the JavaScript are welded inside it. There is nothing
external to fail to load.

- Upload just this one file to any repo and open it
- Or email it, or put it on a USB stick, or open it straight from your laptop

It loses only two things: the offline service worker and the home-screen install
(both need real files side by side). Everything else — all six screens, both
languages, the full rotation logic — works identically.

If you are ever unsure whether a problem is the app or the hosting, open
`standalone.html`. If that works, the app is fine and the problem is upload paths.

---

## Before you roll it out

- [ ] Replace the placeholder area owners in `data.js` (the `Z` array) and
      `cma_tools.py` (`ZONES`). Same 29 rows in both.
- [ ] Confirm Saturday is the declared weekly holiday. If it is Friday, change
      the `day===6` check in `schedule.js`.
- [ ] Add the factory public-holiday calendar to the Sheet's roster tab.
- [ ] Set `to:` in `emailMonthly` before enabling the trigger.

---

## Design notes

**The colour strip is the bucket.** Red sanitary, green food, blue medical and
general, yellow production — the same code as the Chemical & PPE register. A
cleaner who cannot read the zone name can still see which set to take.

**Built for a phone in bright light.** Light background, heavy black keylines,
48px minimum tap targets for gloved hands, bottom navigation within thumb reach.
Not dark mode — a dark screen is unreadable next to a factory window.

**The roster is computed, not stored.** `schedule.js` derives every day from the
6-week cycle, the monsoon/dry switch and the third-Thursday training rule. It
keeps producing correct assignments into 2027 and beyond with no new data.

**Two rules live in the interface, not the manual.** It will not save if team
lead and verifier are the same name. It will not save an inspection with any
criterion left unscored.

---

Internal use — Good & Fast Packaging Co. Ltd. and MBBC & Company.
