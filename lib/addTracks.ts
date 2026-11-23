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

/** One paste box: a video or Spotify song link adds one track, a YouTube
 *  playlist link brings the whole thing in. Shared by the create flow and the editor so
 *  pasting behaves identically in both — and so playlist support only had to be
 *  taught to one place. */
export async function tracksFromLink(input: string): Promise<Added> {
  const link = classifyLink(input);
  if (!link) {
    throw new Error(
      /spotify\.com\/(?:intl-[a-z-]+\/)?(?:playlist|album)\//i.test(input)
        ? "Spotify playlists can't come in — Spotify closed that to apps. Paste songs one at a time."
        : "That is not a YouTube or Spotify song link.",
    );
  }

  const endpoint = { video: "/api/resolve", list: "/api/playlist-import", spotify: "/api/spotify" }[
    link.kind
  ];
  const response = await fetch(`${endpoint}?url=${encodeURIComponent(input.trim())}`);

  if (!response.ok) {
    throw new Error(
      await readError(
        response,
        link.kind === "list" ? "Could not import that playlist." : "Could not look that one up.",
      ),
    );
  }

  if (link.kind !== "list") {
    return { tracks: [(await response.json()) as StoredTrack] };
  }
  const data = (await response.json()) as { tracks: StoredTrack[]; name?: string };
  return { tracks: data.tracks, name: data.name };
}
