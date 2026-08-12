import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Room } from "@/components/Room";
import { PlaylistEditor } from "@/components/PlaylistEditor";
import { getPlaylist, markRefreshed } from "@/lib/store";
import { refreshTracks } from "@/lib/resolveTrack";
import { isShareCode, toTrack } from "@/lib/playlists";

/** `noindex` is the single highest-value line in the whole anonymous-playlist
 *  feature. Text spam on unauthenticated public pages is overwhelmingly SEO
 *  spam; if the pages are never indexed the payload is worthless and the
 *  volume collapses before it needs moderating. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  if (!isShareCode(code)) notFound();

  const playlist = await getPlaylist(code);
  if (!playlist || playlist.tracks.length === 0) notFound();

  // Titles came from YouTube, so they live on a 30-day clock (III.E.4.d:
  // "delete or refresh"). This is the refresh, driven by the read so it costs
  // one write per playlist per month rather than a scheduled job. It also
  // means a video renamed on YouTube shows its new title here.
  let tracks = playlist.tracks;
  if (playlist.stale) {
    tracks = await refreshTracks(playlist.tracks);
    await markRefreshed(code, tracks);
  }

  return (
    <Room
      title={playlist.title}
      note={code}
      tracks={tracks.map(toTrack)}
      back={{ href: "/playlists", label: "Playlists →" }}
      editor={
        playlist.curated ? null : (
          <PlaylistEditor code={code} title={playlist.title} tracks={tracks} />
        )
      }
    />
  );
}
