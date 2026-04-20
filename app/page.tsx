import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { Events } from "./components/Events";
import { About } from "./components/About";
import { Community } from "./components/Community";
import { Speakers } from "./components/Speakers";
import { Footer } from "./components/Footer";
import { ScrollReveal } from "./components/ScrollReveal";

export default function Page() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Events />
      <About />
      <Community />
      <Speakers />
      <Footer />
      <ScrollReveal />
    </>
  );
}
