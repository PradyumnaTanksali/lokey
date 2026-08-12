type Props = {
  /** Room id — picks the gradient base out of globals.css. */
  id: string;
  /** Hotlinked loop urls, best first. The browser falls through them in order. */
  sources?: string[];
  /** Cover art, for the rooms that use artwork instead of footage. */
  image?: string;
  /** Scrim strength. The wordmark page needs more floor than the card page. */
  scrim?: string;
};

/** Gradient base → media → scrim → grain.
 *
 *  The gradient base is not a placeholder, it is the design. It is what shows
 *  while media loads, when a url dies, when there is no artwork at all, and
 *  under `prefers-reduced-motion`. Everything above it is a bonus layer, which
 *  is what lets the video be hotlinked from someone else's CDN without the page
 *  depending on it. */
export function Backdrop({
  id,
  sources = [],
  image,
  scrim = "from-black/55 via-black/40 to-black/85",
}: Props) {
  return (
    <div aria-hidden="true" data-bg={id} className="fixed inset-0 -z-10 overflow-hidden bg-floor">
      <div className="bg-base" />

      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={image}
          src={image}
          alt=""
          className="art-in size-full scale-150 object-cover opacity-60 blur-3xl saturate-150"
        />
      ) : (
        sources.length > 0 && (
          // key on the first url so switching rooms reloads the element rather
          // than leaving the old loop playing under the new gradient.
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
        )
      )}

      <div className={`bg-scrim bg-gradient-to-b ${scrim}`} />
      <div className="grain" />
    </div>
  );
}
