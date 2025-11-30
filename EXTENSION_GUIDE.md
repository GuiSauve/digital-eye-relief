# Digital Eye Relief - Chrome Extension

A Chrome extension that helps reduce digital eye strain by following the 20-20-20 rule: Every 20 minutes, look at something 20 feet (6 meters) away for 20 seconds.

## Features

- ✅ **Smart Timer**: Automatically tracks your work sessions
- ✅ **Customizable Intervals**: Adjust focus duration (5-60 min) and break duration (10-60 sec)
- ✅ **Multiple Notification Styles**: System notifications, badge indicators, or modal overlays
- ✅ **Background Operation**: Runs silently in the background while you browse
- ✅ **Beautiful UI**: Clean, calming interface with sage green theme

## Installation

### For Development/Testing

1. Build the extension:
   ```bash
   npx vite build --config vite.extension.config.ts && node script/build-extension.js
   ```

2. Load in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **"Load unpacked"**
   - Select the `dist-extension` folder from this project

3. The extension icon should appear in your Chrome toolbar!

### For Chrome Web Store (Coming Soon)

The extension will be submitted to the Chrome Web Store for easy one-click installation.

## How to Use

### Basic Usage

1. **Click the extension icon** in your Chrome toolbar to open the popup
2. **Press the Play button** to start the 20-minute focus timer
3. **Work normally** - the extension tracks time in the background
4. **Get reminded** - after 20 minutes, you'll receive a notification
5. **Take a break** - look at something 20 feet away for 20 seconds
6. **Repeat** - the cycle continues automatically!

### Customizing Settings

1. Click the **gear icon** (⚙️) in the popup, or
2. Right-click the extension icon → **Options**
3. Adjust:
   - **Focus Duration**: 5-60 minutes (default: 20)
   - **Break Duration**: 10-60 seconds (default: 20)
   - **Sound Effects**: Enable/disable notification sounds
   - **Reminder Style**: 
     - **Full Screen Modal**: Overlay that covers the screen
     - **System Notification**: Standard Chrome notification
     - **Icon Badge Only**: Quiet badge on extension icon

### Understanding the Badge

- **Number (e.g., "18")**: Minutes remaining until your next break
- **Exclamation mark (!)**: It's break time!
- **No badge**: Timer is paused/inactive

## The Science Behind 20-20-20

### Why This Rule?

Recommended by the **American Optometric Association**, the 20-20-20 rule helps combat:

- 👁️ **Digital Eye Strain** (Computer Vision Syndrome)
- 💧 **Dry Eyes** from reduced blinking
- 😫 **Eye Fatigue** from prolonged near-focus work
- 🤕 **Headaches** and neck tension

### How It Works

When you stare at a screen for extended periods:
- Your eye muscles remain contracted (focusing up close)
- You blink less frequently (causing dryness)
- Your eyes don't get enough rest

By looking into the distance every 20 minutes:
- Eye muscles relax and reset
- Tear film has a chance to refresh
- You prevent cumulative strain

## Technical Details

### Built With

- **React** - UI components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling
- **Vite** - Build tooling
- **Chrome Extension APIs**:
  - `chrome.alarms` - Precise timer management
  - `chrome.storage` - Settings persistence
  - `chrome.notifications` - Break reminders
  - `chrome.action` - Popup and badge

### File Structure

```
extension/
├── manifest.json           # Extension configuration
├── background.js          # Service worker (timer logic)
├── popup.html/tsx         # Main popup interface
├── options.html/tsx       # Settings page
├── hooks/
│   └── useChromeExtensionTimer.ts
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```

## Privacy & Permissions

### Permissions Explained

- **storage**: Save your settings preferences
- **alarms**: Create precise timers that work in background
- **notifications**: Show break reminders

### Data Collection

**We collect ZERO data.** Everything runs locally in your browser:
- Settings are stored on your device only
- No analytics or tracking
- No internet connection required
- Open source and transparent

## Development

### Requirements

- Node.js 20+
- npm or pnpm

### Commands

```bash
# Install dependencies
npm install

# Create extension icons
node script/create-icons.js

# Build extension
npx vite build --config vite.extension.config.ts && node script/build-extension.js

# Build web mockup (for preview)
npm run dev
```

### Project Structure

- `client/` - Web mockup for development/preview
- `extension/` - Chrome extension source files
- `dist-extension/` - Built extension (load this in Chrome)

## Roadmap

- [ ] Submit to Chrome Web Store
- [ ] Add sound effects for notifications
- [ ] Statistics tracking (local only)
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Configurable notification messages

## Support

Found a bug or have a feature request? Please open an issue on GitHub.

## License

MIT License - Feel free to use and modify!

---

**Remember**: Taking care of your eyes is essential when working long hours on screens. This extension is a tool to help build healthy habits, but it's not a substitute for regular eye exams and breaks. If you experience persistent eye discomfort, consult an eye care professional.
