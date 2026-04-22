import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { Events } from "./components/Events";
import { About } from "./components/About";
import { Community } from "./components/Community";
import { Speakers } from "./components/Speakers";
import { Subscribe } from "./components/Subscribe";
import { Footer } from "./components/Footer";
import { ScrollReveal } from "./components/ScrollReveal";
import { events } from "./events";

export default function Page() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "React Melbourne",
      alternateName: "react_melbourne",
      url: "https://reactmelbourne.com",
      logo: "https://reactmelbourne.com/apple-icon",
      description:
        "Melbourne's React community meetup. React, React Native, and the JavaScript universe around them.",
      email: "hello@reactmelbourne.com",
      sameAs: [
        "https://www.meetup.com/react-melbourne/",
      ],
      areaServed: {
        "@type": "City",
        name: "Melbourne",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "React Melbourne",
      url: "https://reactmelbourne.com",
      inLanguage: "en-AU",
    },
    ...events.map((e) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: e.title,
      startDate: e.startISO,
      endDate: e.endISO,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus:
        e.status === "upcoming"
          ? "https://schema.org/EventScheduled"
          : "https://schema.org/EventScheduled",
      description: e.description,
      location: {
        "@type": "Place",
        name: e.location,
        address: {
          "@type": "PostalAddress",
          streetAddress: e.address ?? "",
          addressLocality: "Melbourne",
          addressRegion: "VIC",
          addressCountry: "AU",
        },
      },
      organizer: {
        "@type": "Organization",
        name: "React Melbourne",
        url: "https://reactmelbourne.com",
      },
      image: "https://reactmelbourne.com/opengraph-image",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "AUD",
        availability: "https://schema.org/InStock",
        url: "https://www.meetup.com/react-melbourne/events/",
        validFrom: "2015-01-01T00:00:00Z",
      },
    })),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <Hero />
      <Stats />
      <Events />
      <About />
      <Community />
      <Speakers />
      <Subscribe />
      <Footer />
      <ScrollReveal />
    </>
  );
}
