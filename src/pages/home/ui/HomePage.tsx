import { About } from "../../../widgets/about/About";
import { Footer } from "../../../widgets/footer/Footer";
import { Header } from "../../../widgets/header/Header";
import { Hero } from "../../../widgets/hero/Hero";
import { Projects } from "../../../widgets/projects/Projects";

export function HomePage() {
  return (
    <>
      <div className="noise" aria-hidden="true" />
      <Header />
      <main id="top">
        <Hero />
        <Projects />
        <About />
        <Footer />
      </main>
    </>
  );
}
