'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './AdminHeader.module.css';
import { COLUMN_BASE_PATH } from '../../../lib/columns/href';

export default function AdminHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/admin/columns" className={styles.brand}>
          <span className={styles.logo}>STARTAX</span>
          <span className={styles.label}>칼럼 관리</span>
        </Link>

        <div className={styles.actions}>
          <Link href={COLUMN_BASE_PATH} className={styles.link} target="_blank" rel="noopener noreferrer">
            사이트 보기
          </Link>
          <button onClick={handleLogout} className={styles.logout} disabled={isLoggingOut}>
            {isLoggingOut ? '로그아웃 중…' : '로그아웃'}
          </button>
        </div>
      </div>
    </header>
  );
}
