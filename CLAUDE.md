# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev`: dev server on http://localhost:3000 (Turbopack)
- `npm run build`: production build (also a full type-check)
- `npm run lint`: ESLint (flat config: `eslint-config-next` core-web-vitals + typescript)
- Type-check only: `npx tsc --noEmit`

There is no test suite. Verify UI changes in a browser.

Gotchas:
- If `npx tsc` / `npx eslint` fail with `Cannot find module '../lib/...'`, the `node_modules/.bin` shims are broken: run `npm install`, or call the tools directly (`node node_modules/typescript/bin/tsc --noEmit`, `node node_modules/eslint/bin/eslint.js <paths>`).
- Turbopack can keep serving stale `globals.css` (new rules missing even after restarting). Fix: stop the dev server, `rm -rf .next`, start again.
- `src/components/home/Welcome.tsx` has a known `react-hooks/set-state-in-effect` lint error; everything else lints clean.

Env (`.env.local`, see `.env.local.example`): `LASTFM_API_KEY` (country charts for recent dates) and `TMDB_API_KEY` (celebrity photos). Both optional; code falls back when missing.

Deploys: Vercel. `main` deploys to production at thatday.space (apex redirects to www); every pushed branch gets a preview URL, posted on its PR.

`time_capsule_web_architecture.md` is an early planning doc (Redis, PWA, etc.) and does not describe the current code. `zustand` and `html2canvas` are installed but unused.

## What the app is

ThatDay: pick a date (1950 → yesterday) and an optional country, and see what happened that day as a "postcard story": the No.1 song, the front page, what things cost, birthday twins. Postcards can be saved locally and shared.

## Architecture

**Routes (App Router, `src/app`)**
- `/`: `SplashScreen` (first visit only) + `HomeFlow`. First visit: Welcome → Time Machine date picker. Returning visitors (`html[data-returning]`, set before paint by the inline script in `layout.tsx` when `localStorage['td-splash-seen']`) land on On this day. `/?pick=1` opens the Time Machine directly; the page reads `searchParams` on the server and passes `skipWelcome`. Client-only screens (Time Machine, On this day) render only after hydration, because they read localStorage and the visitor's local date as they mount.
- `/rewind/[date]?country=xx`: results. A `force-dynamic` server component calls the `src/lib/data` functions **directly** (not through an API) and builds a `StoryData` object (`src/components/results/types.ts`) for the client `PostcardStory`: envelope reveal → six cards (years ago, song, front page, then vs now, stamp card, passport). `loading.tsx` (client) is the Rewinding screen; it only shows while the server renders.
- `/box`: Postcard box (client-only).
- `/card/[id]`: share page. `id` is base64url JSON `{d, b, c}` (date, isBirthday, country) from `src/lib/utils/cardId.ts`; there is no database. Still the pre-redesign UI.
- `/card/[id]/image`: PNG postcard via `next/og` ("Save image"). Fetches Instrument Serif as TTF from Google Fonts at request time.
- `/api/on-this-day?month=&day=&country=`: five years for On this day. The client sends its own month/day so the visitor's time zone decides "today".
- `/api/rewind`: older JSON aggregation; nothing in the UI calls it.

**Data layer (`src/lib/data`)**: static per-country tables plus live fetches; every function degrades to something rather than throwing.
- `songs.ts`: curated No.1 per year per country (`CHART_DATA`, nearest year if missing; `getChartEntry` is the sync, no-network lookup). Dates within the last 90 days try live charts first (Deezer, Last.fm). An iTunes search adds album art and the 30s `previewUrl`, preferring original releases over mixes.
- `events.ts`: Wikipedia "On this day" feeds. `getFrontPage` prefers events from the chosen year (then the nearest earlier ones); `getDayHighlights` picks the best event per decade from the `all` feed, which favours Wikipedia's curated "selected" events. `splitHeadline` turns "Cold War: Fall of the Berlin Wall: East Germany…" into a headline plus deck. The `all` endpoint needs zero-padded `MM/DD`; `events` accepts unpadded. Country filtering uses `COUNTRY_LANG` / `COUNTRY_KEYWORDS`.
- `people.ts`: births on the day (Wikipedia/Wikidata/TMDB thumbnails).
- `costs.ts`: price tables per country at 5-year steps (interpolated), currency meta, a US first-class postage table (`usPostageCents`), and `getThenVsNow` for the then/today ticket stubs.

Remote image hosts must be allowed in `next.config.ts` `images.remotePatterns` (Wikimedia incl. `thumb.wikimedia.org`, mzstatic, TMDB); a missing host crashes the page.

**Client state (`src/lib/postcards.ts`)**: localStorage arrays read via `useSyncExternalStore` (empty on the server, so render nothing until `useHydrated()` is true to avoid flashing empty states). Keys: `thatday-postcards-v2` (saved `Postcard` snapshots, so the box never refetches), `thatday-recent` (opened days), `thatday-shared` (dates shared, which earns the sixth stamp), plus `thatday-country`.

**Countries**: 14 codes (`world, us, gb, ca, au, de, fr, in, jp, ng, gh, ke, za, br`). The list, regions, round flag assets (`public/flags/`) and `detectCountry()` (time zone first, then locale) live in `src/lib/countries.ts`. The data modules' lookup tables duplicate the codes; keep them in sync.

## Design system

The UI matches the Figma file "ThatDay" (key `ZSAOnsO5TqGy40jEJtnDZO`), page **"Design"**: 01 Splash, 02 Welcome, 03 Time Machine, 04 Country sheet, 05 Era style, 06 Loading, 12 Results, 13 On this day, 14 Postcard box. Ignore any "Archive" page.

- Colour tokens `--td-*` in `src/app/globals.css`, exposed to Tailwind as `bg-canvas`, `bg-board`, `bg-card`, `text-ink`, `text-ink-secondary`, `text-ink-muted`, `border-line`, `era-green`. Dark mode follows `prefers-color-scheme` only; use the tokens, not `dark:` overrides. Exception: postage stamps (`STAMP_INK` / `STAMP_PAPER` in `results/art.tsx`) stay cream and ink in both themes, like real paper.
- Fonts: `font-serif` = Instrument Serif (headlines), Geist / Geist Mono for UI. **Even font sizes only.** Geist's latin subset has no arrow glyphs, so draw arrows as SVG.
- **Era rule**: black/ink stays the primary UI colour in every era. Dates before 2000 are "print" (halftone icons as CSS masks so they take the text colour, B&W photos via `grayscale`). From 2000 (`year >= 2000`, exposed as `genZ`) the art becomes glossy stickers, photos stay in colour, completed checks turn `era-green`, and stickers float around. This applies on every screen, including the Time Machine as the year is dialled.
- Assets: `public/icons/halftone/` (print icons), `public/icons/stickers/` and `public/era/` (Gen Z stickers), `public/results/` (perforated stamp SVGs, big halftone record, `genz/` sticker placements), `public/welcome/` (photos), `public/flags/`. Sticker PNGs include their drop shadow, so they are placed by their Figma render bounds (x, y, w, h include the shadow).
- Motion: easing vars `--ease-out` / `--ease-in-out`. Animate transforms and opacity only, give every animation a `prefers-reduced-motion` fallback, and avoid `animation-fill-mode: both` on elements whose transform is later changed inline or by transitions (use `backwards`).
- `short:` custom variant = desktop windows under 880px tall (Figma desktop frames are 1440×900).
- Splash handshake: the `layout.tsx` inline script sets `html[data-splash="seen"]` (and `data-returning`) for returning visitors. `SplashScreen` sets `data-splash="leaving"`, then `"seen"`. `.welcome-reveal` content stays hidden while `html` has no `data-splash`; `.welcome-screen` is hidden for returning visitors.
