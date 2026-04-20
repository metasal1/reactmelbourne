const members = [
  { initials: "A", cls: "accent" },
  { initials: "AS" },
  { initials: "MD", cls: "accent-2" },
  { initials: "BY" },
  { initials: "AF" },
  { initials: "MH", cls: "accent-3" },
  { initials: "DF" },
  { initials: "45", cls: "accent" },
  { initials: "BR" },
  { initials: "R" },
  { initials: "TM", cls: "accent-2" },
  { initials: "MK" },
  { initials: "GS", cls: "accent-3" },
  { initials: "+6K" },
];

export function Community() {
  return (
    <section id="community" className="reveal">
      <div className="section-label mono">THE PEOPLE</div>
      <h2 style={{ textAlign: "center" }}>
        6,070 members strong.
        <br />
        And counting.
      </h2>

      <div className="members-grid">
        {members.map((m, i) => (
          <div className={`member ${m.cls ?? ""}`} key={i}>
            {m.initials}
          </div>
        ))}
      </div>

      <p
        style={{
          color: "var(--ink-dim)",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 13,
        }}
      >
        Organized by{" "}
        <span style={{ color: "var(--cyan)" }}>Goran Stefkovski</span> and a small crew of volunteers.
      </p>
    </section>
  );
}
