import { getEvents } from "../lib/meetup";

export async function Events() {
  const events = await getEvents();
  return (
    <section id="events" className="reveal">
      <div className="section-label mono">UPCOMING &amp; RECENT</div>
      <h2>
        Four meetups a year. <em>Zero</em> filler talks.
      </h2>

      {events.map((e) => (
        <div className="event-card" key={`${e.day}-${e.year}`}>
          <div className="event-date">
            <span className="day">{e.day}</span>
            {e.time} · {e.year}
          </div>
          <div>
            <h3 className="event-title">{e.title}</h3>
            <div className="event-meta mono">
              <span>{e.location}</span>
              {e.address && <span>{e.address}</span>}
              <span>{e.attendees}</span>
            </div>
            <p className="event-desc">{e.description}</p>
          </div>
          <div className={`event-status ${e.status}`}>
            {e.status.toUpperCase()}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 48 }}>
        <a
          href="https://www.meetup.com/react-melbourne/events/past/"
          className="btn btn-secondary"
        >
          See all past events
          <span className="btn-arrow">→</span>
        </a>
      </div>
    </section>
  );
}
