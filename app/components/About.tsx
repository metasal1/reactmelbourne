const topics = [
  "#react",
  "#javascript",
  "#react-native",
  "#web-dev",
  "#open-source",
  "#new-tech",
  "#software-dev",
];

export function About() {
  return (
    <section id="about" className="reveal">
      <div>
        <div className="section-label mono">ABOUT US</div>
        <h2>
          For devs who <em>ship</em>.
        </h2>
      </div>
      <div className="about-copy">
        <p>
          React Melbourne is a JavaScript meetup for engineers who build real things. We run quarterly gatherings covering React, React Native, Flux, React Router, Webpack — and the wider web and mobile ecosystem that surrounds them.
        </p>
        <p>
          No gatekeeping. No brand pitches dressed up as talks. Just working engineers sharing what they learned, what broke, and what they&apos;d do differently next time.
        </p>
        <p>
          Newcomers welcome. Senior folks welcome. If you&apos;re curious about React or deep in a five-year codebase, there&apos;s a seat for you.
        </p>
        <div className="topics">
          {topics.map((t) => (
            <span className="topic" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
