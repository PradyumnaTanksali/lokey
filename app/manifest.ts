import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lokey · Slow R&B, sessions & sets",
    short_name: "Lokey",
    description:
      "A listening room for slow R&B — DJ sessions, radio sets, and late-night singles. Plus Forecast, where you pick the weather and watch it.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0C0A09",
    theme_color: "#0C0A09",
    orientation: "any",
    categories: ["music", "entertainment"],
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      // Same asset: the mark is drawn inside the middle 80%, so a circular
      // maskable crop can't clip it and a padded variant would be a second
      // thing to keep in sync.
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
