import styles from './ColumnSearchForm.module.css';
import { COLUMN_LIMITS, type ColumnCategory } from '../../../lib/columns/constants';
import { COLUMN_BASE_PATH } from '../../../lib/columns/href';

interface ColumnSearchFormProps {
  category?: ColumnCategory;
  search?: string;
}

export default function ColumnSearchForm({ category, search }: ColumnSearchFormProps) {
  // 평범한 GET 폼이라 자바스크립트 없이도 동작하고, 결과 URL 이 공유 가능합니다.
  return (
    <form action={COLUMN_BASE_PATH} method="get" className={styles.form} role="search">
      {category && <input type="hidden" name="category" value={category} />}
      <input
        type="search"
        name="q"
        defaultValue={search ?? ''}
        placeholder="칼럼 검색"
        aria-label="칼럼 검색"
        maxLength={COLUMN_LIMITS.search}
        className={styles.input}
      />
      <button type="submit" className={styles.button} aria-label="검색">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    </form>
  );
}
