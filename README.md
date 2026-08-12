# Welder Bid Tracker

Offline-first Expo (React Native) MVP for independent welder fabricators. Quote a job, track status, and share an invoice summary. Data stays on the device (AsyncStorage). No backend required.

## Requirements

- **Node.js 20 LTS** (recommended for Expo SDK 49)
- npm 9+
- Expo Go, or an iOS Simulator / Android emulator

Node 18+ can work. Prefer 20; see [Windows + Node 24](#windows--node-24) if you are on a newer Node.

## Run

Clone the repo and use this feature branch until the MVP is merged:

```bash
git clone https://github.com/cl82salazar-wq/welder-bid-tracker.git
cd welder-bid-tracker
git checkout feature/welder-mvp
npm install
npm start
```

Then in the Expo CLI:

- `a` — Android
- `i` — iOS (macOS)
- `w` — web
- or scan the QR code with **Expo Go**

### Windows (PowerShell)

Same steps from the repo folder:

```powershell
git clone https://github.com/cl82salazar-wq/welder-bid-tracker.git
cd welder-bid-tracker
git checkout feature/welder-mvp
npm install
npm start
```

Optional: `npm run android`, `npm run ios`, or `npm run web`.

## Windows + Node 24

Expo SDK 49 Metro can fail on Windows under Node 22/24 with `ENOENT` while creating folders under `.expo/metro/externals`. Some Node builtin ids contain a colon (for example `node:sea`), which is illegal in Windows paths.

This repo includes `scripts/patch-expo-windows.js`, which runs automatically after `npm install` (`postinstall`) and strips those ids. **Prefer Node 20 LTS** for the smoothest Expo 49 experience:

```bash
nvm install 20
nvm use 20
```

## App flow

1. Create a quote: materials + labor (hours × rate) + optional markup %, then save.
2. Open the job and advance status: Quoted → Won → In Progress → Done → Invoiced / Lost.
3. Share an invoice summary from the job detail screen.

## Project structure

```
App.js                 navigation + persistence
app.json               Expo config
components/            UI primitives
constants/             theme + job statuses
screens/               list, quote, job detail
utils/                 quote math, invoice text, AsyncStorage
scripts/               Windows Expo Metro patch + CI syntax check
.github/workflows/     GitHub Actions (npm ci + syntax check)
```

## Notes

- Do not commit `node_modules/` or `.expo/`.
- CI uses Node 20 on Ubuntu and Windows (`npm ci` + `npm run ci:check`).
