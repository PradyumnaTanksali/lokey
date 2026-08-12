import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Room } from "@/components/Room";
import { PlaylistEditor } from "@/components/PlaylistEditor";
import { getPlaylist } from "@/lib/store";
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

  return (
    <Room
      title={playlist.title}
      note={code}
      tracks={playlist.tracks.map(toTrack)}
      back={{ href: "/playlists", label: "Playlists →" }}
      editor={
        playlist.curated ? null : (
          <PlaylistEditor code={code} title={playlist.title} tracks={playlist.tracks} />
        )
      }
    />
  );
}
