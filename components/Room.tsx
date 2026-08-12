"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Track } from "@/lib/queue";
import { useQueue } from "@/lib/useQueue";
import { displayArtist, displayTitle } from "@/lib/player";
import { Backdrop } from "./Backdrop";
import { Mark } from "./Mark";
import { YouTubePlayer } from "./YouTubePlayer";
import { Seek, Controls } from "./Transport";

const label = "font-mono text-[10px] uppercase tracking-[0.2em]";

type Props = {
  title: string;
  tracks: Track[];
  /** Shown under the title — a share code, or a curator's note. */
  note?: string;
  back: { href: string; label: string };
  /** Edit controls, rendered only when the viewer owns the playlist. */
  editor?: ReactNode;
};

/** One player for anything that is just a list of tracks: curated rooms and
 *  shared playlists both land here. The backdrop is the current track's cover
 *  art rather than footage, with the gradient base underneath carrying the
 *  screen whenever the art is missing or slow. */
export function Room({ title, tracks, note, back, editor }: Props) {
  const { hostRef, ready, playing, elapsed, duration, index, track, notice, skip, toggle, pick, seek } =
    useQueue(tracks);

  return (
    <>
      <Backdrop id="cover" image={`https://i.ytimg.com/vi/${track.yt}/hqdefault.jpg`} />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-6 py-6 sm:px-10">
        <header className={`${label} flex items-center justify-between gap-4 text-ink-muted`}>
          <Link href="/" className="flex items-center gap-2 text-ink transition-opacity hover:opacity-70">
            <Mark className="size-3.5" />
            Lokey
          </Link>
          <Link href={back.href} className="transition-colors hover:text-ink">
            {back.label}
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center py-10">
          <h1 className="mb-1 text-center font-serif text-[clamp(1.75rem,6vw,3rem)] leading-tight tracking-[-0.02em] text-balance">
            {title}
          </h1>
          {note && <p className={`${label} mb-5 text-center text-ink-faint`}>{note}</p>}

          <YouTubePlayer hostRef={hostRef} className="mt-4" />

          <p className="mt-6 truncate text-center text-[15px] leading-tight text-ink-muted">
            {displayTitle(track)}
          </p>
          <p className={`${label} mt-1.5 truncate text-center text-ink-faint`}>
            {displayArtist(track)}
          </p>

          <div className="mt-5">
            <Seek id="seek-room-list" elapsed={elapsed} duration={duration} onSeek={seek} />
          </div>

          <div className="mt-3 flex justify-center">
            <Controls
              playing={playing}
              ready={ready}
              onPrev={() => skip(-1)}
              onNext={() => skip(1)}
              onToggle={toggle}
            />
          </div>

          <p role="status" aria-live="polite" className="mt-3 min-h-4 text-center text-xs text-ink-faint">
            {notice}
          </p>

          <details className="mt-4 border-t border-line-soft pt-4">
            <summary
              className={`${label} cursor-pointer list-none text-ink-faint transition-colors hover:text-ink [&::-webkit-details-marker]:hidden`}
            >
              Tracklist · {tracks.length}
            </summary>
            <ol className="mt-3">
              {tracks.map((t, i) => (
                <li key={`${t.yt}-${i}`}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    aria-current={i === index ? "true" : undefined}
                    className="group flex w-full items-baseline gap-3 py-2 text-left"
                  >
                    <span className={`${label} w-5 shrink-0 ${i === index ? "text-ink" : "text-ink-faint"}`}>
                      {i === index && playing ? "▸" : String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 truncate text-sm transition-colors ${
                        i === index ? "text-ink" : "text-ink-muted group-hover:text-ink"
                      }`}
                    >
                      {displayTitle(t)}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </details>

          {editor}
        </div>
      </div>
    </>
  );
}
