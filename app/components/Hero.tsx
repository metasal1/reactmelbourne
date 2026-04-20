export function Hero() {
  return (
    <section className="hero">
      <div>
        <div className="hero-label mono">Since 2015 · Melbourne, AU</div>
        <h1>
          React,
          <br />
          <em>rendered</em>
          <br />
          <span className="underline">in Melbourne.</span>
        </h1>
        <p className="hero-sub">
          A meetup for people building with React, React Native, and the sprawling JavaScript universe around them. Real talks from real engineers. Pizza. Drinks. The occasional production horror story.
        </p>
        <div className="hero-ctas">
          <a href="#events" className="btn btn-primary">
            Next meetup
            <span className="btn-arrow">→</span>
          </a>
          <a href="https://www.meetup.com/react-melbourne/" className="btn btn-secondary">
            RSVP on Meetup
          </a>
        </div>
      </div>

      <div className="terminal">
        <div className="terminal-header">
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-title">~/react-melbourne — zsh</span>
        </div>
        <div className="terminal-body">
          <span className="term-line">
            <span className="term-prompt">$</span> <span className="term-cmd">npx create-meetup@latest</span>
          </span>
          <span className="term-line"><span className="term-comment">✓ Community bootstrapped</span></span>
          <span className="term-line"><span className="term-comment">✓ Venue located</span></span>
          <span className="term-line"><span className="term-comment">✓ Pizza ordered</span></span>
          <br />
          <span className="term-line">
            <span className="term-prompt">$</span> <span className="term-cmd">cat meetup.config.json</span>
          </span>
          <span className="term-line"><span className="term-val">{"{"}</span></span>
          <span className="term-line">
            {"  "}<span className="term-key">&quot;location&quot;</span>: <span className="term-string">&quot;Kogan HQ, South Melbourne&quot;</span>,
          </span>
          <span className="term-line">
            {"  "}<span className="term-key">&quot;members&quot;</span>: <span className="term-val">6070</span>,
          </span>
          <span className="term-line">
            {"  "}<span className="term-key">&quot;rating&quot;</span>: <span className="term-val">4.7</span>,
          </span>
          <span className="term-line">
            {"  "}<span className="term-key">&quot;frequency&quot;</span>: <span className="term-string">&quot;quarterly&quot;</span>,
          </span>
          <span className="term-line">
            {"  "}<span className="term-key">&quot;vibe&quot;</span>: <span className="term-string">&quot;casually nerdy&quot;</span>
          </span>
          <span className="term-line">
            <span className="term-val">{"}"}</span>
            <span className="term-cursor" />
          </span>
        </div>
      </div>
    </section>
  );
}
