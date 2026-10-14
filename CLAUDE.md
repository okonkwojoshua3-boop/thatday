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
- Lint is clean; keep it that way.
- The dev server can return a stale `/card/[id]/image` PNG for a URL it has already served; add a throwaway query (`&v=2`) to see a change.
- Overlays opened from inside animated content (`welcome-reveal`, `teaser-in` and other transformed parents) must portal to `document.body` (see `PhotoCredits`): a transformed ancestor breaks `position: fixed`, and some callers sit inside a `<p>`.
- Browser testing with Claude in Chrome: if the automation window is in the background, the page reports `document.hidden`, timers are throttled, clicks may not register as user activation, and audio can't start. Check `document.visibilityState` before trusting a "nothing happened" result. Hydration warnings mentioning `bis_skin_checked` come from a browser extension, not the app.

Env (`.env.local`, see `.env.local.example`): `LASTFM_API_KEY` (country charts for recent dates) and `TMDB_API_KEY` (celebrity photos). Both optional; code falls back when missing.

Deploys: Vercel. `main` deploys to production at thatday.space (apex redirects to www); every pushed branch gets a preview URL, posted on its PR. `metadataBase` (root `layout.tsx`) is www.thatday.space in production, `VERCEL_URL` on previews and localhost in dev, so check link previews on a Vercel preview. Workflow: work on a branch, push, open a PR, and let the user check the preview; the user merges (`gh pr merge <n> --merge`).

`time_capsule_web_architecture.md` is an early planning doc (Redis, PWA, etc.) and does not describe the current code.

## What the app is

ThatDay: pick a date (1950 → yesterday) and an optional country, and see what happened that day as a "postcard story": the song of the year, the front page, what things cost, birthday twins. Postcards can be saved locally and shared.

## Architecture

**Routes (App Router, `src/app`)**
- `/`: `SplashScreen` (first visit only) + `HomeFlow`. First visit: Welcome → Time Machine date picker. Returning visitors (`html[data-returning]`, set before paint by the inline script in `layout.tsx` when `localStorage['td-splash-seen']`) land on On this day. `/?pick=1` opens the Time Machine directly; the page reads `searchParams` on the server and passes `skipWelcome`. Client-only screens (Time Machine, On this day) render only after hydration, because they read localStorage and the visitor's local date as they mount.
- `/rewind/[date]?country=xx`: results. A `force-dynamic` server component calls `buildStory` (`src/lib/story.ts`), which calls the `src/lib/data` functions **directly** (not through an API) and builds a `StoryData` object (`src/components/results/types.ts`) for the client `PostcardStory`: envelope reveal → six cards (years ago, song, front page, then vs now, stamp card, passport). `loading.tsx` (client) is the Rewinding screen; it only shows while the server renders.
- `/box`: Postcard box (client-only).
- `/card/[id]`: share page (Figma 09), what a friend sees. `id` is base64url JSON `{d, b, c}` (date, isBirthday, country) from `src/lib/utils/cardId.ts`; there is no database. Builds the same `StoryData` via `buildStory`; `ReceivedPostcard` shows the envelope ("Someone sent you", `Envelope` with share stickers and a lime NEW tag from 2000), then the read-only `Passport` (weekday instead of stamps) with Open the full story / Find your own day.
- `/card/[id]/image`: the 1200×630 postcard PNG via `next/og`. With `?preview=1` it's the share page's og:image; without, it downloads ("Save image"). Fetches Instrument Serif and Geist as TTF from Google Fonts at request time and reads its art from `public/share/` (listed in `next.config.ts` `outputFileTracingIncludes`). Satori needs `display: flex` on any div with several children.
- `/api/on-this-day?month=&day=&country=`: five years for On this day. The client sends its own month/day so the visitor's time zone decides "today".

**Data layer (`src/lib/data`)**: static per-country tables plus live fetches; every function degrades to something rather than throwing.
- `songs.ts`: one sourced song per year per country (`CHART_DATA`; audited Oct 2026, gaps left empty rather than guessed). `CHART_ERAS` names the real chart for each era (e.g. Kent Music Report before ARIA); outside an era the pick is the year's defining hit. A song's `basis` (`chart` / `hit` / `week`) and `year` drive the card's wording, so never call a `hit` a No.1. Lookup allows the year either side only; `US_FALLBACK` countries then borrow the US year-end (labelled), others show none. `getChartEntry` is the sync, no-network lookup. Dates within the last 7 days use live charts (Deezer, Last.fm). An iTunes search adds album art and the 30s `previewUrl`, preferring original releases over mixes.
- `events.ts`: Wikipedia "On this day" feeds (`COUNTRY_LANG` picks the language; Brazil uses `pt`). `getFrontPage` leads with news from the exact date: the feed's same-year events in the country, then `dayEvents.ts`, then the day's world news, and only then this calendar day in the nearest year (1900+, labelled "On this day" by the card). `getDayHighlights` picks the best event per decade from the `all` feed, which favours Wikipedia's curated "selected" events. `splitHeadline` turns "Cold War: Fall of the Berlin Wall: East Germany…" into a headline plus deck. The `all` endpoint needs zero-padded `MM/DD`; `events` accepts unpadded. Match countries with `isLocal` (strict names, demonyms, big cities), never broad keywords ("India" matches "Indianapolis").
- `dayEvents.ts`: events dated to an exact day, parsed from raw wikitext of the year article ("1987"), "{year} in {country}" pages and national timelines (ng, gh, ke), cached for a day. `eventsOn` handles month headings, `;Month` lines, "March 14 –" / "14 March –" / "14 –" bullets, sub-bullets under a date, and timeline tables.
- `people.ts`: births on the day (Wikipedia/Wikidata/TMDB thumbnails). The results page only needs `hasBirthdayTwins` (cheap yes/no); `getPeopleForDate` (with photos) is currently unused and slow for non-world countries.
- `costs.ts`: sourced price tables per country (official average-price series, CPI back-casts where none exist; filled along a growth curve between points), currency meta, a US first-class postage table (`usPostageCents`), and `getThenVsNow` for the ticket stubs. Each item carries its own `nowYear`; items are hidden before their series starts. The first four items of a country are the ones shown.
- `fuel.ts`: fuel per country, generated from research: dated official price changes for regulated markets (ng, za, in, ke, gh), so a picked day gets that day's pump price, and annual averages elsewhere. `getThenVsNow` takes fuel from here, not from `costs.ts`.

Remote image hosts must be allowed in `next.config.ts` `images.remotePatterns` (Wikimedia incl. `thumb.wikimedia.org`, mzstatic, TMDB); a missing host crashes the page.

**Data provenance**: the song, price and fuel tables were rebuilt in Oct 2026 from cited research (year-end charts, award winners, official price series, CPI back-casts). Don't add unsourced values: leave a year empty rather than guess, and keep labels honest about what a value is (unit, "song of the year" vs chart No.1).

**Sound (`src/lib/feedback.ts`, `src/lib/soundtrack.ts`)**: everything is synthesised with Web Audio; there are no audio files. `feedback.ts` holds the UI sounds (`play`), haptics (`haptic`, `feel` for both) and the on/off preference (`thatday-sound`, toggled by `components/ui/SoundToggle`). The audio session is `ambient`, so the iPhone silent switch mutes it. Phones only unlock audio on pointerup/touchend/click, not pointerdown. Haptics: `navigator.vibrate` on Android; on iOS 18+ a hidden `<input switch>` click, which only works inside a tap (not during drags). `soundtrack.ts` is the postcard story's background beat: a lookahead step sequencer that starts when the envelope opens, adds a layer per card (`setSection`), ducks while the song preview plays, pauses when the tab is hidden, and stops when `PostcardStory` unmounts. Two styles by era (print lo-fi before 2000, Gen Z pop from 2000).

**Client state (`src/lib/postcards.ts`)**: localStorage arrays read via `useSyncExternalStore` (empty on the server, so render nothing until `useHydrated()` is true to avoid flashing empty states). Keys: `thatday-postcards-v2` (saved `Postcard` snapshots, so the box never refetches), `thatday-recent` (opened days), `thatday-shared` (dates shared), `thatday-stamps` (`date|country|stamp` entries), plus `thatday-country` and `thatday-sound`.

**Stamp card (`src/components/results/stamps.ts`)**: six stamps earned by doing things, never by data coverage: play the song preview, read another headline, see the prices, save, have opened another day, send. A card with nothing to do (no preview, no other headlines) earns its stamp by being seen. Empty stamps show the action, collected ones what you got. `PostcardStory` computes them and keeps the saved postcard's count in sync.

**Photo credits**: the `public/welcome/` and `public/surprise/` photos come from Wikimedia Commons (public domain or CC BY / BY-SA only), so `src/lib/photoCredits.ts` lists author, licence, source and changes, shown by `components/ui/PhotoCredits` (Welcome footer and the Surprise me teaser, which lists the photo on screen first). Adding a photo means adding its credit.

**Surprise me** (`src/lib/surprises.ts`): hand-picked moments with dates checked against Wikipedia, tagged by country; `pickSurprise` makes the picked country's moments four times as likely. Where no free photo of the event exists the photo shows its main person or place, and the credit title says what it actually shows.

**Countries**: 14 codes (`world, us, gb, ca, au, de, fr, in, jp, ng, gh, ke, za, br`). The list, regions, round flag assets (`public/flags/`) and `detectCountry()` (time zone first, then locale) live in `src/lib/countries.ts`. The data modules' lookup tables duplicate the codes; keep them in sync.

## Design system

The UI matches the Figma file "ThatDay" (key `ZSAOnsO5TqGy40jEJtnDZO`), page **"Design"**: 01 Splash, 02 Welcome, 03 Time Machine, 04 Country picker, 05 Loading, 06 Results, 07 On this day, 08 Postcard box, 09 Share page (light and dark sections for each). The "Archive" page holds old explorations, including the Era style board. The official Figma MCP is on a Starter plan with a low call limit; the `figma-console` desktop bridge (`figma_execute`) reads the open file without that limit. Code comments still use the older numbering (e.g. "Figma 12" for Results).

- Colour tokens `--td-*` in `src/app/globals.css`, exposed to Tailwind as `bg-canvas`, `bg-board`, `bg-card`, `text-ink`, `text-ink-secondary`, `text-ink-muted`, `border-line`, `era-green`. Dark mode follows `prefers-color-scheme` only; use the tokens, not `dark:` overrides. Exception: postage stamps (`STAMP_INK` / `STAMP_PAPER` in `results/art.tsx`) stay cream and ink in both themes, like real paper.
- Fonts: `font-serif` = Instrument Serif (headlines), Geist / Geist Mono for UI. **Even font sizes only.** Geist's latin subset has no arrow glyphs, so draw arrows as SVG.
- **Era rule**: black/ink stays the primary UI colour in every era. Dates before 2000 are "print" (halftone icons as CSS masks so they take the text colour, B&W photos via `grayscale`). From 2000 (`year >= 2000`, exposed as `genZ`) the art becomes glossy stickers, photos stay in colour, completed checks turn `era-green`, and stickers float around. This applies on every screen, including the Time Machine as the year is dialled.
- Assets: `public/icons/halftone/` (print icons), `public/icons/stickers/` and `public/era/` (Gen Z stickers), `public/results/` (perforated stamp SVGs, big halftone record, `genz/` sticker placements), `public/welcome/` (photos), `public/share/` (share page stickers and postcard-image art exported from Figma 09), `public/flags/`. Sticker PNGs include their drop shadow, so they are placed by their Figma render bounds (x, y, w, h include the shadow). Those boxes are fractional: pass `next/image` `width`/`height` as `Math.round` of the box (the browser rounds the rendered size to the nearest pixel; any mismatch logs a "width or height modified" warning).
- Motion: easing vars `--ease-out` / `--ease-in-out`. Animate transforms and opacity only, give every animation a `prefers-reduced-motion` fallback, and avoid `animation-fill-mode: both` on elements whose transform is later changed inline or by transitions (use `backwards`).
- `short:` custom variant = desktop windows under 880px tall (Figma desktop frames are 1440×900).
- Splash handshake: the `layout.tsx` inline script sets `html[data-splash="seen"]` (and `data-returning`) for returning visitors. `SplashScreen` sets `data-splash="leaving"`, then `"seen"`. `.welcome-reveal` content stays hidden while `html` has no `data-splash`; `.welcome-screen` is hidden for returning visitors.
