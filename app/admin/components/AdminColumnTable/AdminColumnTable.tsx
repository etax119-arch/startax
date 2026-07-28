'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './AdminColumnTable.module.css';
import { buildColumnHref } from '../../../lib/columns/href';
import { requestJson } from '../../../lib/http';
import type { AdminColumnListItem } from '../../../lib/columns/types';

/** dateLabel 은 서버에서 KST 로 포맷해 붙여줍니다 (클라이언트 포맷 시 hydration mismatch). */
export type AdminColumnRow = AdminColumnListItem & { dateLabel: string };

interface AdminColumnTableProps {
  items: AdminColumnRow[];
}

export default function AdminColumnTable({ items }: AdminColumnTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleDelete = async (item: AdminColumnRow) => {
    if (!window.confirm(`"${item.title}" 칼럼을 삭제할까요? 되돌릴 수 없습니다.`)) return;

    setDeletingId(item.id);
    setError('');

    const result = await requestJson(
      `/api/admin/columns/${item.id}`,
      { method: 'DELETE' },
      '삭제에 실패했습니다.'
    );

    setDeletingId(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  };

  if (items.length === 0) {
    return <p className={styles.empty}>아직 작성한 칼럼이 없습니다.</p>;
  }

  return (
    <div className={styles.wrapper}>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.row}>
            <div className={styles.info}>
              <div className={styles.meta}>
                <span
                  className={`${styles.status} ${item.published ? styles.statusLive : styles.statusDraft}`}
                >
                  {item.published ? '발행됨' : '임시저장'}
                </span>
                <span className={styles.category}>{item.category}</span>
                <span className={styles.date}>{item.dateLabel}</span>
              </div>
              <h2 className={styles.title}>{item.title}</h2>
              <p className={styles.slug}>/column/{item.slug}</p>
            </div>

            <div className={styles.actions}>
              {item.published && (
                <Link
                  href={buildColumnHref(item.slug)}
                  className={styles.viewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  보기
                </Link>
              )}
              <Link href={`/admin/columns/${item.id}/edit`} className={styles.editLink}>
                수정
              </Link>
              <button
                type="button"
                className={styles.dangerButton}
                onClick={() => handleDelete(item)}
                disabled={deletingId === item.id}
              >
                {deletingId === item.id ? '삭제 중…' : '삭제'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
