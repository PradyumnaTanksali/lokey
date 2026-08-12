/** The door-ajar mark, drawn for Satori (`next/og`) rather than as SVG.
 *
 *  Satori has no `<path>` support, so the mark is rebuilt from two positioned
 *  boxes. Kept here rather than copied into each icon route, because three
 *  drifting copies of a logo is how a brand ends up with three logos.
 *
 *  `scale` is the fraction of the canvas the mark occupies. PWA icons want it
 *  small enough that a maskable circle crop can't clip the mark — the safe zone
 *  is the middle 80% — while the 32px favicon wants it large or it disappears. */
export function markImage(size: number, scale = 0.55) {
  const h = Math.round(size * scale);
  const doorW = Math.round(h * 0.46);
  const edgeW = Math.round(h * 0.15);
  const gap = Math.round(h * 0.15);
  const totalW = doorW + gap + edgeW;
  const top = Math.round((size - h) / 2);
  const left = Math.round((size - totalW) / 2);
  const radius = Math.max(2, Math.round(h * 0.08));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#0C0A09",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top,
          left,
          width: doorW,
          height: h,
          borderRadius: radius,
          background: "#F7F4EF",
        }}
      />
      <div
        style={{
          position: "absolute",
          top,
          left: left + doorW + gap,
          width: edgeW,
          height: h,
          borderRadius: radius,
          background: "#F7F4EF",
        }}
      />
    </div>
  );
}
