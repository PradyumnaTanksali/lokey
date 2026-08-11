type Props = {
  roomId: string;
  videoId: string;
  title: string;
  playing: boolean;
};

/** The night panel: a record sleeve, a disc that slides out when it plays,
 *  and a wash of colour that belongs to the room you picked. */
export function Stage({ roomId, videoId, title, playing }: Props) {
  return (
    <div
      data-room={roomId}
      className="relative isolate aspect-square overflow-hidden rounded-xl bg-night sm:aspect-[4/5] lg:aspect-square"
    >
      {/* colour wash — the only thing that changes between rooms */}
      <div
        aria-hidden="true"
        className="absolute animate-[drift_22s_ease-in-out_infinite] opacity-90"
        style={{
          inset: "-25%",
          background:
            "radial-gradient(38% 38% at 30% 28%, var(--room-a) 0%, transparent 70%), radial-gradient(46% 46% at 72% 74%, var(--room-b) 0%, transparent 72%)",
          filter: "blur(46px)",
        }}
      />
      <div aria-hidden="true" className="fx-accent" data-room={roomId} />
      {/* Scrim. The wash drifts, so the corner labels need a floor to sit on. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,9,8,0.6) 0%, transparent 24%, transparent 72%, rgba(10,9,8,0.65) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-night-muted">
          <span>Baithak · Room</span>
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full bg-night-ink ${playing ? "animate-[dotPulse_1.6s_ease-in-out_infinite]" : "opacity-40"}`}
            />
            {playing ? "On" : "Paused"}
          </span>
        </div>

        <div className="relative mx-auto w-[74%] max-w-[320px]">
          {/* the disc, hiding behind the sleeve until the needle drops */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: playing ? "translateX(28%)" : "translateX(2%)",
              background:
                "repeating-radial-gradient(circle at 50% 50%, #171717 0 2px, #0d0d0d 2px 4px)",
            }}
          >
            <div
              className="absolute inset-0 rounded-full animate-[spin_6s_linear_infinite]"
              style={{
                animationPlayState: playing ? "running" : "paused",
                background:
                  "conic-gradient(from 0deg, rgba(255,255,255,0.14), transparent 25%, rgba(255,255,255,0.10) 50%, transparent 75%, rgba(255,255,255,0.14))",
                maskImage: "radial-gradient(circle, transparent 26%, #000 27%)",
                WebkitMaskImage: "radial-gradient(circle, transparent 26%, #000 27%)",
              }}
            />
            <div className="absolute left-1/2 top-1/2 size-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-room-a" />
            <div className="absolute left-1/2 top-1/2 size-[4%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-night" />
          </div>

          {/* the sleeve */}
          {/* ponytail: plain <img> on purpose — i.ytimg.com thumbs are already
              sized right, and next/image here buys a remotePatterns config and
              nothing else. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt={`Cover art for ${title}`}
            width={480}
            height={360}
            className="relative aspect-square w-full rounded-sm object-cover shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
          />
        </div>

        <p className="max-w-[85%] font-mono text-[10px] uppercase tracking-[0.22em] text-night-muted">
          {playing ? "Chal raha hai" : "Press play"}
        </p>
      </div>
    </div>
  );
}
