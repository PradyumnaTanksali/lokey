import { NextResponse } from "next/server";
import { parseSpotifyTrack } from "@/lib/playlists";
import { resolveTrack } from "@/lib/resolveTrack";

export const runtime = "nodejs";

/** A Spotify song link, played through YouTube like everything else.
 *
 *  Read the song's name (and artist, when Spotify keys are set) from Spotify,
 *  search YouTube for it, keep the first embeddable video. Nothing from Spotify
 *  is stored — the saved track is the YouTube id plus its oEmbed title, so it
 *  sits on the same 30-day refresh as a pasted YouTube link.
 *
 *  Same trust boundary as /api/resolve: the user's string is parsed down to a
 *  22-character id and every url fetched here is built by us.
 *
 *  Quota: search.list is 100 units, so the free 10,000/day is ~100 songs/day
 *  across all users. ponytail: no match cache beyond the fetch cache; ask Google
 *  for more quota if that ceiling is ever hit. */
const YT = "https://www.googleapis.com/youtube/v3";

type Song = { title: string; artist: string };

let token: { value: string; expires: number } | null = null;

/** Client-credentials token, reused until a minute before it lapses. Null when
 *  no Spotify app is configured — then the song is looked up by title alone. */
async function spotifyToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;
  if (token && token.expires > Date.now()) return token.value;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) return null;
  token = { value: data.access_token, expires: Date.now() + ((data.expires_in ?? 3600) - 60) * 1000 };
  return token.value;
}

async function spotifySong(id: string): Promise<Song | null> {
  const bearer = await spotifyToken();
  if (bearer) {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { authorization: `Bearer ${bearer}` },
      signal: AbortSignal.timeout(6000),
    });
    if (response.ok) {
      const data = (await response.json()) as { name?: string; artists?: { name?: string }[] };
      if (data.name) {
        const artist = (data.artists ?? []).map((a) => a.name).filter(Boolean).join(" ");
        return { title: data.name, artist };
      }
    }
  }

  // Keyless fallback: oEmbed gives the song name but never the artist.
  const response = await fetch(
    `https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${id}`)}`,
    { signal: AbortSignal.timeout(6000), next: { revalidate: 86_400 } },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as { title?: unknown };
  return typeof data.title === "string" && data.title ? { title: data.title, artist: "" } : null;
}

export async function GET(request: Request) {
  const id = parseSpotifyTrack(new URL(request.url).searchParams.get("url") ?? "");
  if (!id) {
    return NextResponse.json({ error: "That isn't a Spotify song link." }, { status: 400 });
  }

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Spotify links aren't switched on yet. Paste the YouTube link instead." },
      { status: 503 },
    );
  }

  try {
    const song = await spotifySong(id);
    if (!song) return NextResponse.json({ error: "No such Spotify song." }, { status: 404 });

    const q = `${song.artist} ${song.title}`.trim();
    const search = await fetch(
      `${YT}/search?part=id&type=video&videoEmbeddable=true&maxResults=1` +
        `&q=${encodeURIComponent(q)}&key=${encodeURIComponent(key)}`,
      // Same song pasted twice costs one search, not two.
      { signal: AbortSignal.timeout(8000), next: { revalidate: 86_400 } },
    );
    if (!search.ok) {
      return NextResponse.json({ error: "YouTube search is unavailable right now." }, { status: 502 });
    }
    const found = (await search.json()) as { items?: { id?: { videoId?: string } }[] };
    const videoId = found.items?.[0]?.id?.videoId;
    if (!videoId) {
      return NextResponse.json({ error: `Couldn't find "${song.title}" on YouTube.` }, { status: 404 });
    }

    // oEmbed for the stored title, so it matches every other track's source.
    const track = await resolveTrack(videoId);
    return track
      ? NextResponse.json(track)
      : NextResponse.json({ error: `Couldn't find "${song.title}" on YouTube.` }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
  }
}
