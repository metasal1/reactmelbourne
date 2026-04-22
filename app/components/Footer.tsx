export function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
            react<em>_</em>melbourne
          </div>
          <p className="footer-tag">
            A community meetup for React developers in Melbourne, Australia. Built by devs, for devs.
          </p>
        </div>
        <div className="footer-col">
          <h4>COMMUNITY</h4>
          <ul>
            <li><a href="https://www.meetup.com/react-melbourne/">Meetup</a></li>
            <li><a href="https://www.meetup.com/react-melbourne/events/">Events</a></li>
            <li><a href="https://www.meetup.com/react-melbourne/members/">Members</a></li>
            <li><a href="https://www.meetup.com/react-melbourne/discussions/">Discussions</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>CONTRIBUTE</h4>
          <ul>
            <li><a href="https://forms.gle/qmYDjAFNvkyNqQtn9">Submit a talk</a></li>
            <li><a href="#">Sponsor a meetup</a></li>
            <li><a href="#">Host an event</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div>© 2026 REACT_MELBOURNE · MADE IN NAARM · BY <a href="https://metasal.xyz">METASAL.XYZ</a></div>
        <div>
          STATUS: <span style={{ color: "var(--cyan)" }}>● ONLINE</span>
        </div>
      </div>
    </footer>
  );
}
