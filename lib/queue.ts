export type Track = {
  /** YouTube video id — verify with the oEmbed endpoint before committing. */
  yt: string;
  /** oEmbed `title`, verbatim. The UI strips the "(Official Video)" part. */
  title: string;
  /** Display override, for titles no rule can rescue without also eating real
   *  ones. DJ sets are named for search engines, so most of them need it.
   *  `title` stays verbatim so the source is always traceable. */
  label?: string;
  /** oEmbed `author_name`, verbatim. The UI strips the "VEVO" part. */
  artist: string;
  /** Artist override. Channel names lose punctuation and spacing that the name
   *  actually has — "DAngeloVEVO" is not how anyone writes D'Angelo. */
  by?: string;
};

/** One rotation, no rooms, no tabs. Sessions and sets lead — that is the point
 *  of the room — and singles sit at the back for texture.
 *
 *  Every id verified: oEmbed 200, playableInEmbed true, isLiveContent false.
 *  Livestreams are excluded on purpose; they report no duration, so the
 *  scrubber would sit there lying. */
export const QUEUE: Track[] = [
  // ── Noise Complaints ───────────────────────────────────────────────────────
  { yt: "dHU8B76kR_s", title: "'A Late Night R&B Experience' in Brooklyn 🤍 | Bryson Tiller, Daniel Caesar, Snoh, SZA + | Playlist", label: "A Late Night R&B Experience · Brooklyn", artist: "Noise Complaints" },
  { yt: "WALhMdVuCYE", title: "A Late Night R&B Living Room Session 🍷 | Noise Complaints | @markmark @recap", label: "A Late Night R&B Living Room Session", artist: "Noise Complaints" },
  { yt: "tUnyT_M6F88", title: "'A Late Night R&B Experience in NYC' 🖤 by @markmark | An Evening of Classic & Modern R&B", label: "A Late Night R&B Experience · NYC", artist: "Noise Complaints" },
  { yt: "jyNRVyPmdgQ", title: "'A Late Night R&B Experience in San Francisco' Night 1 by @markmark", label: "A Late Night R&B Experience · San Francisco", artist: "Noise Complaints" },
  { yt: "l_j5c6fnMis", title: "LowwkeyJ | A Late Night R&B Experience in SF | Kehlani, Drake, Don Toliver + more", label: "LowwkeyJ · Late Night R&B in SF", artist: "Noise Complaints" },
  { yt: "xE17XeA9HIk", title: "Late Night R&B Playlist Vol. 14 🥜 | Giveon, Leon Thomas, Khamari, PND +", label: "Late Night R&B, Vol. 14", artist: "Noise Complaints" },
  { yt: "9de3eFZUeM0", title: "Sasha Marie | Noise Complaints on a Yacht DAY 1 | San Diego, Ca | DJ Set", label: "Sasha Marie · Yacht Set, San Diego", artist: "Noise Complaints" },
  { yt: "-JoPPdsQDvU", title: "NIKKS DJ SET | NOISE COMPLAINTS | SAN DIEGO, CA | HIP HOP & R&B MIX", label: "Nikks · San Diego Set", artist: "Noise Complaints" },
  { yt: "KjItUXF3cmM", title: "Late Night Afrobeats Mix | Alté R&B Afrosoul| Wizkid, Burna Boy, Tems, Rema, Oxlade", label: "Late Night Afrobeats · Alté R&B", artist: "Noise Complaints" },
  { yt: "Y16YiEX7BdE", title: "4 HOUR R&B MIX 2026 | Modern R&B Playlist | Noise Complaints", label: "4 Hour R&B Mix", artist: "Noise Complaints" },

  // ── Radio, rooms, and sets ─────────────────────────────────────────────────
  { yt: "csD2bc1ZrxA", title: "summer school radio with Soul Sugar @TheLotRadio  05-06-2025", label: "Soul Sugar · Summer School Radio", artist: "The Lot Radio" },
  { yt: "8o2O9CYPSE4", title: "A Soulful Love Letter for Lovers and Yearners with k.tea @TheLotRadio 02-13-2025", label: "k.tea · A Soulful Love Letter", artist: "The Lot Radio" },
  { yt: "at2BEqa6eLc", title: "k tea: D'Angelo Tribute with special guests Joseph Patel and Juju Bae @TheLotRadio  10-19-2025", label: "k.tea · D'Angelo Tribute", artist: "The Lot Radio" },
  { yt: "Td2VjYJXW5I", title: "Analog Soul @ The Lot Radio (August 5 2020)", label: "Analog Soul · The Lot Radio", artist: "The Lot Radio" },
  { yt: "Giyg68Uv-nU", title: "Daniel Caesar Boiler Room London Valentine's Day Special Live Set", label: "Daniel Caesar · Boiler Room London", artist: "Boiler Room" },
  { yt: "pRnr9hRooAM", title: "Kaytranada (DJ Set) - Elevator Music", label: "Kaytranada · Elevator Music", artist: "Elevator Music" },
  { yt: "wXOeSn4QeSg", title: "Soulection Radio Show #611 (Keyrah Takeover)", label: "Soulection Radio #611", artist: "Soulection" },
  { yt: "kbtwb3uPJ48", title: "Romantic Soul Music from Detroit Mix【 THE NTS GUIDE TO… 】", label: "Romantic Soul from Detroit", artist: "NTS" },
  { yt: "bzLnA_9CN0A", title: "Joyce Wrice NTS Live at Jazz Cafe", label: "Joyce Wrice · Live at Jazz Cafe", artist: "NTS" },
  { yt: "waDz4H4YXFI", title: "Best of Slow Jams Mix / Old School Slow Jams - Mixed By DJ Day Day", label: "Best of Slow Jams", artist: "DJ Day Day" },
  { yt: "KWe8hobNNC4", title: "RnB Slow jams 90s 00s hit list | DJ VII | Usher, trey songs , Mariah Carey, Mario,alicia Keys", label: "90s / 00s R&B Slow Jams", artist: "DJ VII TORIA" },

  // ── Live rooms, short ──────────────────────────────────────────────────────
  { yt: "Qll7IHN0I4Q", title: "Snoh Aalegra: NPR Music Tiny Desk Concert", label: "Snoh Aalegra · Tiny Desk", artist: "NPR Music" },
  { yt: "8GGGliIxpgc", title: "Daniel Caesar - Best Part | A COLORS SHOW", label: "Daniel Caesar · Best Part (COLORS)", artist: "COLORS" },
  { yt: "CbDd295n3f0", title: "Alicia Keys feat. SiR - Three Hour Drive | A COLORS SHOW", label: "Alicia Keys & SiR · Three Hour Drive (COLORS)", artist: "COLORS" },

  // ── Singles, for texture ───────────────────────────────────────────────────
  { yt: "TWqUtor6Gdc", title: "Brent Faiyaz - Trust [Official Video]", label: "Trust", artist: "Brent Faiyaz" },
  { yt: "uWRlisQu4fo", title: "GIVĒON - Heartbreak Anniversary (Official Music Video)", label: "Heartbreak Anniversary", artist: "GiveonVEVO", by: "GIVĒON" },
  { yt: "SMpMLTpEXVk", title: "Cleo Sol - Why Don't You (Audio)", label: "Why Don't You", artist: "Cleo Sol" },
  { yt: "4976Fgvf5Ps", title: "Snoh Aalegra - I Want You Around", label: "I Want You Around", artist: "Snoh Aalegra" },
  { yt: "7803h_cLsbc", title: "Raveena - Temptation", label: "Temptation", artist: "Raveena Aurora", by: "Raveena" },
  { yt: "_WcWHZc8s2I", title: "Sade - No Ordinary Love - Official - 1992", label: "No Ordinary Love", artist: "SadeVEVO" },
  { yt: "SxVNOnPyvIU", title: "D'Angelo - Untitled (How Does It Feel) (Official Music Video)", label: "Untitled (How Does It Feel)", artist: "DAngeloVEVO", by: "D'Angelo" },
  { yt: "3qpyDUfMq-8", title: "Erykah Badu - Other Side Of The Game", label: "Other Side Of The Game", artist: "ErykahBaduVEVO", by: "Erykah Badu" },
];

/** Verified via https://open.spotify.com/oembed. */
export const SPOTIFY = { id: "37i9dQZF1DX2UgsUIg75Vg", title: "Chilled R&B" };
