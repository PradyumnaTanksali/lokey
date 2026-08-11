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
  // Lokey walks this pool one step per track, so the order IS the rotation:
  // city, then landscape, then something abstract, then somewhere warm, so no
  // two consecutive tracks land you in the same kind of place. The first four
  // are the originals the brief was built around.
  room: [
    "https://cdn.pixabay.com/video/2020/01/21/31450-386957656_small.mp4", // rain and fog through forest · 40s
    "https://cdn.pixabay.com/video/2016/11/15/6400-191716659_medium.mp4", // defocused bokeh, near-black
    "https://cdn.pixabay.com/video/2025/10/20/310990_medium.mp4", // rain on glass, high-rise behind · 30s
    "https://cdn.pixabay.com/video/2019/07/24/25477-350507890_small.mp4", // snow over the Vosges, France · 19s
    "https://cdn.pixabay.com/video/2026/05/15/352850_medium.mp4", // quiet Japanese alley, streetlights
    "https://cdn.pixabay.com/video/2024/05/15/212102_tiny.mp4", // rainforest under rain and fog · 40s
    "https://cdn.pixabay.com/video/2017/06/04/9551-220312329_medium.mp4", // blue smoke on black
    "https://cdn.pixabay.com/video/2015/12/04/1575-148613496_small.mp4", // Manhattan, Empire State · 22s
    "https://cdn.pixabay.com/video/2016/11/09/6310-190925747_large.mp4", // snowflakes falling on dark · 33s
    "https://cdn.pixabay.com/video/2016/06/27/3589-172488261_tiny.mp4", // a boat on a foggy sea · 61s
    "https://cdn.pixabay.com/video/2016/05/21/3249-167599912_medium.mp4", // Hong Kong harbour at nightfall · 29s
    "https://cdn.pixabay.com/video/2025/12/29/324730_small.mp4", // dark room, rain on the window · 30s
    "https://cdn.pixabay.com/video/2017/01/13/7328-199383367_small.mp4", // snow-covered pines from above · 28s
    "https://cdn.pixabay.com/video/2024/10/03/234440_medium.mp4", // rain outside, fireplace burning · 60s
    "https://cdn.pixabay.com/video/2016/05/12/3134-166335905_small.mp4", // night cityscape over near-black · 54s
    "https://cdn.pixabay.com/video/2020/01/25/31556-387675159_small.mp4", // winter in Bavaria · 17s
    "https://cdn.pixabay.com/video/2018/03/21/15138-261402905_tiny.mp4", // alpine fog over the Seiser Alm · 21s
    "https://cdn.pixabay.com/video/2024/11/10/240624_medium.mp4", // forest path in rain and fog · 17s
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
