"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QUEUE, SPOTIFY } from "@/lib/queue";
import { BACKDROPS } from "@/lib/backdrops";
import { useQueue } from "@/lib/useQueue";
import { displayArtist, displayTitle } from "@/lib/player";
import { Backdrop } from "./Backdrop";
import { Art } from "./Art";
import { Seek, Controls } from "./Transport";

const label = "font-mono text-[10px] uppercase tracking-[0.2em]";

export function Stage() {
  const { hostRef, ready, playing, elapsed, duration, track, notice, skip, toggle, seek } =
    useQueue(QUEUE);

  // Rendered client-side only: the server has no idea what time it is where you
  // are, and guessing is a hydration mismatch.
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date()
          .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
          .toLowerCase(),
      );
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Backdrop id="room" sources={BACKDROPS.room} scrim="from-black/55 via-black/25 to-black/85" />

      {/* Audio only — the room is the interface. */}
      <div inert aria-hidden="true" className="fixed -left-[9999px] top-0 h-[180px] w-[320px]">
        <div ref={hostRef} />
      </div>

      <div className="relative flex min-h-dvh flex-col px-5 py-6 sm:px-8">
        <header className={`${label} flex items-center justify-between gap-4 text-ink-muted`}>
          <span className="tabular-nums">{clock}</span>

          <span className="hidden items-center gap-2 sm:flex">
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full bg-emerald-400 ${playing ? "animate-[dotPulse_1.8s_ease-in-out_infinite]" : "opacity-50"}`}
            />
            {QUEUE.length} in rotation
          </span>

          <nav className="flex gap-4">
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

        <div className="flex flex-1 flex-col items-center justify-center py-14">
          <h1 className="rise text-center text-[clamp(2.75rem,10vw,7.5rem)] font-medium uppercase leading-[0.88] tracking-[-0.02em] [text-shadow:0_2px_40px_rgba(0,0,0,0.6)]">
            Room
            <br />
            Service
          </h1>
          <p className={`${label} rise mt-6 text-ink-faint`} style={{ animationDelay: "120ms" }}>
            Slow R&amp;B · sessions &amp; sets · no front desk
          </p>
        </div>

        <div
          className="rise mx-auto w-full max-w-2xl rounded-[28px] glass px-4 py-3.5"
          style={{ animationDelay: "200ms" }}
        >
          <div className="relative flex items-center gap-4">
            <Art
              videoId={track.yt}
              alt={`Cover art for ${displayTitle(track)}`}
              className="art-in size-14 shrink-0 rounded-2xl object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight">{displayTitle(track)}</p>
              <p className="mt-0.5 truncate text-xs text-ink-muted">{displayArtist(track)}</p>
              <div className="mt-2">
                <Seek id="seek-room" elapsed={elapsed} duration={duration} onSeek={seek} />
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
        </div>

        <p role="status" aria-live="polite" className="mt-3 min-h-4 text-center text-xs text-ink-faint">
          {notice}
        </p>

        <footer className={`${label} mt-4 flex items-center justify-between gap-4 text-ink-faint`}>
          <Link href="/forecast" className="underline decoration-line underline-offset-4 transition-colors hover:text-ink">
            Forecast →
          </Link>
          <a
            href="https://scenestudio.corsw.in"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-ink"
          >
            Scene
          </a>
        </footer>
      </div>
    </>
  );
}
