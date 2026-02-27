'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import styles from './FadeInSection.module.css';

export default function FadeInSection({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${styles.wrapper} ${isVisible ? styles.visible : ''}`}>
      {children}
    </div>
  );
}
