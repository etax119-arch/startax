'use client';

import Link from 'next/link';
import styles from './ServicePageNav.module.css';

const SERVICE_PAGES = [
  { path: '/services/tax', label: '세무 서비스' },
  { path: '/services/hospital-consulting', label: '병의원 컨설팅' },
  { path: '/services/consulting', label: '경영 컨설팅' },
];

interface ServicePageNavProps {
  currentPath: string;
}

export default function ServicePageNav({ currentPath }: ServicePageNavProps) {
  const currentIndex = SERVICE_PAGES.findIndex((p) => p.path === currentPath);
  const prev = currentIndex > 0 ? SERVICE_PAGES[currentIndex - 1] : SERVICE_PAGES[SERVICE_PAGES.length - 1];
  const next = currentIndex < SERVICE_PAGES.length - 1 ? SERVICE_PAGES[currentIndex + 1] : SERVICE_PAGES[0];

  return (
    <>
      <Link href={prev.path} className={styles.prev}>
        <svg width="12" height="20" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="7 1 1 7 7 13" />
        </svg>
        <span className={styles.label}>{prev.label}</span>
      </Link>

      <Link href={next.path} className={styles.next}>
        <span className={styles.label}>{next.label}</span>
        <svg width="12" height="20" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 1 7 7 1 13" />
        </svg>
      </Link>
    </>
  );
}
