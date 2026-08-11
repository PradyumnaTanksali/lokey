/** The Lokey mark: a door left ajar.
 *
 *  A tall panel split by a narrow gap, with the thin edge of the door swung
 *  past it. You're being let into a room — which is the whole product.
 *
 *  Two filled shapes, no strokes, so it holds together when a browser tab
 *  renders it at 16px. The gap is deliberately wider than a real door's would
 *  be: at small sizes a hairline gap closes up and the mark becomes a block. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      {/* the door */}
      <path d="M7.5 3h11.5v26H7.5A1.5 1.5 0 0 1 6 27.5v-23A1.5 1.5 0 0 1 7.5 3z" fill="currentColor" />
      {/* its edge, swung open */}
      <path d="M22.5 3H24a1.5 1.5 0 0 1 1.5 1.5v23A1.5 1.5 0 0 1 24 29h-1.5V3z" fill="currentColor" />
    </svg>
  );
}
