import { NextResponse } from "next/server";
import { parseListId, TRACKS_MAX, type StoredTrack } from "@/lib/playlists";
import { cleanArtist, cleanTitle } from "@/lib/player";

export const runtime = "nodejs";

/** Expands a YouTube / YouTube Music playlist link into its tracks.
 *
 *  This needs the Data API and therefore an API key. That is not an oversight:
 *  scraping the playlist page for video ids would be both brittle and against
 *  the terms, and oEmbed returns a playlist's *title* but never its contents.
 *  Without a key the feature declines cleanly and adding songs one at a time
 *  still works.
 *
 *  Same trust boundary as /api/resolve: the user's string is parsed down to a
 *  playlist id and then WE build the googleapis url. Their url is never fetched.
 *
 *  Quota: playlistItems.list is 1 unit per page of 50, so a 100-track import
 *  costs 2, plus 1 for the name. The free 10,000/day allows thousands of these. */
const API = "https://www.googleapis.com/youtube/v3";
const PAGE = 50;

type Item = {
  snippet?: {
    title?: string;
    videoOwnerChannelTitle?: string;
    resourceId?: { videoId?: string };
  };
};

export async function GET(request: Request) {
  const listId = parseListId(new URL(request.url).searchParams.get("url") ?? "");
  if (!listId) {
    return NextResponse.json(
      { error: "That isn't a public YouTube playlist link." },
      { status: 400 },
    );
  }

  // Validate the input before considering whether the feature is switched on.
  // Hostile input should be rejected on its own terms, not accidentally by a
  // missing environment variable — and this keeps the guards testable locally.
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Playlist import isn't configured. Add songs one at a time for now." },
      { status: 503 },
    );
  }

  try {
    const tracks: StoredTrack[] = [];
    let pageToken = "";

    while (tracks.length < TRACKS_MAX) {
      const url =
        `${API}/playlistItems?part=snippet&maxResults=${PAGE}` +
        `&playlistId=${encodeURIComponent(listId)}&key=${encodeURIComponent(key)}` +
        (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "");

      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (response.status === 404) {
        return NextResponse.json({ error: "No such public playlist." }, { status: 404 });
      }
      if (!response.ok) {
        return NextResponse.json({ error: "YouTube refused that playlist." }, { status: 502 });
      }

      const data = (await response.json()) as { items?: Item[]; nextPageToken?: string };
      for (const item of data.items ?? []) {
        const id = item.snippet?.resourceId?.videoId;
        const title = item.snippet?.title ?? "";
        // Removed entries stay in the list as tombstones with these exact
        // titles and no usable video, so they have to be dropped by hand.
        if (!id || title === "Private video" || title === "Deleted video") continue;
        if (tracks.length >= TRACKS_MAX) break;
        tracks.push({
          v: id,
          t: cleanTitle(title),
          a: cleanArtist(item.snippet?.videoOwnerChannelTitle ?? ""),
        });
      }

      if (!data.nextPageToken) break;
      pageToken = data.nextPageToken;
    }

    if (tracks.length === 0) {
      return NextResponse.json(
        { error: "That playlist is empty, or its videos are private." },
        { status: 404 },
      );
    }

    // The playlist's own name, to prefill the title field. Non-fatal: a failure
    // here just means the user names it themselves.
    let name: string | undefined;
    try {
      const meta = await fetch(
        `${API}/playlists?part=snippet&id=${encodeURIComponent(listId)}&key=${encodeURIComponent(key)}`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (meta.ok) {
        const parsed = (await meta.json()) as { items?: { snippet?: { title?: string } }[] };
        name = parsed.items?.[0]?.snippet?.title;
      }
    } catch {
      /* naming is the user's job then */
    }

    return NextResponse.json({ name, tracks });
  } catch {
    return NextResponse.json({ error: "Import failed." }, { status: 502 });
  }
}
