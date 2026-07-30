import Link from 'next/link';
import styles from './ColumnPagination.module.css';

interface ColumnPaginationProps {
  page: number;
  pageCount: number;
  /**
   * 페이지 번호 → URL. 공개 목록과 관리자 목록이 서로 다른 경로·쿼리를 쓰므로
   * 링크 생성만 호출자가 넘기고 이 컴포넌트는 표시에만 집중합니다.
   */
  buildHref: (page: number) => string;
}

const WINDOW = 2;

/** 현재 페이지 주변 ±2 만 노출하고 나머지는 생략합니다. */
function buildPageNumbers(page: number, pageCount: number): number[] {
  const start = Math.max(1, Math.min(page - WINDOW, pageCount - WINDOW * 2));
  const end = Math.min(pageCount, Math.max(page + WINDOW, WINDOW * 2 + 1));
  const pages: number[] = [];
  for (let i = start; i <= end; i += 1) pages.push(i);
  return pages;
}

export default function ColumnPagination({
  page,
  pageCount,
  buildHref,
}: ColumnPaginationProps) {
  if (pageCount <= 1) return null;

  const pages = buildPageNumbers(page, pageCount);
  const href = buildHref;

  return (
    <nav className={styles.nav} aria-label="페이지 이동">
      {page > 1 ? (
        <Link href={href(page - 1)} className={styles.arrow} rel="prev" aria-label="이전 페이지">
          이전
        </Link>
      ) : (
        <span className={`${styles.arrow} ${styles.disabled}`} aria-hidden="true">
          이전
        </span>
      )}

      <div className={styles.pages}>
        {pages[0] > 1 && (
          <>
            <Link href={href(1)} className={styles.page}>
              1
            </Link>
            {pages[0] > 2 && <span className={styles.ellipsis}>…</span>}
          </>
        )}

        {pages.map((target) => (
          <Link
            key={target}
            href={href(target)}
            className={`${styles.page} ${target === page ? styles.pageActive : ''}`}
            aria-current={target === page ? 'page' : undefined}
          >
            {target}
          </Link>
        ))}

        {pages[pages.length - 1] < pageCount && (
          <>
            {pages[pages.length - 1] < pageCount - 1 && <span className={styles.ellipsis}>…</span>}
            <Link href={href(pageCount)} className={styles.page}>
              {pageCount}
            </Link>
          </>
        )}
      </div>

      {page < pageCount ? (
        <Link href={href(page + 1)} className={styles.arrow} rel="next" aria-label="다음 페이지">
          다음
        </Link>
      ) : (
        <span className={`${styles.arrow} ${styles.disabled}`} aria-hidden="true">
          다음
        </span>
      )}
    </nav>
  );
}
