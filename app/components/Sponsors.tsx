import Link from "next/link";
import { sponsors } from "../sponsors";

const TIER_LABEL: Record<string, string> = {
  venue: "VENUE PARTNER",
  pizza: "FOOD PARTNER",
  drinks: "DRINKS PARTNER",
  swag: "SWAG PARTNER",
  supporter: "SUPPORTER",
};

export function Sponsors() {
  const primary = sponsors[0];
  const rest = sponsors.slice(1);

  return (
    <section id="sponsors" className="reveal">
      <div className="section-label mono">BACKED BY</div>
      <h2>
        The people who <em>keep the lights on.</em>
      </h2>

      {primary ? (
        <a
          href={primary.url}
          target="_blank"
          rel="noreferrer sponsored"
          className="sponsor-card sponsor-card-hero"
          style={
            {
              "--sponsor-color": primary.brandColor,
              "--sponsor-ink": primary.brandInk ?? "#ffffff",
            } as React.CSSProperties
          }
        >
          <div className="sponsor-card-tier mono">
            {TIER_LABEL[primary.tier]}
            {primary.since ? ` · SINCE ${primary.since}` : ""}
          </div>
          <div className="sponsor-card-mark">{primary.displayName}</div>
          <p className="sponsor-card-blurb">{primary.blurb}</p>
          <div className="sponsor-card-cta mono">
            Visit {primary.displayName} →
          </div>
        </a>
      ) : null}

      {rest.length ? (
        <div className="sponsor-row">
          {rest.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noreferrer sponsored"
              className="sponsor-card"
              style={
                {
                  "--sponsor-color": s.brandColor,
                  "--sponsor-ink": s.brandInk ?? "#ffffff",
                } as React.CSSProperties
              }
            >
              <div className="sponsor-card-tier mono">
                {TIER_LABEL[s.tier]}
              </div>
              <div className="sponsor-card-mark">{s.displayName}</div>
            </a>
          ))}
        </div>
      ) : null}

      <div className="sponsor-footer mono">
        Keen to sponsor? <Link href="/sponsor">Get in touch →</Link>
      </div>
    </section>
  );
}
