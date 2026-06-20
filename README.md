# Jack — 3D Creator Portfolio

## Run locally
1. Install [Node.js](https://nodejs.org) (v18 or newer) if you don't have it.
2. Open this folder in a terminal.
3. Install dependencies:
   ```
   npm install
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
5. Open the localhost link it prints (usually http://localhost:5173).

## Build for production
```
npm run build
```
This creates a `dist/` folder with the final static website (HTML, CSS, JS).
Upload everything inside `dist/` to any hosting (Hostinger, GoDaddy, etc).

## Easiest way to put it live (no terminal needed)
1. Go to https://vercel.com or https://netlify.com and sign up (free).
2. Drag and drop this whole project folder onto their dashboard (or connect it via GitHub).
3. It auto-detects Vite + React and deploys it. You get a live URL in ~1 minute.
4. Later you can connect your own domain in their settings.

## Notes
- Replace the placeholder graphics (portrait, project images, marquee tiles) inside
  `src/App.tsx` with real photos/renders — search for `ProjectImage`, `PortraitPlaceholder`,
  and `DecorShape` components.
- Edit text content (services, project names, about paragraph) directly inside `src/App.tsx`.
