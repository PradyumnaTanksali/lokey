import type { Metadata } from "next";
import { Playlists } from "@/components/Playlists";

const title = "Playlists · Paste links, get a code";
const description =
  "Build a playlist from YouTube links, get a share code, send it to whoever. No sign-up.";

export const metadata: Metadata = {
  title,
  description,
  // Same reasoning as /p/[code]: unindexed pages are worthless to SEO spam,
  // which is what an anonymous text field otherwise attracts.
  robots: { index: false, follow: false },
};

export default function PlaylistsPage() {
  return <Playlists />;
}
