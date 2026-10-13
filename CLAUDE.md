# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev`: dev server on http://localhost:3000 (Turbopack)
- `npm run build`: production build (also the only full type-check besides `npx tsc --noEmit`)
- `npm run lint`: ESLint (flat config: `eslint-config-next` core-web-vitals + typescript)

There is no test suite. If `npx tsc` or `npx eslint` fail with `Cannot find module '../lib/...'`, the `node_modules/.bin` shims are broken; run `npm install`.

Env (`.env.local`, see `.env.local.example`): `LASTFM_API_KEY` (country charts for recent dates) and `TMDB_API_KEY` (celebrity photos). Both are optional; code falls back when missing.

## What the app is

ThatDay: pick a date (1950 → yesterday) and an optional country, and see what happened on that day: the No.1 song, historical events, famous birthdays, what things cost, and "life stats" since then. Shareable as a postcard.

## Architecture

**Routes (App Router, `src/app`)**
- `/`: home. `SplashScreen` (first visit only) + `HomeFlow` (Welcome → date picker).
- `/rewind/[date]?country=xx`: results. A `force-dynamic` server component that calls the `src/lib/data` functions **directly**, not through the API.
- `/card/[id]`: share postcard. `id` is base64url JSON `{d, b, c}` (date, isBirthday, country) from `src/lib/utils/cardId.ts`; there is no database.
- `/api/rewind?date=&country=`: JSON version of the same aggregation (`RewindResponse` in `src/types`). Nothing in the UI calls it today.

**Data layer (`src/lib/data`)**: each module mixes static per-country tables with live fetches and always degrades to something:
- `songs.ts`: hand-curated No.1 song per year for each country (`CHART_DATA`, nearest year if missing). Dates within the last 90 days try live charts first (Deezer global, Last.fm by country). Album art comes from an iTunes search that prefers original releases over mixes/compilations.
- `events.ts` / `people.ts`: Wikipedia "On this day" feeds (country → wiki language via `COUNTRY_LANG`, filtered by `COUNTRY_KEYWORDS`), plus Wikipedia/Wikidata/Commons/TMDB lookups for thumbnails.
- `costs.ts`: static price tables per country at 5-year steps, with currency symbol/code and a per-country item list.
- `src/lib/stats/lifeStats.ts`: derived counts (days, heartbeats, sunrises…) since the date.

Remote image hosts must be allowed in `next.config.ts` `images.remotePatterns` (Wikimedia, mzstatic, TMDB).

**Countries**: 14 codes (`world, us, gb, ca, au, de, fr, in, jp, ng, gh, ke, za, br`). The list lives in `src/lib/countries.ts` and is duplicated in `rewind/[date]/page.tsx` and the data modules' lookup tables; keep them in sync. The user's choice persists in `localStorage['thatday-country']`.

## Redesign in progress

The app is being rebuilt screen by screen to match the Figma file "ThatDay" (key `ZSAOnsO5TqGy40jEJtnDZO`), page **"Design"** (ignore the "Archive" page). Order: 01 Splash → 02 Welcome → 03 Date picker "Time Machine" → 04 Country sheet → 06 Loading → 12 Results "Postcard story" → 14 Postcard box → 13 On this day (returning visitors). New screens live in `src/components/home/` (and future siblings); older components (`*Section.tsx`, the rewind/card pages) are the pre-redesign UI and still use hard-coded zinc colours.

Design system (in `src/app/globals.css`):
- Colour tokens `--td-*` exposed to Tailwind as `bg-canvas`, `bg-board`, `bg-card`, `text-ink`, `text-ink-secondary`, `text-ink-muted`, `border-line`, `era-green`. Dark mode follows `prefers-color-scheme` only (no toggle); use the tokens rather than `dark:` overrides.
- Fonts: `font-serif` = Instrument Serif (headlines), Geist (`font-sans`) and Geist Mono (`font-mono`) for UI. **Even font sizes only** (12, 14, 16…).
- Black/ink is the primary UI colour in every era. Era rule: dates before 2000 use "print" style (halftone icons, B&W photos); 2000+ uses glossy sticker icons and green completed checks.
- Easing vars `--ease-out` / `--ease-in-out`. Animate with transforms and opacity only, and give every animation a `prefers-reduced-motion` fallback.
- `short:` custom variant = desktop windows under 880px tall (the Figma desktop frames are 1440×900).
- Splash handshake: an inline script in `layout.tsx` sets `html[data-splash="seen"]` for returning visitors before paint. `SplashScreen` sets `data-splash="leaving"`, then `"seen"`. Page content using `.welcome-reveal` stays hidden while `html` has no `data-splash` attribute.
- Static assets for the redesign: `public/welcome/` (photos) and `public/icons/halftone/` (PNG icons used as CSS masks so they take the text colour).
