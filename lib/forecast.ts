import type { Room } from "./rooms";

/** Weather moods, scored in lofi. Same shape as the R&B rooms — one Player,
 *  two datasets. Room ids double as the CSS keys for the weather layer. */
export const FORECAST: Room[] = [
  {
    id: "downpour",
    name: "Downpour",
    tagline: "Windows shut, volume up.",
    spotify: null,
    tracks: [{ yt: "dQw4w9WgXcQ", title: "PLACEHOLDER", artist: "PLACEHOLDER" }],
  },
];
