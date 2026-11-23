import type { Metadata } from "next";
import { PlaylistIndex } from "@/components/PlaylistIndex";
import { listCurated } from "@/lib/store";
import { dbConfigured } from "@/lib/db";

const title = "Curated · Rooms we made";
const description = "Playlists put together by hand. Pick one and press play.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Lokey" },
};

// Rooms are seeded by hand in SQL, so nothing can revalidate on write. An hour
// is how long a new room takes to appear.
export const revalidate = 3600;

export default async function CuratedPage() {
  return (
    <PlaylistIndex
      heading="Curated"
      subtitle="Rooms we put together by hand"
      rooms={await listCurated()}
      empty={
        dbConfigured
          ? "Nothing here yet. The first curated room is on its way."
          : "Curated rooms need a database. Not configured yet."
      }
      nav={{ href: "/global", label: "Global →" }}
      footer={{ href: "/forecast", label: "Forecast →" }}
    />
  );
}
