# Baithak

A listening room for slow R&B. Four moods, zero login. Plays through the YouTube
IFrame API; hands off to Spotify's own embed when you'd rather use theirs.

A sample build by [Scene](https://scenestudio.corsw.in) — same warm-paper design
language, same voice, different job.

## Stack

- Next.js 16 (App Router) + React 19, TypeScript strict
- Tailwind CSS v4
- Geist Sans / Geist Mono
- No player library, no motion library, no icon set

## Commands

```bash
pnpm install
pnpm dev
pnpm test        # node:test — time formatting, index wrapping, title cleanup
pnpm typecheck && pnpm lint && pnpm build
```

## Adding a room

Everything lives in [`lib/rooms.ts`](lib/rooms.ts). A room is a name, a tagline,
an optional Spotify playlist/album, and a list of YouTube video IDs.

Verify an ID before you commit it — a video that blocks embedding is a dead
track in the queue:

```bash
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json"
```

`title` and `author_name` from that response are what belong in the file.
The UI strips `(Official Video)` and `VEVO` at render time.

If a track goes bad in the wild, the player catches YouTube's error, says so,
and moves to the next one.

## Deploy

Vercel. `main` is production.
