"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QUEUE, SPOTIFY } from "@/lib/queue";
import { BACKDROPS, backdropFor } from "@/lib/backdrops";
import { useQueue } from "@/lib/useQueue";
import { displayArtist, displayTitle } from "@/lib/player";
import { Backdrop } from "./Backdrop";
import { Art } from "./Art";
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
        scrim="from-black/60 via-black/25 to-black/85"
      />

      {/* Audio only — the room is the interface. */}
      <div inert aria-hidden="true" className="fixed -left-[9999px] top-0 h-[180px] w-[320px]">
        <div ref={hostRef} />
      </div>

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
            <a
              href={`https://open.spotify.com/playlist/${SPOTIFY.id}`}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-ink"
            >
              Spotify ↗
            </a>
            <a
              href={`https://music.youtube.com/watch?v=${track.yt}`}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-ink"
            >
              YT Music ↗
            </a>
          </nav>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center py-16">
          <h1 className="rise text-center font-serif text-[clamp(3.5rem,13vw,10rem)] leading-[0.84] tracking-[-0.02em] [text-shadow:0_2px_50px_rgba(0,0,0,0.65)]">
            Room
            <br />
            Service
          </h1>
          <p className={`${label} rise mt-8 text-ink-faint`} style={{ animationDelay: "120ms" }}>
            Slow R&amp;B · sessions &amp; sets · no front desk
          </p>
        </div>

        {/* No panel. The type sits straight on the footage, and the scrubber is
            the only horizontal line on the page. */}
        <div className="rise mx-auto w-full max-w-5xl" style={{ animationDelay: "200ms" }}>
          <div className="flex items-end justify-between gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <Art
                videoId={track.yt}
                alt={`Cover art for ${displayTitle(track)}`}
                className="art-in size-12 shrink-0 rounded-lg object-cover shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
              />
              <div className="min-w-0">
                <p className="truncate text-[15px] leading-tight">{displayTitle(track)}</p>
                <p className={`${label} mt-1.5 truncate text-ink-faint`}>{displayArtist(track)}</p>
              </div>
            </div>

            <Controls
              playing={playing}
              ready={ready}
              onPrev={() => skip(-1)}
              onNext={() => skip(1)}
              onToggle={toggle}
            />
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
