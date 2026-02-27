import Navigation from './components/Navigation';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import About from './components/About';
import Services from './components/Services';
import Differentiation from './components/Differentiation';
import Stats from './components/Stats';
import Branches from './components/Branches';
import Media from './components/Media';
import Footer from './components/Footer';
import FadeInSection from './components/FadeInSection';

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <Hero />
        <FadeInSection><TrustBar /></FadeInSection>
        <FadeInSection><About /></FadeInSection>
        <FadeInSection><Services /></FadeInSection>
        <FadeInSection><Differentiation /></FadeInSection>
        <FadeInSection><Branches /></FadeInSection>
        <FadeInSection><Stats /></FadeInSection>
        <FadeInSection><Media /></FadeInSection>
      </main>
      <FadeInSection><Footer /></FadeInSection>
    </>
  );
}