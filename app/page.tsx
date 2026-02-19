import Navigation from './components/Navigation';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import About from './components/About';
import Services from './components/Services';
import Differentiation from './components/Differentiation';
import Expertise from './components/Expertise';
import Stats from './components/Stats';
import Branches from './components/Branches';
import Media from './components/Media';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <TrustBar />
        <About />
        <Services />
        <Differentiation />
        <Expertise />
        <Stats />
        <Branches />
        <Media />
      </main>
      <Footer />
    </>
  );
}