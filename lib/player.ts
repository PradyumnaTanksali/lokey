/** mm:ss. Anything unknown or nonsense renders as a dash-clock, not NaN. */
export function fmt(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "–:––";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Wrap an index by `dir` steps. Empty list stays at 0 instead of going NaN. */
export function step(index: number, length: number, dir: number): number {
  if (length <= 0) return 0;
  return (((index + dir) % length) + length) % length;
}

/** Bracketed asides worth deleting: "[Official Video]", "[chill lofi beats]". */
const BRACKET_NOISE =
  /\b(?:lo-?fi|hip.?hop|jazz.?hop|chill.?hop|chill|beats|mix|study|sleep|relax|instrumental|ambient|no copyright|free|type beat|playlist|official|lyric|audio|visuali[sz]er|hd|4k|full)\b/i;

/** Trailing " - …" tails worth deleting. Deliberately narrower than the bracket
 *  list: a bare "Free" or "Focus" is a song title, not noise. */
const TAIL_NOISE =
  /\b(?:lo-?fi|hip.?hop|jazz.?hop|chill.?hop|beats to|chill beats|study|relax|sleep|homework|instrumental|playlist|type beat|ambient|concentration|background music)\b/i;

/** YouTube titles come dressed for YouTube, and lofi mixes come dressed for the
 *  algorithm. Undress them without eating the song. */
export function cleanTitle(title: string): string {
  // Bracketed asides, anywhere — but only the noisy ones. "(Don't Ever Wonder)"
  // and "(feat. …)" are part of the song.
  let out = title.replace(/\s*[([][^)\]]*[)\]]/g, (m) => (BRACKET_NOISE.test(m) ? "" : m));
  out = out.replace(/\s*[|-]\s*(?:official\s+)?(?:music\s+)?video\s*$/i, "");

  // Then peel noisy trailing segments, one at a time: "Rainy day • lofi ambient
  // music | chill beats to relax to" is three of them stacked. The separator has
  // to be surrounded by spaces, or "Lo-Fi" reads as its own segment.
  for (let i = 0; i < 4; i++) {
    const next = out.replace(/\s+[|•·–—-]{1,2}\s+[^|•·–—]*$/, (m) => (TAIL_NOISE.test(m) ? "" : m));
    if (next === out) break;
    out = next;
  }

  return out.replace(/\s{2,}/g, " ").trim();
}

/** What actually goes on screen: the hand-written label if a track has one,
 *  otherwise the cleaned-up YouTube title. */
export function displayTitle(track: { title: string; label?: string }): string {
  return track.label ?? cleanTitle(track.title);
}

/** Who goes under the title: the hand-written name if there is one, otherwise
 *  the channel with its suffix filed off. */
export function displayArtist(track: { artist: string; by?: string }): string {
  return track.by ?? cleanArtist(track.artist);
}

/** "SZAVEVO" is a channel, not an artist. */
export function cleanArtist(artist: string): string {
  return artist.replace(/\s*VEVO$/i, "").replace(/\s*-\s*Topic$/i, "").trim();
}
