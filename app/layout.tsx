import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const title = "Room Service · Slow R&B, four rooms";
const description =
  "A listening room for slow R&B, and a Forecast room that scores the weather in lofi. Pick a room, press play. No login, no algorithm, no front desk. A sample build by Scene.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Room Service" },
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
          className="pointer-events-none fixed inset-0 z-[100] mix-blend-overlay opacity-[0.05] bg-[url('/noise.svg')]"
        />
        {children}
      </body>
    </html>
  );
}
