'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './AdminLoginForm.module.css';
import { postJson } from '../../../lib/http';

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!password || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    const result = await postJson('/api/admin/login', { password }, '로그인에 실패했습니다.');

    if (!result.ok) {
      setError(result.error);
      setPassword('');
      setIsSubmitting(false);
      return;
    }

    // 서버 컴포넌트가 새 쿠키를 읽도록 캐시를 갱신한 뒤 이동합니다.
    router.replace('/admin/columns');
    router.refresh();
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>STARTAX</span>
          <h1 className={styles.title}>관리자 로그인</h1>
          <p className={styles.desc}>칼럼을 등록하고 관리하려면 비밀번호를 입력하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="admin-password" className={styles.label}>
              비밀번호
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={styles.input}
              autoComplete="current-password"
              autoFocus
              required
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={!password || isSubmitting}
          >
            {isSubmitting ? '확인 중…' : '로그인'}
          </button>
        </form>

        <Link href="/" className={styles.backLink}>
          ← 홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
