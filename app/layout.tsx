import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import { ServiceWorker } from "@/components/ServiceWorker";
import "./globals.css";

/** The wordmark voice. High-contrast serif against dark footage reads as a
 *  place with a name, where a grotesque just reads as an app. */
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const title = "Lokey · Slow R&B, sessions & sets";
const description =
  "A listening room for slow R&B — DJ sessions, radio sets, and late-night singles. Plus Forecast, where you pick the weather and watch it. No login, no algorithm, nothing to sign up for. A sample build by Scene.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: "Lokey",
  openGraph: { title, description, type: "website", siteName: "Lokey" },
  twitter: { card: "summary_large_image", title, description },
  appleWebApp: { capable: true, title: "Lokey" },
};

/** Paints the browser and OS chrome to match the floor, so an installed window
 *  has no light seam above the video. */
export const viewport: Viewport = {
  themeColor: "#0C0A09",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} antialiased`}
    >
      <body>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[100] mix-blend-overlay opacity-[0.05] bg-[url('/noise.svg')]"
        />
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
