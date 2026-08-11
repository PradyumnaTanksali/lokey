/** Hotlinked background loops, keyed by room id, best source first.
 *
 *  Hotlinked on purpose: the bytes come off Pixabay's CDN rather than our
 *  bandwidth quota. That makes them a thing that can vanish, so nothing here is
 *  load-bearing — `Backdrop` paints a gradient base underneath, and an empty
 *  array, a 403, or `prefers-reduced-motion` all just mean no video.
 *
 *  The second url in each slot is a *different clip*, not another rendition of
 *  the same one — a fallback is worth more when it can survive the first clip
 *  being taken down. All are the `_medium` (1280x720) rendition: this sits
 *  behind a scrim and a blur, so 1080p would be paying for detail nobody sees.
 *
 *  Every url verified 200 `video/mp4` with a Referer set. Provenance, sizes and
 *  licence terms are in BACKDROPS.md next to this file.
 *
 *  ponytail: the star-trail clips rotate continuously, so `small-hours` has a
 *  visible seam at the loop point. Crossfading needs two stacked <video>s and a
 *  timeupdate listener — not worth it for a backdrop nobody stares at. */
export const BACKDROPS: Record<string, string[]> = {
  // defocused city bokeh on near-black — the darkest field, best for light type
  room: [
    "https://cdn.pixabay.com/video/2016/11/15/6400-191716659_medium.mp4",
    "https://cdn.pixabay.com/video/2025/12/03/319698_medium.mp4",
  ],
  // rain plate on a dark ground, so it loops essentially perfectly
  downpour: [
    "https://cdn.pixabay.com/video/2026/08/02/368081_medium.mp4",
    "https://cdn.pixabay.com/video/2019/12/15/30224-380473802_medium.mp4",
  ],
  // sun rays through moving cloud; the brightest slot, hence the heavier scrim
  "golden-hour": [
    "https://cdn.pixabay.com/video/2016/09/13/5151-183300171_medium.mp4",
    "https://cdn.pixabay.com/video/2017/11/05/12767-241697386_medium.mp4",
  ],
  // fog rolling in waves over terrain, dim and desaturated
  fog: [
    "https://cdn.pixabay.com/video/2017/01/07/7096-198553490_medium.mp4",
    "https://cdn.pixabay.com/video/2017/01/07/7098-198553487_medium.mp4",
  ],
  // star trails over an alpine horizon
  "small-hours": [
    "https://cdn.pixabay.com/video/2017/03/02/8097-207208860_medium.mp4",
    "https://cdn.pixabay.com/video/2016/12/31/6960-197634412_medium.mp4",
  ],
};

/** Brighter footage needs more floor under the type. */
export const SCRIMS: Record<string, string> = {
  "golden-hour": "from-black/65 via-black/50 to-black/85",
};
