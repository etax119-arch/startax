'use client';

import { useState, useEffect } from 'react';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <span className={styles.logoMain}>STARTAX</span>
            <span className={styles.logoSub}>세무법인 스타택스</span>
          </div>

          <div className={styles.desktopMenu}>
            <button onClick={() => scrollToSection('about')} className={styles.navLink}>
              About
            </button>
            <button onClick={() => scrollToSection('services')} className={styles.navLink}>
              Services
            </button>
            <button onClick={() => scrollToSection('expertise')} className={styles.navLink}>
              Expertise
            </button>
            <button onClick={() => scrollToSection('media')} className={styles.navLink}>
              Media
            </button>
            <button onClick={() => scrollToSection('contact')} className={styles.navLink}>
              Contact
            </button>
            <a href="tel:02-423-7110" className={styles.ctaButton}>
              상담신청
            </a>
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="메뉴"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <button onClick={() => scrollToSection('about')} className={styles.mobileNavLink}>
              About
            </button>
            <button onClick={() => scrollToSection('services')} className={styles.mobileNavLink}>
              Services
            </button>
            <button onClick={() => scrollToSection('expertise')} className={styles.mobileNavLink}>
              Expertise
            </button>
            <button onClick={() => scrollToSection('media')} className={styles.mobileNavLink}>
              Media
            </button>
            <button onClick={() => scrollToSection('contact')} className={styles.mobileNavLink}>
              Contact
            </button>
            <a href="tel:02-423-7110" className={styles.mobileCtaButton}>
              상담신청
            </a>
          </div>
        </div>
      )}
    </>
  );
}