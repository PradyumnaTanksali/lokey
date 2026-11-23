# Lokey

Two rooms, one player.

- **`/`** — Lokey. One rotation of chill R&B, led by DJ sessions and
  sets: Noise Complaints' *A Late Night R&B Experience*, The Lot Radio, Boiler
  Room, Soulection, NTS. No tabs, no tracklist, no options — a place, not an app.
- **`/forecast`** — pick the weather, it gets scored in lofi: Downpour, Golden
  Hour, Fog, Small Hours.
- **`/curated`** — rooms put together by hand.
- **`/playlists`** — paste YouTube or Spotify song links, get a 10-character
  share code, send it on. No sign-up, no accounts. Unlisted unless you tick
  *Show in Global*.
- **`/global`** — playlists people chose to list. Opt-in per playlist, noindex.

Audio comes from the YouTube IFrame API. **The player is visible on purpose and
must stay that way** — see the compliance note below before changing it.

A sample build by [Scene](https://scenestudio.corsw.in).

## Stack

- Next.js 16 (App Router) + React 19, TypeScript strict
- Tailwind CSS v4
- Geist Sans / Geist Mono
- No player library, no motion library, no icon set, no state library

## Commands

```bash
pnpm install
pnpm dev
pnpm test        # node:test — time formatting, index wrapping, title/artist rules
pnpm typecheck && pnpm lint && pnpm build
```

## How it fits together

`lib/useQueue.ts` holds everything both pages share — queue position, keyboard,
and recovery when YouTube refuses a video. The two layouts have genuinely
diverged, so they are separate components rather than one with a `variant` prop;
`components/Transport.tsx` and `components/Art.tsx` carry the markup they
actually have in common.

Backdrops are **hotlinked from Pixabay, not vendored** — the bytes come off
their CDN instead of our bandwidth. That makes them a thing that can vanish, so
`components/Backdrop.tsx` paints a gradient base underneath first. An empty
list, a dead url, or `prefers-reduced-motion: reduce` all just mean no video,
never a broken page. Provenance and licence: [`lib/BACKDROPS.md`](lib/BACKDROPS.md).

## Adding a track

`lib/queue.ts` is the R&B rotation, `lib/forecast.ts` the weather rooms. Both
use the same `Track` type.

Verify an id before you commit it. A video that blocks embedding is a dead track
in the queue, and a livestream reports no duration, which makes the scrubber lie:

```bash
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json"
curl -sA "Mozilla/5.0" "https://www.youtube.com/watch?v=VIDEO_ID" | grep -o '"playableInEmbed":[a-z]*' | head -1
curl -sA "Mozilla/5.0" "https://www.youtube.com/watch?v=VIDEO_ID" | grep -o '"isLiveContent":[a-z]*' | head -1
```

Send a user-agent — a bare curl sometimes gets a truncated page and looks like a
failure when the video is fine.

`title` and `artist` hold the oEmbed values verbatim so the source stays
traceable. The UI strips `(Official Video)`, `VEVO`, and the usual mix tail at
render time; when that isn't enough — and for DJ sets, named for search engines,
it usually isn't — add a `label` and a `by`. Regression cases live in
`lib/player.test.ts`; they exist because the tail rules must never eat
`6LACK - Free` or `H.E.R. - Focus`.

If a track dies in the wild, the player catches YouTube's error, says so, and
moves on.

## Playback compliance — read before touching the player

The player used to be a 1px offscreen iframe playing audio only. That breached
three separate YouTube rules, so v0.0.4 fixed it. Do not undo any of this:

- **Developer Policies III.I.9** forbids playing from "a player that is not
  displayed in the page, tab, or screen that the user is viewing". The player is
  visible on every page that plays, and Forecast's idle-fade deliberately
  excludes it.
- **III.I.7** forbids separating or isolating the audio component.
- **Required Minimum Functionality** sets a **200×200 minimum viewport**, forbids
  autoplay unless >50% of the player is visible, and forbids drawing overlays in
  front of it — which is why `components/YouTubePlayer.tsx` sits at `z-110`,
  above the grain overlay's `z-100`.
- Player controls stay enabled. Stripping them is modifying player
  functionality beyond the documented API.

**Background playback (screen off) is not possible here and is not a bug.** It
is a YouTube Premium feature confined to YouTube's own apps; III.I.9 prohibits
it for embeds, and YouTube shipped server-side enforcement in Feb 2026 that
kills the old workarounds. The Media Session integration in `lib/useQueue.ts`
gives lock-screen metadata and desktop media keys — it does not, and cannot,
survive backgrounding on mobile.

## Stored YouTube data — the 30-day clock

Developer Policies **III.E.4.d**: an API Client "may temporarily store limited
amounts of Non-Authorized Data ... but not longer than 30 calendar days ...
after 30 calendar days, the API Client must either delete or refresh the stored
data." III.E.4.e adds that stored data must stay "consistent with the current
data available through YouTube API Services".

**There is no exemption for identifiers.** The widely repeated belief that video
IDs may be stored forever has no basis in the policy text — it was checked
clause by clause, not assumed.

How this build handles it:

- `playlists.tracks_fetched_at` is the clock. Reading a playlist older than 30
  days re-fetches its titles and restarts it (`lib/resolveTrack.ts`,
  `markRefreshed`). One write per playlist per month, no scheduled job, and a
  video renamed on YouTube picks up its new title for free.
- **Video ids are kept indefinitely, deliberately.** III.E.4 governs API Data,
  defined by provenance as data "provided to API Clients through the YouTube
  API services". An id the user pasted from their address bar came from the
  user, not from an API. That is a reading of the definition rather than a
  permission the policy grants — it is defensible, not certain.
- Anything fetched through the Data API (playlist imports) is unambiguously
  Non-Authorized Data and sits squarely under the same 30-day clock.

**Still open:** `lib/queue.ts` and `lib/forecast.ts` hold oEmbed titles in the
repo indefinitely, which is the same clause with no refresh path. The
hand-written `label`/`by` fields are ours and unaffected; the verbatim `title`
and `artist` fields are the exposure. Options are to drop the verbatim fields
and keep only the hand-written ones, or to accept it for a fixed catalogue of
52 videos. Not yet decided.

## Database — one-time setup

Playlists and curated rooms need Postgres. Everything else works without it:
`lib/db.ts` exports `null` when `DATABASE_URL` is unset, the API returns 503,
and the pages say so rather than crashing.

1. Vercel dashboard → Storage → **Neon** from the Marketplace, attached to this
   project. That injects `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED`.
2. `vercel env pull .env.local`
3. Apply the schema **through the unpooled url** — PgBouncer runs in transaction
   mode and drops the session state DDL wants:

```bash
psql "$DATABASE_URL_UNPOOLED" -f db/001_init.sql
```

4. Optional, for playlist import: enable **YouTube Data API v3** in Google
   Cloud, create an API key, add it as `YOUTUBE_API_KEY`. Without it, importing
   a playlist link declines cleanly and adding songs one at a time still works.
   Quota is 10,000 units/day; a 100-track import costs 3. The same key turns
   on Spotify song links, which cost **100 units each** (one `search.list`), so
   the free quota is ~100 Spotify songs/day across all users.
5. Optional, for better Spotify matches: a Spotify Developer app's
   `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` (client credentials) adds the
   artist to the YouTube search. Development-mode apps need the owner on
   Spotify Premium. Without them the song is matched on its title alone.
   Spotify **playlist** links are refused on purpose: since Feb 2026 Spotify
   withholds the tracklist of any playlist the app user doesn't own.
6. In Vercel's Firewall settings, add one rate-limit rule keyed on IP against
   `POST /api/playlists`. Hobby allows exactly one rule, which is why creation
   is a Route Handler with a stable path rather than a Server Action.

Curated rooms are ordinary rows with `curated = true`; seed them by hand.
Moderating Global is `update playlists set hidden = true where share_code = '…'`;
the page drops it within the hour (its ISR window).

**Do not add a keep-warm cron.** Neon Free scales to zero after 5 minutes and
gives 100 CU-hours/month; a pinger costs ~182 CU-hours to avoid a one-second
cold start, which exhausts the quota instead. Cache reads.

## Deploy

Vercel (team `corsw`), at [lokey.corsw.in](https://lokey.corsw.in). `main` is
production, deployed with the CLI from a clean `git archive` of `main` — the
project is not git-connected.
