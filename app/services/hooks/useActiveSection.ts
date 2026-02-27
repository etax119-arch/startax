'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Section } from '../types';

export function useActiveSection(sections: Section[], defaultSection = '') {
  const [activeSection, setActiveSection] = useState(defaultSection);
  const rafId = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        for (const section of [...sections].reverse()) {
          const el = document.getElementById(section.id);
          if (el && el.getBoundingClientRect().top <= 160) {
            setActiveSection(section.id);
            return;
          }
        }
        setActiveSection(defaultSection);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [sections, defaultSection]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 140;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return { activeSection, scrollTo };
}
