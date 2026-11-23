import Link from "next/link";
import { Mark } from "./Mark";
import { Backdrop } from "./Backdrop";
import type { Playlist } from "@/lib/store";

const label = "font-mono text-[10px] uppercase tracking-[0.2em]";

type Props = {
  heading: string;
  subtitle: string;
  rooms: Playlist[];
  empty: string;
  nav: { href: string; label: string };
  footer: { href: string; label: string };
};

/** The list page /curated and /global share: a heading and a column of rooms. */
export function PlaylistIndex({ heading, subtitle, rooms, empty, nav, footer }: Props) {
  return (
    <>
      <Backdrop id="cover" />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-6 py-6 sm:px-10">
        <header className={`${label} flex items-center justify-between gap-4 text-ink-muted`}>
          <Link href="/" className="flex items-center gap-2 text-ink transition-opacity hover:opacity-70">
            <Mark className="size-3.5" />
            Lokey
          </Link>
          <Link href={nav.href} className="transition-colors hover:text-ink">
            {nav.label}
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center py-14">
          <h1 className="text-center font-serif text-[clamp(2.25rem,8vw,4.5rem)] leading-tight tracking-[-0.02em]">
            {heading}
          </h1>
          <p className={`${label} mt-4 text-center text-ink-faint`}>{subtitle}</p>

          {rooms.length === 0 ? (
            <p className="mt-12 text-center text-sm text-ink-muted">{empty}</p>
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
          <Link href={footer.href} className="transition-colors hover:text-ink">
            {footer.label}
          </Link>
        </footer>
      </div>
    </>
  );
}
