# Voice Agent — Text ⇄ Speech

A simple, fully client-side web app for:
- **Text to Speech (TTS)** — type text, pick a voice/rate/pitch, and hear it spoken.
- **Speech to Text (STT)** — speak into your mic and see it transcribed live.

No backend, no API keys, no build step. It runs entirely in the browser using the
built-in **Web Speech API**, so it's a perfect fit for GitHub Pages.

## Files

- `index.html` — page structure
- `style.css` — dark-mode styling
- `script.js` — TTS + STT logic

## How to deploy on GitHub Pages

1. Create a new repo on GitHub (or use an existing one).
2. Upload all 3 files (`index.html`, `style.css`, `script.js`) to the repo root
   (or to a subfolder like `/docs` — just be consistent with the Pages setting below).
3. Go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch".
5. Choose your branch (usually `main`) and the folder (`/root` or `/docs`).
6. Save. GitHub will give you a live URL like:
   `https://<your-username>.github.io/<repo-name>/`
7. Open it — that's your live app.

## Browser support notes

- **Best in Chrome or Edge** (desktop and Android). Both TTS and STT are fully supported.
- **Safari**: TTS works; STT (SpeechRecognition) support is limited/inconsistent.
- **Firefox**: TTS works; STT is not supported natively.
- Speech recognition **requires HTTPS** — GitHub Pages serves over HTTPS by default, so you're covered.
- The mic will ask for browser permission the first time you click "Start Listening."

## Customizing

- Add/remove STT languages in the `<select id="sttLang">` list in `index.html`.
- Available TTS voices depend on the user's OS/browser — the dropdown populates automatically.
- Colors/theme are controlled via CSS variables at the top of `style.css`.
