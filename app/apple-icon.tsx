import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0d10",
          color: "#61dafb",
          letterSpacing: -4,
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1 }}>r_m</div>
        <div
          style={{
            marginTop: 10,
            fontSize: 16,
            color: "#8a949c",
            letterSpacing: 2,
          }}
        >
          MELBOURNE
        </div>
      </div>
    ),
    size,
  );
}
