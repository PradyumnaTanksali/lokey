# Backdrop provenance

Every loop in `backdrops.ts` comes from Pixabay and is **hotlinked, not
vendored** — the bytes come off their CDN, not our bandwidth. Each url was
verified returning `200 video/mp4` with a `Referer` header set, so hotlinking is
not blocked.

## Lokey — a pool of 18

`backdropFor()` walks this pool one step per track, so the room changes with the
record. **The order is the rotation**: city, then landscape, then something
abstract, then somewhere warm, so no two consecutive tracks put you in the same
kind of place. That is why it is not sorted by theme. Entries 2, 3, 5 and 7 are
the originals the rest of the pool was matched to; entry 1 was promoted to the
front by request.

| # | Clip | Source page | Size | Length |
|---|---|---|---|---|
| 1 | rain and fog through forest | https://pixabay.com/videos/forest-rain-fog-trees-nature-31450/ | 8.5 MB | 40s |
| 2 | defocused bokeh, near-black | https://pixabay.com/videos/bokeh-blur-lights-night-city-6400/ | 2.1 MB | — |
| 3 | rain on glass, high-rise behind | https://pixabay.com/videos/rain-city-highrise-building-lights-310990/ | 3.4 MB | 30s |
| 4 | snow over the Vosges, France | https://pixabay.com/videos/vosges-france-snow-nature-25477/ | 7.1 MB | 19s |
| 5 | quiet Japanese alley, streetlights | https://pixabay.com/videos/japan-street-night-urban-352850/ | 3.0 MB | — |
| 6 | rainforest under rain and fog | https://pixabay.com/videos/trees-forest-fog-rain-rainy-day-212102/ | 5.5 MB | 40s |
| 7 | blue smoke on black | https://pixabay.com/videos/smoke-blue-smoke-blue-9551/ | 3.8 MB | — |
| 8 | Manhattan, Empire State | https://pixabay.com/videos/empire-state-building-new-york-usa-1575/ | 5.6 MB | 22s |
| 9 | snowflakes falling on dark | https://pixabay.com/videos/snowflakes-snow-winter-xmas-6310/ | 2.0 MB | 33s |
| 10 | a boat on a foggy sea | https://pixabay.com/videos/boat-fog-ocean-sea-horizon-water-3589/ | 4.6 MB | 61s |
| 11 | Hong Kong harbour at nightfall | https://pixabay.com/videos/city-nightfall-hong-kong-sunset-3249/ | 8.4 MB | 29s |
| 12 | dark room, rain on the window | https://pixabay.com/videos/dark-room-rain-loop-environment-324730/ | 3.7 MB | 30s |
| 13 | snow-covered pines from above | https://pixabay.com/videos/snowy-trees-above-winter-landscape-7328/ | 5.7 MB | 28s |
| 14 | rain outside, fireplace burning | https://pixabay.com/videos/ai-generated-rain-fireplace-autumn-234440/ | 7.5 MB | 60s |
| 15 | night cityscape over near-black | https://pixabay.com/videos/city-night-lights-urban-cityscape-3134/ | 5.7 MB | 54s |
| 16 | winter in Bavaria | https://pixabay.com/videos/upper-palatinate-bavaria-landscape-31556/ | 5.5 MB | 17s |
| 17 | alpine fog over the Seiser Alm | https://pixabay.com/videos/learn-seiser-alm-sun-exposure-fog-15138/ | 4.5 MB | 21s |
| 18 | forest path in rain and fog | https://pixabay.com/videos/trees-forest-woods-rain-path-fog-240624/ | 2.2 MB | 17s |

Cut on content grounds despite passing every technical check: clips carrying
readable shop signage. The licence restricts commercial use of footage with
recognisable brands, and a wall of legible signs fights the wordmark anyway.

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
  `video/mp4`. **Everything uploaded 2020 through 2024 inclusive does** — that
  window is a dead zone, don't spend time in it. 2015–2019 and 2025+ are fine.
  One file (`304-135918292`) serves `video/quicktime`, so check the type rather
  than assuming mp4 from the extension.
- `_large` is not always 1080p. On a 4K source the whole ladder shifts up, so a
  `_small` can be full HD and a `_medium` can be 1440p.
- Check orientation *and* aspect, not just resolution. Portrait results are
  common, and even among landscape clips the encoded ratio is often not 16:9 —
  see the aspect note above.
- 2025–2026 uploads serve the right type but are frequently enormous: a 59s 4K
  storm is 43 MB even at `_small`.
