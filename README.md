# Nemis tili lug‘ati

German vocabulary trainer for Uzbek-speaking students (A1.1, Lektion 1 so far). Frontend only: Vite + React + TypeScript, no backend, no accounts. Progress is stored in the browser (`localStorage`).

## Run

```bash
npm install
npm run dev        # development
npm test           # unit + UI tests
npm run lint && npm run typecheck
npm run build      # production build in dist/
```

## Routes

| Route | Page |
| --- | --- |
| `/` | A1.1 lesson list |
| `/a1.1-lektion-1/vocabulary` | Word list (search, filters, audio, learned / difficult) |
| `/a1.1-lektion-1/test` | Quiz |

The app is a single-page app: the host must serve `index.html` for unknown paths so direct links and refresh work. `vercel.json` and `public/_redirects` (Netlify / Cloudflare Pages) are included. GitHub Pages needs a `404.html` copy of `index.html`.

## Adding a lesson

1. Create `src/data/lessons/<name>.ts` exporting a `Lesson` (see `a1-1-lektion-1.ts`). Set `sourceCount` to the number of rows in the source document.
2. Add it to the array in `src/data/index.ts`.

Routes, overview, quiz and tests pick it up automatically. Never change an existing entry `id`: saved progress is keyed by it.

## Notes

- Design follows `DESIGN-sentry.md` (Rubik, self-hosted via `@fontsource/rubik`; midnight-violet canvas in dark mode, white canvas in light mode, chosen from `prefers-color-scheme`).
- Audio uses the browser Speech Synthesis API with `de-DE`. Voice availability depends on the device; if no German voice is installed the app says so.
- Pronunciation hints are hand-written learning aids for Uzbek readers, not IPA, and have not been reviewed by a native German speaker.
