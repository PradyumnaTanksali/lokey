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

/** YouTube titles come dressed for YouTube. Undress them. */
export function cleanTitle(title: string): string {
  return title
    .replace(/\s*[([](?:official|lyric|audio|visuali[sz]er|hd|4k|full)[^)\]]*[)\]]/gi, "")
    .replace(/\s*[|-]\s*(?:official\s+)?(?:music\s+)?video\s*$/i, "")
    .trim();
}

/** "SZAVEVO" is a channel, not an artist. */
export function cleanArtist(artist: string): string {
  return artist.replace(/\s*VEVO$/i, "").replace(/\s*-\s*Topic$/i, "").trim();
}
