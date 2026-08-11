import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Generated as a PNG rather than shipped as icon.svg, because Safari ignores
 *  SVG favicons entirely. Same crescent as `components/Mark.tsx`, drawn with
 *  two circles since Satori has no SVG path support: a light disc with a dark
 *  one laid over its right side. */
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
            top: 3,
            left: 3,
            width: 26,
            height: 26,
            borderRadius: 13,
            background: "#F7F4EF",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 9,
            width: 20,
            height: 20,
            borderRadius: 10,
            background: "#0C0A09",
          }}
        />
      </div>
    ),
    size,
  );
}
