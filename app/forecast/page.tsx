import type { Metadata } from "next";
import { Player } from "@/components/Player";
import { FORECAST } from "@/lib/forecast";

const title = "Forecast · Pick the weather, we'll score it";
const description =
  "Four weather moods, scored in lofi. Downpour, Golden Hour, Fog, Small Hours. A sample build by Scene.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Room Service" },
  twitter: { card: "summary_large_image", title, description },
};

export default function ForecastPage() {
  return (
    <Player
      weather
      rooms={FORECAST}
      name="Forecast"
      tagline="Pick the weather, we score it"
      sibling={{ href: "/", label: "← Room Service" }}
    />
  );
}
