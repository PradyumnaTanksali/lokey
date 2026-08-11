type Props = {
  /** Room id — picks the gradient base out of globals.css. */
  id: string;
  /** Hotlinked loop urls, best first. The browser falls through them in order. */
  sources: string[];
  /** Scrim strength. The wordmark page needs more floor than the card page. */
  scrim?: string;
};

/** Gradient base → video → scrim → grain.
 *
 *  The video is hotlinked rather than served from `public/`, so the bytes come
 *  off someone else's CDN instead of our bandwidth quota. That makes it a thing
 *  that can vanish, so the gradient base underneath is not a placeholder — it is
 *  the design, and the video is a bonus layer on top. Blocked, 403'd, throttled,
 *  or switched off by `prefers-reduced-motion`, the page still reads. */
export function Backdrop({ id, sources, scrim = "from-black/55 via-black/40 to-black/85" }: Props) {
  return (
    <div aria-hidden="true" data-bg={id} className="fixed inset-0 -z-10 overflow-hidden bg-floor">
      <div className="bg-base" />
      {sources.length > 0 && (
        // key on the first url so switching rooms actually reloads the element
        // rather than leaving the old loop playing under the new gradient.
        <video
          key={sources[0]}
          className="bg-video art-in"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        >
          {sources.map((src) => (
            <source key={src} src={src} type="video/mp4" />
          ))}
        </video>
      )}
      <div className={`bg-scrim bg-gradient-to-b ${scrim}`} />
      <div className="grain" />
    </div>
  );
}
