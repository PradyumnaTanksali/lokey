import type { Metadata } from "next";
import { PlaylistIndex } from "@/components/PlaylistIndex";
import { listGlobal } from "@/lib/store";
import { dbConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Global · Playlists people shared",
  description: "Playlists Lokey listeners chose to list. Pick one and press play.",
  // Anonymous titles on an indexed page are what SEO spam looks for. Unindexed,
  // a spam title is worth nothing — same reasoning as /p/[code].
  robots: { index: false, follow: false },
};

// The playlist routes revalidate this on every create/edit/delete, so the hour
// only matters for rows hidden by hand in SQL.
export const revalidate = 3600;

export default async function GlobalPage() {
  return (
    <PlaylistIndex
      heading="Global"
      subtitle="Playlists people chose to share"
      rooms={await listGlobal()}
      empty={
        dbConfigured
          ? "Nobody has listed one yet. Make one and tick Show in Global."
          : "Global playlists need a database. Not configured yet."
      }
      nav={{ href: "/playlists", label: "Make one →" }}
      footer={{ href: "/curated", label: "Curated →" }}
    />
  );
}
