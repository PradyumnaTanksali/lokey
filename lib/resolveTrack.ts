import "server-only";
import { cleanArtist, cleanTitle } from "./player";
import type { StoredTrack } from "./playlists";

/** Look up one video's title and channel from the keyless oEmbed endpoint.
 *
 *  Takes an already-validated 11-character id, never a user string: the caller
 *  parses, we build the url. That ordering is the SSRF guard, and it is why
 *  this function does not accept a url at all. */
export async function resolveTrack(id: string): Promise<StoredTrack | null> {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${id}`,
  )}&format=json`;

  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 86_400 },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as { title?: unknown; author_name?: unknown };
    if (typeof data.title !== "string" || !data.title) return null;

    return {
      v: id,
      t: cleanTitle(data.title),
      a: cleanArtist(typeof data.author_name === "string" ? data.author_name : ""),
    };
  } catch {
    return null;
  }
}

/** Refresh a whole tracklist. Anything that fails to resolve keeps its existing
 *  title rather than vanishing — a rename should never silently shorten
 *  someone's playlist. */
export async function refreshTracks(tracks: StoredTrack[]): Promise<StoredTrack[]> {
  const resolved = await Promise.all(tracks.map((track) => resolveTrack(track.v)));
  return tracks.map((track, i) => resolved[i] ?? track);
}
