# Backdrop provenance

Every loop in `backdrops.ts` comes from Pixabay and is **hotlinked, not
vendored** — the bytes come off their CDN, not our bandwidth. Each url was
verified returning `200 video/mp4` with a `Referer` header set, so hotlinking is
not blocked.

## Lokey — a pool of 16

`backdropFor()` walks this pool one step per track, so the room changes with the
record. The order is the rotation: no two neighbours are the same kind of shot,
which is why they are not sorted by theme.

| # | Clip | Source page | Size |
|---|---|---|---|
| 1 | defocused bokeh, near-black | https://pixabay.com/videos/bokeh-blur-lights-night-city-6400/ | 2.1 MB |
| 2 | rain on glass, high-rise behind | https://pixabay.com/videos/rain-city-highrise-building-lights-310990/ | 3.4 MB |
| 3 | quiet Japanese alley, streetlights | https://pixabay.com/videos/japan-street-night-urban-352850/ | 3.0 MB |
| 4 | blue smoke on black | https://pixabay.com/videos/smoke-blue-smoke-blue-9551/ | 3.8 MB |
| 5 | wet asphalt, light reflections | https://pixabay.com/videos/rainy-day-rain-night-summer-5276/ | 4.2 MB |
| 6 | NYC facade, lit windows | https://pixabay.com/videos/city-new-york-building-night-6782/ | 1.9 MB |
| 7 | rain rippling a neon puddle | https://pixabay.com/videos/rain-raindrops-puddle-street-night-352823/ | 4.6 MB |
| 8 | blue haze ascending | https://pixabay.com/videos/smoke-ascending-haze-blue-step-out-3068/ | 1.4 MB |
| 9 | noir blue street, mist | https://pixabay.com/videos/night-urban-cinematic-blue-street-316176/ | 4.1 MB |
| 10 | headlight trails from above | https://pixabay.com/videos/seoul-traffic-cars-city-speed-21118/ | 3.4 MB |
| 11 | dark room, rain on the window | https://pixabay.com/videos/dark-room-rain-loop-environment-324730/ | 3.7 MB |
| 12 | slow steam against dark | https://pixabay.com/videos/steam-smoke-fumes-gas-heat-dark-326/ | 1.3 MB |
| 13 | wet neon street | https://pixabay.com/videos/night-city-rain-street-neon-352834/ | 4.7 MB |
| 14 | traffic lights, dark asphalt | https://pixabay.com/videos/traffic-lights-city-street-night-6455/ | 3.4 MB |
| 15 | wet road, colour in the puddles | https://pixabay.com/videos/rainy-rain-night-summer-colorful-305668/ | 1.5 MB |
| 16 | night skyline, slow drift | https://pixabay.com/videos/city-urban-night-buildings-251066/ | 4.2 MB |

Two verified clips were cut from this pool for being 960×540 at over 4.8 MB —
a bad trade for a full-screen bed. Clips with readable shop signage were also
cut: the licence restricts commercial use of footage carrying recognisable
brands, and a wall of legible signs fights the wordmark anyway.

## Forecast — one per weather, plus a fallback

Drawn rather than filmed: on this page the video is the thing you came to watch,
so it needs to be a scene, not a texture.

| Slot | Clip | Style | Source page | Size |
|---|---|---|---|---|
| `downpour` | pixel landscape, watchtower, rain | **8-bit** | https://pixabay.com/videos/pixel-8-bit-artwork-lofi-nature-337111/ | 0.76 MB |
| `downpour` (fallback) | cabin in the rain, warm window | illustrated | https://pixabay.com/videos/live-wallpaper-cozy-cabin-rainy-day-270983/ | 0.89 MB |
| `golden-hour` | rooftop silhouette over a sunset skyline | illustrated | https://pixabay.com/videos/anime-cityscape-silhouette-sunset-266892/ | 5.35 MB |
| `golden-hour` (fallback) | writing at sunset | illustrated | https://pixabay.com/videos/man-anime-sunset-writing-lo-fi-330218/ | 1.42 MB |
| `fog` | roadside motel in drifting fog | illustrated | https://pixabay.com/videos/motel-night-fog-mist-loop-219912/ | 1.05 MB |
| `fog` (fallback) | moonlit birch forest in fog | photoreal | https://pixabay.com/videos/ai-generated-kupala-night-forest-351133/ | 1.21 MB |
| `small-hours` | gas station under a starry sky | illustrated | https://pixabay.com/videos/gas-station-cartoon-night-stars-219916/ | 1.40 MB |
| `small-hours` (fallback) | night room, rainy city outside | illustrated | https://pixabay.com/videos/lofi-nature-anime-to-relax-night-319697/ | 1.72 MB |

`fog` and `small-hours` are the same illustrator and the same batch, so moving
between those two rooms reads as one world.

### Why only one of these is real 8-bit

Pixabay's pixel-art **video** library is roughly a dozen clips, and almost none
of them survive contact with the requirements. `pixelart` returns zero results;
`pixel art`, `8 bit`, `16 bit` and `retro game background` return overwhelmingly
live-action nature footage and abstract motion graphics. Of what genuinely is
pixel art:

- The best of it is **vertical phone wallpaper** — the whole "AI Generated
  Wallpaper Pixel Anime" series, plus a pixel-art campfire scene, all portrait.
- Most of the rest was **uploaded 2021–2023**, and everything from that window
  serves `binary/octet-stream` rather than `video/mp4`. That killed a pixel
  island sunset, a pixel room with a storm outside, and a pixel rooftop scene.
- A genuine pixel lofi-study-room scene (`248092`) matches the brief exactly and
  is **33.9 MB** at medium, 24.3 MB at small.

So `downpour` is real 8-bit and the other three are illustrated/anime lofi in
the same register. The substitution is deliberate and worth revisiting if the
look matters more than the source: commissioned pixel loops, or another library.

## Licence

Pixabay Content License. Commercial use is permitted and **attribution is not
required** — this file exists because provenance for media in a repo is worth
recording anyway, not because the licence demands it.

Two clauses that actually matter here:

> You cannot sell or distribute Content (either in digital or physical form) on
> a Standalone basis.

Embedding these as site backgrounds is fine; offering the mp4s as downloadable
assets would not be. Hotlinking rather than vendoring keeps us clearly on the
right side of this.

> If Content contains any recognisable trademarks, logos or brands, you cannot
> use that Content for commercial purposes in relation to goods and services.

Every clip in use is weather, sky, defocused light, or unsigned street — no
logos, no readable signage, no recognisable faces — so this clause does not bite.

<https://pixabay.com/service/license-summary/>

## Adding or replacing one

```bash
curl -sIL -H "Referer: https://lokey.corsw.in/" "<CDN_URL>" \
  | grep -iE '^(HTTP/|content-type|content-length)'
```

Keep only `200` + `video/mp4`, and check `content-length` before trusting
anything — some Pixabay files run past 200 MB. Three gotchas found the hard way:

- A large share of CDN objects serve `binary/octet-stream` instead of
  `video/mp4`. **Almost everything uploaded 2021–2023 does.** 2015–2019 and
  2024+ are generally fine.
- `_large` is not always 1080p. On a 4K source the whole ladder shifts up, so a
  `_small` can be full HD and a `_medium` can be 1440p.
- Check orientation, not just resolution — plenty of good-looking results are
  portrait and will letterbox badly as a full-screen bed.
