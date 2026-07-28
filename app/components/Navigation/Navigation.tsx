'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';
import { useConsultation } from '../../context/ConsultationContext';
import { COLUMN_BASE_PATH } from '../../lib/columns/href';

type NavItem =
  | { kind: 'anchor'; id: string; label: string }
  | { kind: 'route'; href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { kind: 'anchor', id: 'about', label: 'About' },
  { kind: 'anchor', id: 'expertise', label: 'Expertise' },
  { kind: 'anchor', id: 'media', label: 'Media' },
  { kind: 'route', href: COLUMN_BASE_PATH, label: 'Column' },
  { kind: 'anchor', id: 'contact', label: 'Contact' },
];

interface NavigationProps {
  /** 다크 히어로가 없는 페이지에서 처음부터 불투명하게 표시합니다. */
  solid?: boolean;
}

export default function Navigation({ solid = false }: NavigationProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openModal } = useConsultation();

  // solid 페이지는 스크롤과 무관하게 항상 불투명하므로 리스너 자체를 걸지 않습니다.
  useEffect(() => {
    if (solid) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [solid]);

  // isScrolled 는 "스크롤됐는가"라는 뜻을 유지하고, 불투명 여부는 여기서 파생합니다.
  const isOpaque = solid || isScrolled;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // 홈이 아닌 페이지에서는 앵커 항목도 링크로 렌더합니다.
  // (해당 섹션이 DOM 에 없어 scrollIntoView 가 무반응이기 때문)
  const renderItem = (item: NavItem, linkClass: string) => {
    if (item.kind === 'route') {
      const isActive = pathname.startsWith(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          className={`${linkClass} ${isActive ? styles.navLinkActive : ''}`}
          onClick={closeMobileMenu}
        >
          {item.label}
        </Link>
      );
    }

    if (isHome) {
      return (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={linkClass}
        >
          {item.label}
        </button>
      );
    }

    return (
      <Link key={item.id} href={`/#${item.id}`} className={linkClass} onClick={closeMobileMenu}>
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <nav className={`${styles.nav} ${isOpaque ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <Image src="/assets/used/logo/startax_logo.png" alt="STARTAX" width={270} height={310} className={styles.logoIcon} priority />
            <span className={styles.logoMain}>STARTAX</span>
            <span className={styles.logoSub}>세무법인 스타택스</span>
          </Link>

          <div className={styles.desktopMenu}>
            {NAV_ITEMS.map((item) => renderItem(item, styles.navLink))}
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
            {NAV_ITEMS.map((item) => renderItem(item, styles.mobileNavLink))}
            <button onClick={() => { setIsMobileMenuOpen(false); openModal(); }} className={styles.mobileCtaButton}>
              상담신청
            </button>
          </div>
        </div>
      )}
    </>
  );
}
