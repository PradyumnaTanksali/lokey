import { NextResponse } from "next/server";
import { parseVideoId } from "@/lib/playlists";
import { cleanArtist, cleanTitle } from "@/lib/player";

export const runtime = "nodejs";

/** Turns a pasted url into a title and artist.
 *
 *  The important part is the shape of the trust boundary: the client sends
 *  whatever it likes, we extract an 11-character id from it, and then WE build
 *  the oEmbed url from that id. The user's string is never fetched. That is the
 *  difference between a metadata lookup and an SSRF.
 *
 *  oEmbed needs no API key and no quota, unlike the Data API. */
export async function GET(request: Request) {
  const input = new URL(request.url).searchParams.get("url") ?? "";
  const id = parseVideoId(input);
  if (!id) {
    return NextResponse.json({ error: "not a YouTube link" }, { status: 400 });
  }

  const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${id}`,
  )}&format=json`;

  try {
    const response = await fetch(oembed, {
      signal: AbortSignal.timeout(6000),
      // Video metadata is immutable in practice; let the platform cache it.
      next: { revalidate: 86_400 },
    });
    if (!response.ok) {
      return NextResponse.json({ error: "no such video" }, { status: 404 });
    }
    const data = (await response.json()) as { title?: unknown; author_name?: unknown };
    const title = typeof data.title === "string" ? data.title : "";
    const author = typeof data.author_name === "string" ? data.author_name : "";
    if (!title) return NextResponse.json({ error: "no such video" }, { status: 404 });

    // Same cleaners the rooms use, so a pasted track reads like a curated one.
    return NextResponse.json({ v: id, t: cleanTitle(title), a: cleanArtist(author) });
  } catch {
    return NextResponse.json({ error: "lookup failed" }, { status: 502 });
  }
}
