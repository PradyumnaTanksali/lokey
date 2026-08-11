# Backdrop provenance

Every loop in `backdrops.ts` comes from Pixabay and is **hotlinked, not
vendored** — the bytes come off their CDN, not our bandwidth. Each url was
verified returning `200 video/mp4` with a `Referer` header set, so hotlinking
is not blocked.

All are the `_medium` (1280×720) rendition. They sit behind a scrim, a blur and
a grain layer, so a 1080p source would be paying for detail nobody can see.

| Slot | Clip | Source page | Size |
|---|---|---|---|
| `room` | city-light bokeh, near-black | https://pixabay.com/videos/id-6400/ | 2.12 MB |
| `room` (fallback) | rainy night city | https://pixabay.com/videos/night-rain-climate-raining-city-319698/ | 1.23 MB |
| `downpour` | rain plate on dark | https://pixabay.com/videos/rain-falling-rain-rain-effect-368081/ | 1.18 MB |
| `downpour` (fallback) | heavy rainfall, daylight | https://pixabay.com/videos/heavy-rain-rain-storm-30224/ | 2.43 MB |
| `golden-hour` | sun rays through cloud | https://pixabay.com/videos/sky-rays-time-lapse-clouds-sun-5151/ | 2.95 MB |
| `golden-hour` (fallback) | sun tracking across sky | https://pixabay.com/videos/time-lapse-sun-clouds-heaven-12767/ | 3.01 MB |
| `fog` | fog rolling over terrain | https://pixabay.com/videos/foggy-landscape-wave-of-fog-fog-7096/ | 2.86 MB |
| `fog` (fallback) | mist over mountains | https://pixabay.com/videos/wave-of-fog-fog-foggy-landscape-7098/ | 3.35 MB |
| `small-hours` | star trails over forest | https://pixabay.com/videos/stars-long-exposure-time-lapse-8097/ | 1.44 MB |
| `small-hours` (fallback) | star trails, alpine | https://pixabay.com/videos/stars-long-exposure-starry-sky-6960/ | 1.87 MB |

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

Every clip above is weather, sky, or defocused light — no logos, no readable
signage, no recognisable people — so this clause does not bite.

<https://pixabay.com/service/license-summary/>

## Adding or replacing one

```bash
curl -sIL -H "Referer: https://room-service-scene.vercel.app/" "<CDN_URL>" \
  | grep -iE '^(HTTP/|content-type|content-length)'
```

Keep only `200` + `video/mp4`. A large share of Pixabay CDN objects serve
`binary/octet-stream` instead, and some `_large` files run past 200 MB — check
before trusting a url. Note that `_large` does not always mean 1080p: on a 4K
source the whole ladder shifts up a step.
