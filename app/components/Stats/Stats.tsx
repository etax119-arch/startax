'use client';

import { useEffect, useRef, useState } from 'react';
import Counter from './Counter';
import styles from './Stats.module.css';

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    { value: 15600, label: '세무 컨설팅', suffix: '' },
    { value: 600, label: '누적 업체수', suffix: '' },
    { value: 600, label: '누적 환급 업체수', suffix: '' },
    { value: 98, label: '고객 만족도', suffix: '%' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.stats}>
      <div className={styles.container}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.stat}>
            <div className={styles.value}>
              {isVisible && (
                <Counter
                  end={stat.value}
                  duration={2000}
                  suffix={stat.suffix}
                />
              )}
            </div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
