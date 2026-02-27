'use client';

import { useActiveSection } from '../hooks/useActiveSection';
import type { Section } from '../types';
import styles from './ServiceKeywordNav.module.css';

interface ServiceKeywordNavProps {
  sections: Section[];
  defaultSection?: string;
}

export default function ServiceKeywordNav({ sections, defaultSection }: ServiceKeywordNavProps) {
  const { activeSection, scrollTo } = useActiveSection(sections, defaultSection);

  return (
    <div className={styles.keywordNav}>
      <div className={styles.keywordContainer}>
        {sections.map((section) => (
          <button
            key={section.id}
            className={`${styles.keywordBtn} ${activeSection === section.id ? styles.keywordActive : ''}`}
            onClick={() => scrollTo(section.id)}
          >
            {section.label}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
