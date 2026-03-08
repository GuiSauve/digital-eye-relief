# Digital Eye Relief - Chrome Extension & Web Application

## Overview

Digital Eye Relief is a health-focused productivity tool that helps users reduce digital eye strain by implementing the medically-recommended 20-20-20 rule: every 20 minutes of screen time, look at something 20 feet away for 20 seconds. The project consists of both a Chrome extension and a web-based mockup/demonstration application.

The application provides customizable timer intervals, multiple notification styles, and a calming user interface designed to promote healthy screen habits.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Dual-Purpose Application Structure

The codebase supports two distinct build targets:

1. **Chrome Extension** - A fully functional browser extension with background service workers
2. **Web Application** - An interactive mockup/demo of the extension interface

This dual-purpose architecture allows for rapid prototyping and demonstration of extension features in a web context before deploying as a browser extension.

### Frontend Architecture

**Component-Based React Application**
- Uses React 18+ with TypeScript for type safety
- Component library based on Radix UI primitives with custom styling
- Organized into domain-specific components under `client/src/components/extension/`

**Styling System**
- Tailwind CSS v4 with custom design tokens
- Theme system using CSS custom properties for consistent "Calm Focus" visual design (sage green and cream palette)
- Custom fonts: Nunito for display text, Open Sans for body text

**State Management**
- Custom hooks for timer logic (`useExtensionTimer` for web, `useChromeExtensionTimer` for extension)
- React Query (@tanstack/react-query) for server state management (though minimal API usage currently)
- Chrome Storage API for extension settings persistence

**Routing**
- Wouter for lightweight client-side routing
- Single main route serving the extension mockup interface

### Chrome Extension Architecture

**Manifest V3 Implementation**
- Service worker-based background script (no persistent background pages)
- Separate popup and options pages built as independent entry points
- Permissions limited to: storage, alarms, notifications

**Timer System**
- Chrome Alarms API for reliable, battery-efficient timers
- Background service worker handles timer state and notifications
- Settings synchronized across browser sessions using Chrome Storage Sync API

**Multi-Entry Build System**
- Separate Vite configuration (`vite.extension.config.ts`) for extension builds
- Multiple HTML entry points: `popup.html` and `options.html`
- Post-build script (`script/build-extension.js`) handles asset organization

### Backend Architecture

**Express-Based Server**
- Minimal Express server serving the web application
- Static file serving for production builds
- Development mode with Vite HMR integration via middleware

**Build System**
- Separate build processes for client (Vite) and server (esbuild)
- Production builds bundle server dependencies for optimized cold starts
- Development mode uses Vite dev server with Express proxy

**Database Schema**
- Drizzle ORM configured for PostgreSQL
- Schema defined in `shared/schema.ts` with basic user model
- Currently using in-memory storage implementation (`MemStorage`)
- Production-ready to swap to PostgreSQL via Drizzle migrations

**Rationale:** The in-memory storage serves as a development placeholder. The schema and ORM setup are prepared for future database integration, particularly if user accounts or cloud sync features are added.

### Build & Development Workflow

**Development Commands**
- `npm run dev` - Starts Express server with Vite HMR
- `npm run dev:client` - Vite dev server standalone
- Build extension: `npx vite build --config vite.extension.config.ts && node script/build-extension.js`

**Production Build**
- Client assets built to `dist/public`
- Server bundled to `dist/index.cjs`
- Extension built to `dist-extension` with all required assets

**Icon Generation**
- Sharp-based script to generate multiple icon sizes (16x16, 32x32, 48x48, 128x128)
- Source icon in `attached_assets/generated_images/`

### Design Patterns

**Shared Component Architecture**
- Extension UI components (`Popup`, `Settings`, `NotificationOverlay`) are reusable
- Same components render in both web mockup and actual extension contexts
- Props-based customization allows different data sources (mock vs. Chrome APIs)

**Hook Abstraction**
- Timer logic abstracted into custom hooks
- Separate implementations for web (`useExtensionTimer`) and extension (`useChromeExtensionTimer`)
- Identical interfaces enable component reusability

**Type Safety**
- Comprehensive TypeScript usage across client and server
- Shared types in `@shared` directory
- Chrome extension types via `@types/chrome`

## External Dependencies

### UI Component Libraries
- **Radix UI** - Headless accessible component primitives (dialogs, popovers, sliders, switches, etc.)
- **Lucide React** - Icon library for consistent iconography
- **Class Variance Authority (CVA)** - Component variant management
- **Tailwind Merge & CLSX** - CSS class merging utilities

### Animation & Motion
- **Framer Motion** - Animation library for notification overlays and transitions

### Form & Validation
- **React Hook Form** - Form state management
- **@hookform/resolvers** - Form validation integration
- **Zod** - Schema validation
- **Drizzle Zod** - Schema to Zod validation bridges

### Chrome Extension APIs
- **@types/chrome** - TypeScript definitions for Chrome Extension APIs
- Chrome Storage API for settings persistence
- Chrome Alarms API for timer functionality
- Chrome Notifications API for break reminders

### Database & ORM
- **Drizzle ORM** - Type-safe SQL ORM
- **@neondatabase/serverless** - Neon PostgreSQL serverless driver
- **PostgreSQL** - Intended production database (configured but not actively used)

### Build Tools
- **Vite** - Frontend build tool with HMR
- **esbuild** - Fast server bundling
- **TypeScript** - Type checking and compilation
- **PostCSS** - CSS processing with Tailwind

### Server Framework
- **Express** - Web server framework
- **Connect-PG-Simple** - PostgreSQL session store (configured for future use)

### Development Tools
- **@replit/vite-plugin-runtime-error-modal** - Error overlay for Replit environment
- **@replit/vite-plugin-cartographer** - Replit code navigation
- **@replit/vite-plugin-dev-banner** - Replit development banner
- Custom meta images plugin for OpenGraph image handling

### Asset Processing
- **Sharp** - Image processing for icon generation (used in build scripts)

### Notes on Architecture Decisions

**Why Dual Build System?**
The separate web and extension builds allow stakeholders and users to experience the extension's functionality without installing it, while maintaining a single codebase. This reduces development overhead and ensures feature parity.

**Why Manifest V3?**
Chrome requires new extensions to use Manifest V3. This uses service workers instead of persistent background pages, requiring architectural changes around timer management (hence the Chrome Alarms API instead of setInterval).

**Why Minimal Backend?**
The current implementation focuses on the extension functionality. The Express backend primarily serves the demo/mockup. The database infrastructure is scaffolded for future enhancements like user accounts or usage statistics.

## Recent Updates (November 2025)

### Chrome Extension - Production Ready ✅

The Chrome extension is now **fully built and ready for Chrome Web Store submission**:

**Completed Features:**
- ✅ Manifest V3 configuration with all required permissions
- ✅ Background service worker (`extension/background.js`) with Chrome Alarms API
- ✅ Popup interface (`extension/popup.tsx`) using React components  
- ✅ Settings/Options page (`extension/options.tsx`) with Chrome Storage integration
- ✅ Chrome notifications for break reminders
- ✅ Badge indicators showing minutes remaining
- ✅ Meeting Mode - Silences sound alerts during meetings while keeping badge notifications active
- ✅ Extension icons generated in all required sizes (16, 32, 48, 128px)
- ✅ Build system configured with Vite and post-build scripts
- ✅ Complete documentation (EXTENSION_GUIDE.md, CHROME_WEB_STORE_SUBMISSION.md)

**Build Command:**
```bash
npx vite build --config vite.extension.config.ts && node script/build-extension.js
```

**Output:** `dist-extension/` folder ready to load in Chrome or zip for Web Store submission

**Testing:**
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist-extension` folder

**Next Steps for Publication:**
- Create promotional images (440x280, 920x680)
- Take 3-5 screenshots of the extension in use
- Register for Chrome Web Store developer account ($5 fee)
- Submit extension for review (typically 1-3 business days)

### File Organization

**Extension Source Files** (`extension/`):
- `manifest.json` - Extension configuration
- `background.js` - Service worker with timer logic
- `popup.tsx` - Main popup interface entry point
- `options.tsx` - Settings page entry point
- `hooks/useChromeExtensionTimer.ts` - Chrome API integration hook
- `icons/` - Generated icon files (16, 32, 48, 128px)

**Build Scripts** (`script/`):
- `build-extension.js` - Post-build processing for extension
- `create-icons.js` - Generate extension icons from source image

**Documentation:**
- `EXTENSION_GUIDE.md` - User and developer guide
- `CHROME_WEB_STORE_SUBMISSION.md` - Complete submission checklist

### Web Mockup (Demo Application)

The web mockup at the root URL continues to serve as:
- Interactive demo for users to try before installing
- Development preview environment
- Marketing/landing page showcase

Both the extension and web mockup share the same React components, ensuring visual consistency and reducing code duplication.

## Recent Updates (January 2026)

### Meeting Mode Feature

Added a new "Meeting Mode" feature that allows users to silence sound alerts during meetings while keeping visual badge notifications active:

**Features:**
- Quick toggle button in the popup header (users icon)
- Visual indicator banner when Meeting Mode is active
- Orange badge color to indicate Meeting Mode is enabled
- Auto-disable timer option (configurable in Settings: 0-120 minutes)
- Softer system notifications during Meeting Mode

**Implementation:**
- `extension/background.js` - Meeting mode checks before playing sounds, auto-disable alarm handling
- `client/src/components/extension/Popup.tsx` - Toggle button and indicator banner
- `client/src/components/extension/Settings.tsx` - Auto-disable duration slider
- Both web demo and Chrome extension support Meeting Mode

### Multi-Language Support

Added full internationalization (i18n) with URL-based routing:

**Supported Languages:**
- English (default, `/`)
- Spanish (`/es`)
- French (`/fr`)
- German (`/de`)

**Features:**
- Automatic browser language detection on first visit
- Manual language switching via dropdown selector
- Full translation of all landing page content
- SEO-optimized with hreflang meta tags

### Chrome Extension Internationalization (January 2026)

Extended multi-language support to the Chrome extension itself:

**Implementation:**
- Added `_locales` folder with `messages.json` for all 4 languages
- Updated `manifest.json` with `default_locale: "en"` and i18n placeholders
- Created `useExtensionI18n` hook for React components
- All UI strings in Popup and Settings are now translatable
- Notification messages use Chrome's i18n API with fallbacks

**Translated Strings:**
- All timer states (Focus, Break, Paused, etc.)
- All UI labels and buttons
- Settings section headers and descriptions
- Meeting Mode messages and notifications
- Workspace setup tips
- System notifications (break reminders, completion messages)

**Chrome Extension i18n Files:**
- `extension/_locales/en/messages.json` - English (default)
- `extension/_locales/es/messages.json` - Spanish
- `extension/_locales/fr/messages.json` - French
- `extension/_locales/de/messages.json` - German

The extension automatically displays in the user's browser language when available.

## Automated Test Suite (February 2026)

### Testing Framework
- **Vitest** with jsdom environment for fast, Vite-native testing
- **React Testing Library** for hook testing via `renderHook`
- **@testing-library/jest-dom** for enhanced DOM assertions

### Test Commands
- `npm test` - Run all tests once (use before each release)
- `npm run test:watch` - Run tests in watch mode during development

### Test Coverage

**Timer Hook Tests** (29 tests in `client/src/hooks/__tests__/use-extension-timer.test.ts`):
- Initial state and custom configuration
- Time formatting
- Start/Focus state transitions
- Focus → Break automatic transition
- Break → Focus automatic transition
- Pause from focus (saves state, stops countdown, resumes correctly)
- Pause from break (saves break state, resumes to break not focus)
- Skip break (starts new focus session)
- Reset from any state
- Progress calculations for all states
- Settings changes (idle vs active behavior)
- Meeting Mode toggle and persistence across states
- Stats tracking (break counts, streak, skip behavior)

**i18n Hook Tests** (21 tests in `client/src/hooks/__tests__/use-extension-i18n.test.ts`):
- Translation completeness for all 4 languages (en, es, fr, de)
- Non-English languages have genuinely translated values
- Correct translation values per language
- Fallback to English for unsupported languages
- Unknown key handling
- Singular/plural key pairs for all languages

### Configuration Files
- `vitest.config.ts` - Vitest configuration with path aliases and jsdom
- `client/src/test-setup.ts` - Test setup with jest-dom matchers

## New Tab Page (March 2026)

### Overview
Added a Momentum-style "New Tab" page that replaces Chrome's default new tab with a beautiful, wellness-focused dashboard.

### Features
- **Time-of-day greeting** with customizable user name (persisted in Chrome storage)
- **Live clock and date** display with Nunito display font
- **20-20-20 timer status** - Shows current focus/break state with mini progress ring
- **Daily stats** - Today's breaks and streak counter
- **Daily focus goal** - Text input that persists for the day, resets daily
- **Quick links** - Customizable bookmark grid with favicon support
- **Eye exercise of the day** - Rotating curated exercises (7 exercises)
- **Wellness tip of the day** - Rotating ergonomic/health tips (7 tips)
- **Inspirational quote** - Daily rotating health & wellness quotes

### Architecture
- `extension/newtab.html` + `extension/newtab.tsx` - Chrome extension entry point
- `client/src/components/extension/NewTabPage.tsx` - Main new tab component
- `client/src/components/extension/EyeExercise.tsx` - Exercise, tip, and quote components
- `client/src/pages/newtab-preview.tsx` - Web preview at `/newtab` route
- `extension/manifest.json` - Added `chrome_url_overrides.newtab`

### i18n Support
All new tab strings are translated in all 4 languages (en, es, fr, de) via:
- `client/src/hooks/use-extension-i18n.ts` - Fallback translations
- `extension/_locales/*/messages.json` - Chrome extension i18n

### Design
Uses existing Sage & Cream design system with calming gradient background, glass-morphism cards, and smooth Framer Motion animations.