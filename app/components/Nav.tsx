export function Nav() {
  return (
    <nav>
      <a href="#" className="logo">
        <span className="logo-dot" />
        <span>
          reactmelbourne<span style={{ color: "var(--cyan)" }}>.</span>com
        </span>
      </a>
      <div className="nav-links">
        <a href="#events">events</a>
        <a href="#about">about</a>
        <a href="#community">community</a>
        <a href="#speakers">speak</a>
      </div>
      <a href="https://www.meetup.com/react-melbourne/" className="nav-cta">
        Join →
      </a>
    </nav>
  );
}
