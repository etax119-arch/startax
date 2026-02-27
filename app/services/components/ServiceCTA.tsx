'use client';

import Link from 'next/link';
import styles from './ServiceCTA.module.css';
import { useConsultation } from '../../context/ConsultationContext';

interface ServiceCTAProps {
  title: string;
  description: string;
}

export default function ServiceCTA({ title, description }: ServiceCTAProps) {
  const { openModal } = useConsultation();

  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <h2 className={styles.ctaTitle}>{title}</h2>
        <p className={styles.ctaDesc}>{description}</p>
        <div className={styles.ctaActions}>
          <button onClick={openModal} className={styles.ctaConsult}>
            상담 신청하기
          </button>
          <a href="tel:02-423-7110" className={styles.ctaPrimary}>
            전화 상담 02-423-7110
          </a>
          <Link href="/" className={styles.ctaSecondary}>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
}
