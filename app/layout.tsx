import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const title = "Baithak · Chill R&B, ek room mein.";
const description =
  "A listening room for slow R&B. Pick a mood, press play, stop scrolling. Plays from YouTube, hands off to Spotify. No login, no algorithm. A Scene sample build.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Baithak", locale: "en_IN" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[100] mix-blend-overlay opacity-[0.04] bg-[url('/noise.svg')]"
        />
        {children}
      </body>
    </html>
  );
}
