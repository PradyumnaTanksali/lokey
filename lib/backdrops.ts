/** Hotlinked background loops, keyed by room id, best source first.
 *
 *  Hotlinked on purpose: the bytes come off Pixabay's CDN rather than our
 *  bandwidth quota. That makes them a thing that can vanish, so nothing here is
 *  load-bearing — `Backdrop` paints a gradient base underneath, and an empty
 *  array, a 403, or `prefers-reduced-motion` all just mean no video.
 *
 *  Every key is a *pool*, walked one step per track by `backdropFor`, which also
 *  hands the next clip in as that clip's fallback — so a takedown degrades to a
 *  different scene rather than to no scene.
 *
 *  Renditions are picked per clip, not by rule. `_large` is not reliably 1080p:
 *  on a 4K source the whole ladder shifts up, so some `_small` and `_tiny` files
 *  here are the 720p or 1080p rung. Always check the actual size and dimensions
 *  rather than trusting the suffix.
 *
 *  Every url verified 200 `video/mp4` with a Referer set. Provenance, sizes and
 *  licence terms are in BACKDROPS.md next to this file.
 *
 *  ponytail: some clips have a visible seam at the loop point. Crossfading needs
 *  two stacked <video>s and a timeupdate listener — worth revisiting for
 *  Forecast, where people actually watch, not for the room behind a wordmark. */
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
  // Forecast is a page you sit and watch, so these are scenes with duration —
  // nothing under 15s, most 20-60s. Each pool rotates per track like the room
  // pool does. Renditions run bigger here than in `room` because at this size
  // the footage is the content, not texture behind a wordmark.

  downpour: [
    "https://cdn.pixabay.com/video/2017/08/30/11722-231759069_medium.mp4", // rain streaming down glass · 33s
    "https://cdn.pixabay.com/video/2018/05/11/16160-269534741_small.mp4", // storm over open ocean · 40s
    "https://cdn.pixabay.com/video/2015/08/11/305-135918495_medium.mp4", // rain and lightning in cloud · 15s
    "https://cdn.pixabay.com/video/2019/10/24/28236-368501609_medium.mp4", // raindrops running on a pane · 15s
  ],
  "golden-hour": [
    "https://cdn.pixabay.com/video/2016/10/26/6119-189135193_medium.mp4", // harbour and ocean at sunset · 25s
    "https://cdn.pixabay.com/video/2016/01/25/1973-152947495_medium.mp4", // lighthouse against sunset · 21s
    "https://cdn.pixabay.com/video/2017/01/07/7127-336300875_small.mp4", // alpine sunrise over a sea of fog · 23s
    "https://cdn.pixabay.com/video/2016/01/14/1917-152081339_small.mp4", // lighthouse, dramatic sky · 22s
  ],
  fog: [
    "https://cdn.pixabay.com/video/2017/01/07/7102-198553608_medium.mp4", // fog rolling over wooded hills · 25s
    "https://cdn.pixabay.com/video/2016/02/29/2266-157183287_medium.mp4", // desert mountains under cloud · 21s
    "https://cdn.pixabay.com/video/2018/05/05/16011-268207201_tiny.mp4", // Colombian mountains, dense fog · 18s
  ],
  "small-hours": [
    "https://cdn.pixabay.com/video/2017/01/14/7348-199627499_small.mp4", // aurora over a starry sky · 60s
    "https://cdn.pixabay.com/video/2018/03/12/14955-260176883_tiny.mp4", // stars over South Tyrol peaks · 17s
    "https://cdn.pixabay.com/video/2019/05/03/23269-334228236_small.mp4", // full moon behind drifting cloud · 50s
    "https://cdn.pixabay.com/video/2016/03/05/2381-157901992_small.mp4", // slow drift through a starfield · 25s
  ],
};

/** Brighter footage needs more floor under the type. */
export const SCRIMS: Record<string, string> = {
  "golden-hour": "from-black/65 via-black/50 to-black/85",
  // grey-white fog is the brightest thing on the site
  fog: "from-black/60 via-black/45 to-black/85",
};

/** The clip for a given position in the queue, plus the next one as its
 *  fallback. Walking the pool by index rather than shuffling keeps it stable:
 *  the same track always brings the same room back with it. */
export function backdropFor(pool: string[], index: number): string[] {
  if (pool.length === 0) return [];
  if (pool.length === 1) return [pool[0]];
  return [pool[index % pool.length], pool[(index + 1) % pool.length]];
}
