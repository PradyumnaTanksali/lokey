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

## Forecast — a pool per weather

Forecast is a page you sit and watch, so these are scenes with duration rather
than short loops: nothing under 15s, most between 20 and 60. Each pool rotates
per track, the same way the room pool does.

| Slot | Clip | Source page | Rendition | Length |
|---|---|---|---|---|
| `downpour` | rain streaming down glass | https://pixabay.com/videos/rain-water-window-wet-drops-11722/ | 7.9 MB | 33s |
| `downpour` | storm over open ocean | https://pixabay.com/videos/storm-ocean-sky-rain-the-waves-16160/ | 7.8 MB | 40s |
| `downpour` | rain and lightning in cloud | https://pixabay.com/videos/rain-thunderstorm-lightning-clouds-305/ | 4.8 MB | 15s |
| `downpour` | raindrops running on a pane | https://pixabay.com/videos/rain-raindrop-wet-water-window-28236/ | 3.7 MB | 15s |
| `golden-hour` | harbour and ocean at sunset | https://pixabay.com/videos/harbor-sunset-landscape-ocean-6119/ | 8.1 MB | 25s |
| `golden-hour` | lighthouse against sunset | https://pixabay.com/videos/lighthouse-sunset-sunrise-1973/ | 6.3 MB | 21s |
| `golden-hour` | alpine sunrise over a sea of fog | https://pixabay.com/videos/sunrise-tödi-alps-mountains-7127/ | 9.1 MB | 23s |
| `golden-hour` | lighthouse, dramatic sky | https://pixabay.com/videos/lighthouse-sunset-clouds-1917/ | 6.5 MB | 22s |
| `fog` | fog rolling over wooded hills | https://pixabay.com/videos/wave-of-fog-fog-mist-flow-flow-7102/ | 5.5 MB | 25s |
| `fog` | desert mountains under cloud | https://pixabay.com/videos/mountains-clouds-fog-mist-desert-2266/ | 5.9 MB | 21s |
| `fog` | Colombian mountains, dense fog | https://pixabay.com/videos/clouds-moutains-fog-colombia-16011/ | 3.7 MB | 18s |
| `small-hours` | aurora over a starry sky | https://pixabay.com/videos/aurora-borealis-sky-aurora-star-7348/ | 6.5 MB | 60s |
| `small-hours` | stars over South Tyrol peaks | https://pixabay.com/videos/starry-sky-seis-am-schlern-14955/ | 4.0 MB | 17s |
| `small-hours` | full moon behind drifting cloud | https://pixabay.com/videos/full-moon-clouds-sky-night-moon-23269/ | 6.0 MB | 50s |
| `small-hours` | slow drift through a starfield | https://pixabay.com/videos/space-stars-universe-galaxies-2381/ | 5.2 MB | 25s |

### Why these run bigger than the room pool

A 6 MB cap sounds prudent but protects nobody here — the files are hotlinked, so
the bytes are Pixabay's, not ours. What the cap actually did was force every
pick into the low-bitrate 2015–2019 archive at 640×360 and below. Raising it to
roughly 9 MB bought real resolution on almost every slot. On this page the
footage *is* the content, so that is the right trade; the room pool stays
smaller because it sits behind a wordmark under a heavy scrim.

### Aspect ratio is the trap, not resolution

Old Pixabay footage is not reliably 16:9, and `object-fit: cover` does not
letterbox — it zooms. A 3:1 or 2.18:1 source on a 16:9 viewport gets cropped to
its middle third and turns to mush. Several otherwise-good clips were cut on
this alone: a 3:1 aurora, a 2.18:1 night sky, a 2.18:1 Monument Valley (73s, the
longest clip found anywhere), and a 4:3 waterfall. **Measure the encoded
dimensions, don't read them off the page** — one clip advertises 1280×720 and
is actually encoded 640×310.

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
