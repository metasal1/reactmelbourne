import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { ScrollReveal } from "../components/ScrollReveal";

export const metadata: Metadata = {
  title: "Brand",
  description:
    "React Melbourne brand kit — colours, wordmark, marks, and usage notes for the Melbourne React community.",
  alternates: { canonical: "/brand" },
  openGraph: {
    title: "Brand · React Melbourne",
    description: "Colours, marks, and credits for React Melbourne.",
    url: "https://reactmelbourne.com/brand",
  },
};

const SITE = "https://reactmelbourne.com";

const colours = [
  { hex: "#0a0d10", name: "bg", ink: "#e8eef2" },
  { hex: "#111418", name: "card", ink: "#e8eef2" },
  { hex: "#61dafb", name: "cyan", ink: "#0a0d10" },
  { hex: "#ff5e3a", name: "accent", ink: "#0a0d10" },
  { hex: "#f5d547", name: "yellow", ink: "#0a0d10" },
  { hex: "#e8eef2", name: "ink", ink: "#0a0d10" },
  { hex: "#8a949c", name: "ink-dim", ink: "#0a0d10" },
  { hex: "#1e252b", name: "line", ink: "#e8eef2" },
];

const assets = [
  {
    name: "App icon",
    src: "/brand/react-melbourne-apple.png",
    note: "180×180 PNG · square mark",
  },
  {
    name: "Favicon mark",
    src: "/brand/react-melbourne-mark.png",
    note: "32×32 PNG",
  },
  {
    name: "Made by Milysec (white)",
    src: "/brand/made-by-milysec-white.svg",
    note: "Dark backgrounds",
  },
  {
    name: "Made by Milysec (black)",
    src: "/brand/made-by-milysec-black.svg",
    note: "Light backgrounds",
  },
  {
    name: "Powered by Solana (white)",
    src: "/brand/powered-by-solana-white.svg",
    note: "Footer credit · dark UI",
  },
  {
    name: "Powered by Solana (colour)",
    src: "/brand/powered-by-solana-color.svg",
    note: "Light UI optional",
  },
];

export default function BrandPage() {
  return (
    <>
      <Nav />
      <main className="subpage">
        <article className="prose-page brand-page">
          <p className="section-label mono">BRAND</p>
          <h1>
            Marks &amp; <em>credits</em>.
          </h1>
          <p className="prose-lede">
            React Melbourne kit for slides, posts, sponsors, and the site. Keep
            it simple — cyan for signal, orange for heat, dark room energy.
          </p>

          <div className="brand-wordmark-card">
            <div className="brand-wordmark mono">
              react<span className="brand-underscore">_</span>melbourne
            </div>
            <p className="mono brand-wordmark-meta">
              PRIMARY WORDMARK · MONO · CYAN UNDERSCORE
            </p>
          </div>

          <h2>Colours</h2>
          <p>Tokens match the live site and email templates.</p>
          <div className="brand-swatches">
            {colours.map((c) => (
              <div
                key={c.hex}
                className="brand-swatch"
                style={{ background: c.hex, color: c.ink }}
              >
                <span>
                  {c.hex}
                  <br />
                  {c.name}
                </span>
              </div>
            ))}
          </div>

          <h2>Type</h2>
          <div className="brand-type-grid">
            <div className="brand-type-card">
              <div className="brand-type-label mono">DISPLAY · FRAUNCES</div>
              <div className="brand-type-sample brand-type-display">
                React, <em>rendered</em> in Melbourne.
              </div>
            </div>
            <div className="brand-type-card">
              <div className="brand-type-label mono">UI · JETBRAINS MONO</div>
              <div className="brand-type-sample brand-type-mono mono">
                SINCE 2015 · NAARM · STATUS ● ONLINE
              </div>
            </div>
          </div>

          <h2>Downloads</h2>
          <p>Click any tile to open the asset. Prefer letterboxing — don’t crop the mark into a circle unless you start from a square file.</p>
          <div className="brand-assets">
            {assets.map((a) => (
              <a
                key={a.src}
                href={a.src}
                className="brand-asset"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <div className="brand-asset-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.src} alt={a.name} />
                </div>
                <strong>{a.name}</strong>
                <span className="mono">{a.note}</span>
              </a>
            ))}
          </div>

          <h2>Usage</h2>
          <ul className="brand-rules">
            <li>
              <strong>Do</strong> use the cyan underscore in <span className="mono">react_melbourne</span>.
            </li>
            <li>
              <strong>Do</strong> put Made by Milysec (white) + Powered by Solana on dark footers.
            </li>
            <li>
              <strong>Do</strong> keep backgrounds near <span className="mono">#0a0d10</span> for product chrome.
            </li>
            <li>
              <strong>Don’t</strong> recolour the Solana mark or stretch badges.
            </li>
            <li>
              <strong>Don’t</strong> call us “Oz” — Australia / AU / Naarm only.
            </li>
            <li>
              <strong>Don’t</strong> invent a new logo for one-off events — wordmark + cyan is enough.
            </li>
          </ul>

          <p className="prose-note mono">
            Site: <a href={SITE}>{SITE.replace("https://", "")}</a>
            {" · "}
            <Link href="/">← home</Link>
            {" · "}
            <a href="mailto:hello@reactmelbourne.com">hello@reactmelbourne.com</a>
          </p>
        </article>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
