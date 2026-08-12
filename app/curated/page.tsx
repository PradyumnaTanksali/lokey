import type { Metadata } from "next";
import Link from "next/link";
import { Mark } from "@/components/Mark";
import { Backdrop } from "@/components/Backdrop";
import { listCurated } from "@/lib/store";
import { dbConfigured } from "@/lib/db";

const title = "Curated · Rooms we made";
const description = "Playlists put together by hand. Pick one and press play.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Lokey" },
};

const label = "font-mono text-[10px] uppercase tracking-[0.2em]";

export default async function CuratedPage() {
  const rooms = await listCurated();

  return (
    <>
      <Backdrop id="cover" />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-6 py-6 sm:px-10">
        <header className={`${label} flex items-center justify-between gap-4 text-ink-muted`}>
          <Link href="/" className="flex items-center gap-2 text-ink transition-opacity hover:opacity-70">
            <Mark className="size-3.5" />
            Lokey
          </Link>
          <Link href="/playlists" className="transition-colors hover:text-ink">
            Playlists →
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center py-14">
          <h1 className="text-center font-serif text-[clamp(2.25rem,8vw,4.5rem)] leading-tight tracking-[-0.02em]">
            Curated
          </h1>
          <p className={`${label} mt-4 text-center text-ink-faint`}>Rooms we put together by hand</p>

          {rooms.length === 0 ? (
            <p className="mt-12 text-center text-sm text-ink-muted">
              {dbConfigured
                ? "Nothing here yet. The first curated room is on its way."
                : "Curated rooms need a database. Not configured yet."}
            </p>
          ) : (
            <ul className="mt-12 border-t border-line-soft">
              {rooms.map((room) => (
                <li key={room.code}>
                  <Link
                    href={`/p/${room.code}`}
                    className="group flex items-baseline justify-between gap-4 border-b border-line-soft py-4 transition-colors"
                  >
                    <span className="truncate text-[15px] text-ink-muted group-hover:text-ink">
                      {room.title}
                    </span>
                    <span className={`${label} shrink-0 text-ink-faint`}>
                      {room.tracks.length} tracks
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className={`${label} mt-auto pt-8 text-center text-ink-faint`}>
          <Link href="/forecast" className="transition-colors hover:text-ink">
            Forecast →
          </Link>
        </footer>
      </div>
    </>
  );
}
