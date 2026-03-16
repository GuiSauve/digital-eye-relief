# Digital Eye Relief

A Chrome extension that helps reduce digital eye strain by following the **20-20-20 rule**: every 20 minutes of screen time, look at something 20 feet (6 meters) away for 20 seconds.

[Install on Chrome Web Store](https://chrome.google.com/webstore) · [Live Website](https://digitaleyerelief.com)

---

## Features

- **Smart Timer** — tracks your work sessions using Chrome's Alarms API, runs silently in the background
- **Flexible Notifications** — choose between full-screen modal, system notification, or quiet badge indicator
- **Customizable** — set your own focus duration (5–60 min) and break duration (10–60 sec)
- **Sound Alerts** — optional calming sounds (bells or singing bowl) with volume control
- **Meeting Mode** — silences sound while keeping visual alerts active
- **New Tab Override** — see your timer every time you open a new tab
- **Multi-language** — English, French, Spanish, German
- **Privacy First** — zero data collection, no analytics, everything runs locally

---

## How It Works

1. Click the extension icon in your Chrome toolbar
2. Press the Play button to start your focus session
3. Work normally — the timer runs in the background
4. After 20 minutes, you get a reminder to look away
5. Look at something 20 feet away for 20 seconds
6. The cycle repeats automatically

The badge on the extension icon shows minutes remaining until your next break.

---

## Tech Stack

- **React** + **TypeScript**
- **Tailwind CSS** + Radix UI
- **Vite** (build tool)
- **Chrome Extension APIs** — Alarms, Storage, Notifications, Offscreen Documents
- **Website** hosted on Netlify

---

## Local Development

### Requirements

- Node.js 20+
- npm

### Setup

```bash
# Install dependencies
npm install

# Start the website locally (preview at http://localhost:3000)
npm run dev

# Build the Chrome extension
npm run build
# Output is in dist-extension/ — load this folder in Chrome
```

### Loading the extension in Chrome

1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `dist-extension/` folder

---

## Project Structure

```
├── client/          # Website source (React)
├── extension/       # Chrome extension source
├── server/          # Express server (serves the website)
├── public/          # Static assets
├── script/          # Build scripts
└── shared/          # Shared types
```

---

## Privacy

This extension collects zero data. All settings are stored locally on your device using Chrome's storage API. No internet connection is required for the extension to work.

---

## License

MIT — feel free to use and modify.
