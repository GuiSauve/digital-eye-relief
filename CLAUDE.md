# Digital Eye Relief — Project Guide for Claude

## About the User
The person working on this project is not a developer. Always:
- Explain things in plain language, no jargon
- Include the "why" behind steps, not just the commands
- Give step-by-step instructions when terminal commands are needed
- Confirm before taking any action that affects shared systems (GitHub, Netlify, Chrome Web Store)

## About the Project
Digital Eye Relief is a Chrome extension + marketing website based on the 20-20-20 eye health rule.

- **Website:** `digitaleyerelief.com` — a static React/TypeScript landing page
- **Extension:** Published on the Chrome Web Store (version 1.6.0)
- **Stack:** React, TypeScript, Vite, Tailwind CSS, Wouter, Framer Motion

## Running Locally
```bash
npm run dev
```
Runs on **port 3000** (port 5000 is taken by Apple AirPlay on this Mac — do not change back to 5000).

## Deploying
Push to the `main` branch on GitHub — Netlify auto-deploys automatically. No manual deploy step needed.

- **Hosting:** Netlify (free tier)
- **DNS:** Cloudflare (CNAME records — no nameserver changes needed)
- **GitHub repo:** https://github.com/GuiSauve/digital-eye-relief.git

## Before Packaging for the Chrome Web Store
**Always run all tests before building a ZIP for upload.** Never hand over a package without confirming all tests pass.

```bash
# Vitest (63 tests)
npm test

# Jest timer tests (19 tests — must be run separately)
npx jest tests/timer.test.ts
```

Both must show 100% passing before proceeding with the build and zip steps.

## Key Things to Avoid
- Do not use `reusePort: true` in server config — it's Linux-only and breaks on macOS
- Do not reference `attached_assets/` — that folder no longer exists; use `/public/` for static assets
- Do not push to remote without confirming with the user first
