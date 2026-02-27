'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Navigation.module.css';
import { useConsultation } from '../../context/ConsultationContext';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'media', label: 'Media' },
  { id: 'contact', label: 'Contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openModal } = useConsultation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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
            <Image src="/assets/used/logo/startax_logo.png" alt="STARTAX" width={270} height={310} className={styles.logoIcon} priority />
            <span className={styles.logoMain}>STARTAX</span>
            <span className={styles.logoSub}>세무법인 스타택스</span>
          </div>

          <div className={styles.desktopMenu}>
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className={styles.navLink}>
                {item.label}
              </button>
            ))}
            <button onClick={openModal} className={styles.ctaButton}>
              상담신청
            </button>
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="메뉴"
            aria-expanded={isMobileMenuOpen}
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
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className={styles.mobileNavLink}>
                {item.label}
              </button>
            ))}
            <button onClick={() => { setIsMobileMenuOpen(false); openModal(); }} className={styles.mobileCtaButton}>
              상담신청
            </button>
          </div>
        </div>
      )}
    </>
  );
}
