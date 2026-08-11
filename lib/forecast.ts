import type { Room } from "./rooms";

/** Weather moods, scored in lofi. Same shape as the R&B rooms — one Player,
 *  two datasets. A room's `id` is also its CSS key for the weather layer,
 *  so renaming one here means renaming the `.fx[data-weather=…]` block too.
 *
 *  Mostly long mixes on purpose: a weather room should outlast the weather.
 *  Livestreams are excluded — they have no duration, so the scrubber lies. */
export const FORECAST: Room[] = [
  {
    id: "downpour",
    name: "Downpour",
    tagline: "Windows shut, volume up.",
    spotify: { kind: "playlist", id: "4eWBwGl0c5wtp6k5Krp6My", title: "lofi rain / lo-fi sleep" },
    tracks: [
      { yt: "ivNIpLdzh7M", title: "Rainy Days In Tokyo [Lofi Hip Hop / Jazzhop / Chillhop Mix] - Beats to chill/study/relax", artist: "amplitude" },
      { yt: "3k_a6sQuEIg", title: "rainy city. [lofi / jazz hop / chill beats]", artist: "The Jazz Hop Café" },
      { yt: "Cae61o04YRU", title: "chillhop daydreams 3 ☔️ [chill lofi beats]", artist: "Chillhop Music" },
      { yt: "R3xr01lSOxs", title: "rainy day. [lofi & chill mix]", artist: "the bootleg boy" },
      { yt: "INMWDBgfGBM", title: "Rainy day • lofi ambient music | chill beats to relax/study to", artist: "HITO" },
      { yt: "Xvx6lmSpe0g", title: "Rain", artist: "Lee - Topic" },
    ],
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    tagline: "Everything looks expensive.",
    spotify: { kind: "playlist", id: "76BgwVnPIabsO4YozXMvJO", title: "Sunny Vibes - Jazzhop & Lo-fi Beats" },
    tracks: [
      { yt: "zJdeIRejI8Y", title: "Sunny Morning [lo-fi hip hop / jazzhop / chillhop mix] (Study/Sleep/Relax music)", artist: "Authentic" },
      { yt: "d0MeskbA0ec", title: "Slow Mornings ☕️ [jazzy lofi beats / chill instrumental mix]", artist: "Chillhop Music" },
      { yt: "UI7j87QPFCA", title: "Cozy Morning [Lofi / Jazz Hop / Chill Mix]", artist: "The Jazz Hop Café" },
      { yt: "xx3X4HRbtgI", title: "☀️ Chillhop Essentials · Summer 2026 [jazzy beats / summer lofi instrumentals]", artist: "Chillhop Music" },
      { yt: "OkjC4z5dFrg", title: "☀️ Chillhop Essentials · Summer 2025 [relaxing lofi beats / chill hiphop mix]", artist: "Chillhop Music" },
      { yt: "Il9VfFJrS6M", title: "Sunny (no copyright) - lo-fi hip-hop/jazzhop beat", artist: "trigrade" },
    ],
  },
  {
    id: "fog",
    name: "Fog",
    tagline: "Low visibility, high comfort.",
    spotify: { kind: "playlist", id: "28mvPep2ZmRKw3noCbjinl", title: "dreamy lofi // chillhop" },
    tracks: [
      { yt: "k3yPFw70qpI", title: "ChillHop 🌫️ Foggy Morning - Lofi Deep Focus | Study | Work | Concentration", label: "Foggy Morning", artist: "EightyTu Beats" },
      { yt: "fSpvtGGrh9s", title: "Misty Lofi ☕ 1 Hour Chill Lofi Hip Hop – Beats to Study, Work & Relax to", artist: "Misty Lofi" },
      { yt: "nDX6IgTng_c", title: "Lofi Harbor Fog Vol.8 ⚓ Icy Wind Ambient Lofi & Cold Winter Chillhop Beats", label: "Lofi Harbor Fog, Vol. 8", artist: "Dew Point" },
      { yt: "AD8svDFvrbU", title: "foggy morning lofi • 3 hour mix 🌙 chill beats to relax to", artist: "LoFi sounds" },
      { yt: "spJGInGDahQ", title: "𝐖𝐚𝐤𝐞 𝐔𝐩 𝐓𝐨 𝐀𝐧𝐨𝐭𝐡𝐞𝐫 𝐖𝐨𝐫𝐥𝐝 🌌 Dreamy Lofi Beats || A Stress Reflief Playlist", label: "Wake Up To Another World", artist: "Dreamhop Music" },
      { yt: "IRD2eG2Xi8w", title: "Whispers in the Fog - Relaxing Ambient Lofi Chillhop | Free Background Music", artist: "Fuchinobu ( アルべット )" },
    ],
  },
  {
    id: "small-hours",
    name: "Small Hours",
    tagline: "Nobody's up. Good.",
    spotify: { kind: "playlist", id: "2OhyZiPQ6VSomU5YWTQbHk", title: "lofi sleep / chill lo-fi beats to sleep to" },
    tracks: [
      { yt: "lTRiuFIWV54", title: "1 A.M Study Session 📚 [lofi hip hop]", artist: "Lofi Girl" },
      { yt: "wAPCSnAhhC8", title: "2 A.M Study Session 📚 [lofi hip hop]", artist: "Lofi Girl" },
      { yt: "1tUPFQ54gqc", title: "midnight studying. [lofi / jazzhop / chill mix]", artist: "The Jazz Hop Café" },
      { yt: "sbJ2sT2byoo", title: "late night study 📚 lofi hiphop mix", label: "Late Night Study", artist: "Ambition" },
      { yt: "Qc8RrA5KBQo", title: "Late night - lofi hip hop [study/sleep/homework music]", artist: "Dreamy" },
      { yt: "SHx7BYeiuhY", title: '[FREE] Lo-Fi x Piano Type Beat "Midnight"', artist: "Prnd." },
    ],
  },
];
