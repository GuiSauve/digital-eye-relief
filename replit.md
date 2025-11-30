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