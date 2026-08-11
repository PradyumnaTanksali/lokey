import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Generated as a PNG rather than shipped as icon.svg, because Safari ignores
 *  SVG favicons outright.
 *
 *  Same door-ajar mark as `components/Mark.tsx`, but drawn with its own
 *  proportions: at 32px the gap has to be wider and the swung edge thicker than
 *  the display version, or both close up into a single block. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0C0A09",
          borderRadius: 7,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 5,
            left: 6,
            width: 12,
            height: 22,
            borderRadius: 2,
            background: "#F7F4EF",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 5,
            left: 22,
            width: 4,
            height: 22,
            borderRadius: 2,
            background: "#F7F4EF",
          }}
        />
      </div>
    ),
    size,
  );
}
