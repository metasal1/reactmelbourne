import { ImageResponse } from "next/og";

export const alt = "React Melbourne — JavaScript meetup for devs building real things";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#0a0d10",
          backgroundImage:
            "linear-gradient(135deg, rgba(97,218,251,0.18) 0%, rgba(10,13,16,0) 40%), linear-gradient(315deg, rgba(255,94,58,0.14) 0%, rgba(10,13,16,0) 45%)",
          color: "#e8eef2",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#8a949c",
            letterSpacing: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                backgroundColor: "#61dafb",
              }}
            />
            MEETUP / NAARM / MELBOURNE
          </div>
          <div>SINCE 2015</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 132,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: -5,
              color: "#e8eef2",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>react</span>
            <span style={{ color: "#61dafb" }}>_</span>
            <span>melbourne</span>
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.3,
              color: "#8a949c",
              maxWidth: 960,
              fontFamily: "serif",
            }}
          >
            A meetup for people building with React, React Native, and the
            sprawling JavaScript universe around them.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: 2,
            color: "#8a949c",
          }}
        >
          <div style={{ display: "flex", gap: 40 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "#61dafb" }}>6,070</span>
              <span>MEMBERS</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "#61dafb" }}>Q</span>
              <span>QUARTERLY</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "#f5d547" }}>LIVE</span>
              <span>/ ONLINE</span>
            </div>
          </div>
          <div style={{ color: "#e8eef2" }}>reactmelbourne.com</div>
        </div>
      </div>
    ),
    size,
  );
}
