export type Track = {
  /** YouTube video id — verify with the oEmbed endpoint before committing. */
  yt: string;
  /** oEmbed `title`, verbatim. The UI strips the "(Official Video)" part. */
  title: string;
  /** Display override, for the handful of titles no rule can rescue without
   *  also eating real ones. `title` stays verbatim so the source is traceable. */
  label?: string;
  /** oEmbed `author_name`, verbatim. The UI strips the "VEVO" part. */
  artist: string;
};

export type Room = {
  id: string;
  name: string;
  tagline: string;
  spotify: { kind: "playlist" | "album"; id: string; title: string } | null;
  tracks: Track[];
};

export const ROOMS: Room[] = [
  {
    id: "late-night-drive",
    name: "Late Night Drive",
    tagline: "Empty roads, full bass.",
    spotify: { kind: "playlist", id: "0X4K4T2IqcV3MAZ7HhB8Qy", title: "R&B Late night drive" },
    tracks: [
      { yt: "O1OTWCd40bc", title: "The Weeknd - Wicked Games (Official Video - Explicit)", artist: "TheWeekndVEVO" },
      { yt: "uWRlisQu4fo", title: "GIVĒON - Heartbreak Anniversary (Official Music Video)", artist: "GiveonVEVO" },
      { yt: "yNNMKN9BUmU", title: "GIVĒON - Like I Want You (Official Audio)", artist: "GiveonVEVO" },
      { yt: "TWqUtor6Gdc", title: "Brent Faiyaz - Trust [Official Video]", artist: "Brent Faiyaz" },
      { yt: "Ockhq8E2FrA", title: "PARTYNEXTDOOR - Come and See Me [Official Music Video]", artist: "PARTYNEXTDOOR" },
      { yt: "aj9coPGuFkM", title: "Bryson Tiller - Exchange (Official Video)", artist: "BrysonTillerVEVO" },
      // ponytail: only non-official upload in the set — kept for the song, and
      // the player skips it on its own if it ever gets pulled.
      { yt: "uzS3WG6__G4", title: "Frank Ocean - Pink + White", artist: "Blonded" },
    ],
  },
  {
    id: "rainy-balcony",
    name: "Rainy Balcony",
    tagline: "Tea in one hand, chords in the other.",
    spotify: { kind: "playlist", id: "37i9dQZF1DX2UgsUIg75Vg", title: "Chilled R&B" },
    tracks: [
      { yt: "hKgl5-lkT8U", title: "Daniel Caesar & H.E.R. - Best Part, a Visual", artist: "DanielCaesarVEVO" },
      { yt: "uQFVqltOXRg", title: "Daniel Caesar - Get You ft. Kali Uchis [Official Video]", artist: "Daniel Caesar" },
      { yt: "2p3zZoraK9g", title: "SZA - Good Days (Official Video)", artist: "SZAVEVO" },
      { yt: "Z5ze4CUAkE8", title: "H.E.R. - Focus (Official Video)", artist: "HERMusicVEVO" },
      { yt: "SMpMLTpEXVk", title: "Cleo Sol - Why Don't You (Audio)", artist: "Cleo Sol" },
      { yt: "S0qrinhNnOM", title: "Solange - Cranes in the Sky (Official Video)", artist: "SolangeKnowlesVEVO" },
      { yt: "7803h_cLsbc", title: "Raveena - Temptation", artist: "Raveena Aurora" },
    ],
  },
  {
    id: "sunday-slow",
    name: "Sunday Slow",
    tagline: "Nothing planned. Keep it that way.",
    spotify: { kind: "playlist", id: "4433kuoUdsfF43lgePAMtR", title: "Greatest R&B Slow Jams" },
    tracks: [
      { yt: "_WcWHZc8s2I", title: "Sade - No Ordinary Love - Official - 1992", artist: "SadeVEVO" },
      { yt: "MmOau-PMWJk", title: "Sade - Kiss Of Life - Official - 1993", artist: "SadeVEVO" },
      { yt: "SxVNOnPyvIU", title: "D'Angelo - Untitled (How Does It Feel) (Official Music Video)", artist: "DAngeloVEVO" },
      { yt: "D7rm9t5S4uE", title: "Maxwell - Ascension (Don't Ever Wonder) (Official 4K Video)", artist: "maxwellVEVO" },
      { yt: "3qpyDUfMq-8", title: "Erykah Badu - Other Side Of The Game", artist: "ErykahBaduVEVO" },
      { yt: "LjvwRSKVQNs", title: "Jhené Aiko - While We're Young (Official Video)", artist: "JheneAikoVEVO" },
      { yt: "i7zsG3XFUd8", title: "Musiq - Just Friends (Sunny)", artist: "MusiqVEVO" },
    ],
  },
  {
    id: "3am-studio",
    name: "3AM Studio",
    tagline: "The deadline can wait.",
    spotify: { kind: "playlist", id: "4SUeq4oqa2FBC5XR50FXsS", title: "Moody R&B" },
    tracks: [
      { yt: "N7LBse25QP8", title: "dvsn - Too Deep (Official Audio)", artist: "dvsn" },
      { yt: "gDVufnezUAs", title: "dvsn - Hallucinations [Official Music Video]", artist: "dvsn" },
      { yt: "zaGv5lKHEN0", title: "6LACK - Free [Lyric Video]", artist: "6LACKVEVO" },
      { yt: "fS9m0Ac8PCU", title: "6LACK - PRBLMS [Official Music Video]", artist: "6LACKVEVO" },
      { yt: "4976Fgvf5Ps", title: "Snoh Aalegra - I Want You Around", artist: "Snoh Aalegra" },
      { yt: "4okpRs9LRDE", title: "Snoh Aalegra - Find someone like you", artist: "Snoh Aalegra" },
      { yt: "1l8vIAvAerE", title: "Summer Walker - Girls Need Love (Official Music Video)", artist: "SummerWalkerVEVO" },
    ],
  },
];
