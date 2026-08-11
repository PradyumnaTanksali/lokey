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
  // Lokey walks this pool one step per track, so the order is the
  // rotation: no two neighbours are the same kind of shot. Bokeh → rain glass →
  // alley → smoke → asphalt → facade, and around again.
  room: [
    "https://cdn.pixabay.com/video/2016/11/15/6400-191716659_medium.mp4", // defocused bokeh, near-black
    "https://cdn.pixabay.com/video/2025/10/20/310990_medium.mp4", // rain on glass, high-rise behind
    "https://cdn.pixabay.com/video/2026/05/15/352850_medium.mp4", // quiet Japanese alley, streetlights
    "https://cdn.pixabay.com/video/2017/06/04/9551-220312329_medium.mp4", // blue smoke on black
    "https://cdn.pixabay.com/video/2016/09/14/5276-182817505_medium.mp4", // wet asphalt, light reflections
    "https://cdn.pixabay.com/video/2016/12/14/6782-195763553_medium.mp4", // NYC facade, lit windows
    "https://cdn.pixabay.com/video/2026/05/15/352823_medium.mp4", // rain rippling a neon puddle
    "https://cdn.pixabay.com/video/2016/05/08/3068-165796695_medium.mp4", // blue haze ascending
    "https://cdn.pixabay.com/video/2025/11/15/316176_medium.mp4", // noir blue street, mist
    "https://cdn.pixabay.com/video/2019/02/01/21118-315137091_medium.mp4", // headlight trails from above
    "https://cdn.pixabay.com/video/2025/12/29/324730_small.mp4", // dark room, rain on the window
    "https://cdn.pixabay.com/video/2015/08/11/326-135993239_medium.mp4", // slow steam against dark
    "https://cdn.pixabay.com/video/2026/05/15/352834_medium.mp4", // wet neon street, cyberpunk grade
    "https://cdn.pixabay.com/video/2016/11/17/6455-192501937_medium.mp4", // traffic lights, dark asphalt
    "https://cdn.pixabay.com/video/2025/09/22/305668_medium.mp4", // wet road, colour in the puddles
    "https://cdn.pixabay.com/video/2025/01/06/251066_small.mp4", // night skyline, slow drift
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

/** The clip for a given position in the queue, plus the next one as its
 *  fallback. Walking the pool by index rather than shuffling keeps it stable:
 *  the same track always brings the same room back with it. */
export function backdropFor(pool: string[], index: number): string[] {
  if (pool.length === 0) return [];
  if (pool.length === 1) return [pool[0]];
  return [pool[index % pool.length], pool[(index + 1) % pool.length]];
}
