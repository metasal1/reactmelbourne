const stats = [
  { num: "6,070", label: "MEMBERS" },
  { num: "4.7", suffix: "/5", label: "COMMUNITY RATING" },
  { num: "35", suffix: "+", label: "EVENTS RUN" },
  { num: "2015", label: "EST." },
];

export function Stats() {
  return (
    <div className="stats">
      <div className="stats-inner">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-num">
              {s.num}
              {s.suffix && (
                <span style={{ color: "var(--ink-dim)", fontSize: "0.5em" }}>
                  {s.suffix}
                </span>
              )}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
