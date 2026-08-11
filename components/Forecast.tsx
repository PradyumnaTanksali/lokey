"use client";

import { useState } from "react";
import Link from "next/link";
import { FORECAST } from "@/lib/forecast";
import { BACKDROPS, SCRIMS } from "@/lib/backdrops";
import { useQueue } from "@/lib/useQueue";
import { displayArtist, displayTitle } from "@/lib/player";
import { Backdrop } from "./Backdrop";
import { Art } from "./Art";
import { Seek, Controls } from "./Transport";

const label = "font-mono text-[10px] uppercase tracking-[0.2em]";

export function Forecast() {
  const [roomIndex, setRoomIndex] = useState(0);
  const room = FORECAST[roomIndex];

  // The queue resets itself when the track list changes identity, so switching
  // weather starts that room from the top.
  const { hostRef, ready, playing, elapsed, duration, index, track, notice, skip, toggle, pick, seek } =
    useQueue(room.tracks);

  return (
    <>
      <Backdrop id={room.id} sources={BACKDROPS[room.id] ?? []} scrim={SCRIMS[room.id]} />

      <div inert aria-hidden="true" className="fixed -left-[9999px] top-0 h-[180px] w-[320px]">
        <div ref={hostRef} />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-7">
        <header className={`${label} flex items-baseline justify-between gap-4`}>
          <span className="text-xs tracking-[0.3em] text-ink">Forecast</span>
          <Link
            href="/"
            className="text-ink-faint underline decoration-line underline-offset-4 transition-colors hover:text-ink"
          >
            ← Room Service
          </Link>
        </header>

        <main className="rise mt-8 rounded-[28px] glass p-5">
          <div className="relative -mx-1 flex gap-1 overflow-x-auto pb-3">
            {FORECAST.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoomIndex(i)}
                aria-pressed={i === roomIndex}
                className={`${label} shrink-0 whitespace-nowrap rounded-full px-3 py-2 transition-colors ${
                  i === roomIndex
                    ? "bg-ink text-floor"
                    : "text-ink-faint hover:bg-white/5 hover:text-ink"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          <Art
            videoId={track.yt}
            alt={`Cover art for ${displayTitle(track)}`}
            className="art-in relative mt-1 aspect-square w-full rounded-2xl object-cover shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
          />

          <p className={`${label} relative mt-5 text-ink-faint`}>{room.tagline}</p>
          <h1 className="relative mt-2 text-xl font-medium leading-snug tracking-[-0.02em] text-balance">
            {displayTitle(track)}
          </h1>
          <p className="relative mt-1 text-sm text-ink-muted">{displayArtist(track)}</p>

          <div className="relative mt-5">
            <Seek id="seek-forecast" elapsed={elapsed} duration={duration} onSeek={seek} />
          </div>

          <div className="relative mt-4 flex items-center justify-between">
            <Controls
              playing={playing}
              ready={ready}
              onPrev={() => skip(-1)}
              onNext={() => skip(1)}
              onToggle={toggle}
            />
            <div className={`${label} flex gap-4 text-ink-faint`}>
              <a
                href={`https://www.youtube.com/watch?v=${track.yt}`}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-line underline-offset-4 transition-colors hover:text-ink"
              >
                YouTube
              </a>
              {room.spotify && (
                <a
                  href={`https://open.spotify.com/${room.spotify.kind}/${room.spotify.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-line underline-offset-4 transition-colors hover:text-ink"
                >
                  Spotify
                </a>
              )}
            </div>
          </div>

          <p role="status" aria-live="polite" className="relative mt-3 min-h-4 text-xs text-ink-faint">
            {notice}
          </p>

          {/* <details> is a disclosure widget already. No state, no library. */}
          <details className="relative mt-4 border-t border-line-soft pt-4">
            <summary
              className={`${label} cursor-pointer list-none text-ink-faint transition-colors hover:text-ink [&::-webkit-details-marker]:hidden`}
            >
              Tracklist · {room.tracks.length}
            </summary>
            <ol className="mt-3">
              {room.tracks.map((t, i) => (
                <li key={t.yt}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    aria-current={i === index ? "true" : undefined}
                    className="group flex w-full items-baseline gap-3 py-2 text-left"
                  >
                    <span className={`${label} w-4 shrink-0 ${i === index ? "text-ink" : "text-ink-faint"}`}>
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
        </main>

        <footer className={`${label} mt-auto pt-8 text-center text-ink-faint`}>
          <a
            href="https://scenestudio.corsw.in"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-ink"
          >
            A sample build by Scene
          </a>
        </footer>
      </div>
    </>
  );
}
