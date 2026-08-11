import type { Metadata } from "next";
import { Forecast } from "@/components/Forecast";

const title = "Forecast · Pick the weather, we score it";
const description =
  "Four weather moods, scored in lofi. Downpour, Golden Hour, Fog, Small Hours. A sample build by Scene.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Lokey" },
  twitter: { card: "summary_large_image", title, description },
};

export default function ForecastPage() {
  return <Forecast />;
}
