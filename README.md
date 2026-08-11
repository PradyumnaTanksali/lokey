# Lokey

Two rooms, one player.

- **`/`** — Lokey. One rotation of chill R&B, led by DJ sessions and
  sets: Noise Complaints' *A Late Night R&B Experience*, The Lot Radio, Boiler
  Room, Soulection, NTS. No tabs, no tracklist, no options — a place, not an app.
- **`/forecast`** — pick the weather, it gets scored in lofi: Downpour, Golden
  Hour, Fog, Small Hours.

Audio comes from the YouTube IFrame API behind our own transport. Spotify and
YouTube Music get link-outs rather than reimplemented players.

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

## Deploy

Vercel, at [lokey.corsw.in](https://lokey.corsw.in). `main` is production.
