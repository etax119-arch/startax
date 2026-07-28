import Link from 'next/link';
import styles from './ColumnFilterBar.module.css';
import { COLUMN_CATEGORIES, type ColumnCategory } from '../../../lib/columns/constants';
import { buildColumnListHref } from '../../../lib/columns/href';

interface ColumnFilterBarProps {
  activeCategory?: ColumnCategory;
  search?: string;
}

export default function ColumnFilterBar({ activeCategory, search }: ColumnFilterBarProps) {
  // 순수 <Link> 이므로 크롤러가 각 카테고리 페이지를 따라갈 수 있습니다.
  return (
    <nav className={styles.bar} aria-label="카테고리 필터">
      <Link
        href={buildColumnListHref({ q: search })}
        className={`${styles.chip} ${activeCategory ? '' : styles.chipActive}`}
      >
        전체
      </Link>
      {COLUMN_CATEGORIES.map((category) => (
        <Link
          key={category}
          href={buildColumnListHref({ category, q: search })}
          className={`${styles.chip} ${activeCategory === category ? styles.chipActive : ''}`}
        >
          {category}
        </Link>
      ))}
    </nav>
  );
}
