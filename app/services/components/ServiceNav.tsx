'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './ServiceNav.module.css';
import { useConsultation } from '../../context/ConsultationContext';

export default function ServiceNav() {
  const { openModal } = useConsultation();

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <Image src="/assets/used/logo/startax_logo.png" alt="STARTAX" width={270} height={310} className={styles.logoIcon} />
          <span className={styles.logoMain}>STARTAX</span>
          <span className={styles.logoSub}>세무법인 스타택스</span>
        </Link>
        <button onClick={openModal} className={styles.ctaButton}>
          상담신청
        </button>
      </div>
    </nav>
  );
}
