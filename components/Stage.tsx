"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QUEUE, SPOTIFY } from "@/lib/queue";
import { BACKDROPS, backdropFor } from "@/lib/backdrops";
import { useQueue } from "@/lib/useQueue";
import { displayArtist, displayTitle } from "@/lib/player";
import { Backdrop } from "./Backdrop";
import { Mark } from "./Mark";
import { YouTubePlayer } from "./YouTubePlayer";
import { Seek, Controls } from "./Transport";

const label = "font-mono text-[10px] uppercase tracking-[0.2em]";

export function Stage() {
  const { hostRef, ready, playing, elapsed, duration, index, track, notice, skip, toggle, seek } =
    useQueue(QUEUE);

  // Client-side only: the server has no idea what time it is where you are,
  // and guessing is a hydration mismatch.
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase(),
      );
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* The room changes with the record. */}
      <Backdrop
        id="room"
        sources={backdropFor(BACKDROPS.room, index)}
        scrim="from-black/60 via-black/42 to-black/88"
      />

      <div className="relative flex min-h-dvh flex-col px-6 py-6 sm:px-10">
        <header className={`${label} flex items-center justify-between gap-4 text-ink-muted`}>
          <span className="tabular-nums">{clock}</span>

          <span className="hidden items-center gap-2 sm:flex">
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full bg-emerald-400 ${playing ? "animate-[dotPulse_1.8s_ease-in-out_infinite]" : "opacity-50"}`}
            />
            {QUEUE.length} in rotation
          </span>

          <nav className="flex gap-5">
            <Link href="/curated" className="transition-colors hover:text-ink">
              Curated
            </Link>
            <Link href="/playlists" className="transition-colors hover:text-ink">
              Playlists
            </Link>
            <a
              href={`https://open.spotify.com/playlist/${SPOTIFY.id}`}
              target="_blank"
              rel="noreferrer"
              className="hidden transition-colors hover:text-ink sm:inline"
            >
              Spotify ↗
            </a>
          </nav>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center py-10">
          <Mark className="rise h-8 w-auto text-ink/75 [filter:drop-shadow(0_2px_18px_rgba(0,0,0,0.6))]" />
          <h1
            className="rise mt-6 text-center font-serif text-[clamp(3rem,11vw,8rem)] leading-[0.84] tracking-[-0.02em] [text-shadow:0_2px_50px_rgba(0,0,0,0.65)]"
            style={{ animationDelay: "80ms" }}
          >
            Lokey
          </h1>
        </div>

        {/* The player is visible and stays visible — see YouTubePlayer for why. */}
        <div className="rise mx-auto w-full max-w-5xl" style={{ animationDelay: "200ms" }}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-7">
            <YouTubePlayer hostRef={hostRef} className="sm:w-[380px] sm:shrink-0" />

            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <div className="min-w-0">
                <p className="truncate text-[15px] leading-tight">{displayTitle(track)}</p>
                <p className={`${label} mt-1.5 truncate text-ink-faint`}>{displayArtist(track)}</p>
              </div>
              <Controls
                playing={playing}
                ready={ready}
                onPrev={() => skip(-1)}
                onNext={() => skip(1)}
                onToggle={toggle}
              />
            </div>
          </div>

          <div className="mt-5">
            <Seek id="seek-room" elapsed={elapsed} duration={duration} onSeek={seek} />
          </div>
        </div>

        <p role="status" aria-live="polite" className="mt-2 min-h-4 text-center text-xs text-ink-faint">
          {notice}
        </p>

        <footer className={`${label} mt-3 flex items-center justify-between gap-4 text-ink-faint`}>
          <Link href="/forecast" className="transition-colors hover:text-ink">
            Forecast →
          </Link>
          <a href="https://scenestudio.corsw.in" className="transition-colors hover:text-ink">
            Scene
          </a>
        </footer>
      </div>
    </>
  );
}
