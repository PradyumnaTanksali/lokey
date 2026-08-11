# Room Service

Two listening rooms, one player.

- **`/`** — Room Service. Four rooms of slow R&B: Late Night Drive, Rainy
  Balcony, Sunday Slow, 3AM Studio.
- **`/forecast`** — Forecast. Pick the weather, it gets scored in lofi:
  Downpour, Golden Hour, Fog, Small Hours. The room paints its own weather over
  the artwork.

The cover art is the background — blown up, blurred, and sat under glass. Audio
comes from the YouTube IFrame API behind our own transport; Spotify and YouTube
get link-outs rather than reimplemented players.

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
pnpm test        # node:test — time formatting, index wrapping, title cleanup
pnpm typecheck && pnpm lint && pnpm build
```

## Adding a room

`Room` is one type, used by both pages —
[`lib/rooms.ts`](lib/rooms.ts) holds the R&B set,
[`lib/forecast.ts`](lib/forecast.ts) the weather set.

Verify an id before you commit it. A video that blocks embedding is a dead track
in the queue, and a livestream breaks the progress bar:

```bash
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json"
curl -s "https://www.youtube.com/watch?v=VIDEO_ID" | grep -o '"playableInEmbed":[a-z]*' | head -1
curl -s "https://www.youtube.com/watch?v=VIDEO_ID" | grep -o '"isLiveContent":[a-z]*' | head -1
```

`title` and `author_name` from the oEmbed response are what belong in the file —
the UI strips `(Official Video)`, `VEVO`, and the usual lofi-mix tail at render
time. When a title is beyond saving (`𝐖𝐚𝐤𝐞 𝐔𝐩 🌌 Dreamy Lofi Beats || A Stress
Reflief Playlist`), add a `label` and leave `title` verbatim so the source stays
traceable. Preview what any change renders as:

```bash
node --test lib/*.test.ts    # the title rules have regression cases
```

If a track dies in the wild, the player catches YouTube's error, says so, and
moves on.

A Forecast room's `id` is also its CSS key: add a matching `.fx[data-weather=…]`
block in [`app/globals.css`](app/globals.css) or the room simply gets no weather.

## Deploy

Vercel. `main` is production.
