# Welder Bid Tracker

Offline-first Expo (React Native) MVP for independent welder fabricators.

## Features
- Fast quoting: materials + labor (hours x rate) + optional markup %
- Job list with statuses: Quoted -> Won -> In Progress -> Done -> Invoiced / Lost
- AsyncStorage persistence
- Job detail/edit, notes, created date
- Shareable invoice summary
- Industrial dark UI

## Requirements
- Node.js 18+ (Node 20 LTS recommended for Expo 49)
- npm 9+
- Expo Go or an emulator/simulator

## Windows PowerShell

```powershell
cd $env:USERPROFILE\Downloads\welder-bid-tracker
npm install
npx expo start
```

Then press `a` for Android, `i` for iOS (Mac), `w` for web, or scan the QR code with Expo Go.

## macOS / Linux

```bash
cd ~/Downloads/welder-bid-tracker
npm install
npx expo start
```

## Project structure

App.js, app.json, components/, constants/, screens/, utils/

## Flow

1. Create a quote and save
2. Advance status on the job detail screen
3. Share invoice summary

## Remote

https://github.com/cl82salazar-wq/welder-bid-tracker.git

## Notes

- Do not commit node_modules/ or .expo/.
- The old erroneous `exp` dependency was removed.

## Windows + Node 24 note

This machine currently has Node v24. Expo SDK 49 Metro can fail on Windows with an ENOENT mkdir under .expo/metro/externals for builtin ids that contain a colon (illegal in Windows paths).

This repo includes scripts/patch-expo-windows.js (auto-run after dependency install) to strip those ids. Prefer Node 20 LTS for the smoothest Expo 49 experience.
