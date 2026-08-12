"use client";

import { classifyLink, type StoredTrack } from "./playlists";

export type Added = { tracks: StoredTrack[]; name?: string };

async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
}

/** One paste box, two behaviours: a video link adds one track, a playlist link
 *  brings the whole thing in. Shared by the create flow and the editor so
 *  pasting behaves identically in both — and so playlist support only had to be
 *  taught to one place. */
export async function tracksFromLink(input: string): Promise<Added> {
  const link = classifyLink(input);
  if (!link) throw new Error("That is not a YouTube link.");

  const endpoint = link.kind === "video" ? "/api/resolve" : "/api/playlist-import";
  const response = await fetch(`${endpoint}?url=${encodeURIComponent(input.trim())}`);

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        link.kind === "video" ? "Could not look that one up." : "Could not import that playlist.",
      ),
    );
  }

  if (link.kind === "video") {
    return { tracks: [(await response.json()) as StoredTrack] };
  }
  const data = (await response.json()) as { tracks: StoredTrack[]; name?: string };
  return { tracks: data.tracks, name: data.name };
}
