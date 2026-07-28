import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import ColumnListRow from './components/ColumnListRow';
import ColumnFilterBar from './components/ColumnFilterBar';
import ColumnSearchForm from './components/ColumnSearchForm';
import ColumnPagination from './components/ColumnPagination';
import { SITE_NAME, SITE_URL } from '../lib/site';
import { COLUMN_LIMITS, isColumnCategory, type ColumnCategory } from '../lib/columns/constants';
import { buildColumnListHref } from '../lib/columns/href';
import { listPublishedColumns } from '../lib/columns/queries';

interface ColumnPageProps {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}

interface ParsedParams {
  page: number;
  category?: ColumnCategory;
  search?: string;
}

function parseParams(raw: { page?: string; category?: string; q?: string }): ParsedParams {
  const parsedPage = Number.parseInt(raw.page ?? '1', 10);
  const search = (raw.q ?? '').trim().slice(0, COLUMN_LIMITS.search);

  return {
    page: Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1,
    // 알 수 없는 카테고리는 무시하고 전체 목록을 보여줍니다.
    category: isColumnCategory(raw.category) ? raw.category : undefined,
    search: search || undefined,
  };
}

export async function generateMetadata({ searchParams }: ColumnPageProps): Promise<Metadata> {
  const { page, category, search } = parseParams(await searchParams);

  const title = category
    ? `${category} 칼럼 | ${SITE_NAME}`
    : `칼럼 | ${SITE_NAME}`;
  const description = category
    ? `${SITE_NAME}가 전하는 ${category} 관련 세무 칼럼입니다. 실무에서 자주 마주치는 세금 이슈를 쉽게 풀어드립니다.`
    : `${SITE_NAME}가 전하는 세무 칼럼입니다. 절세 전략부터 세무조사 대응까지, 실무에서 바로 쓸 수 있는 정보를 정리했습니다.`;

  const canonical = `${SITE_URL}${buildColumnListHref({ category })}`;

  // 검색 결과와 2페이지 이후는 얇은/중복 콘텐츠이므로 색인에서 제외하되 링크는 따라가게 합니다.
  const noIndex = Boolean(search) || page > 1;

  return {
    title,
    description,
    alternates: { canonical },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'ko_KR',
    },
  };
}

export default async function ColumnPage({ searchParams }: ColumnPageProps) {
  const { page, category, search } = parseParams(await searchParams);
  const { items, total, pageCount } = await listPublishedColumns({ page, category, search });

  // 존재하지 않는 페이지가 무한히 크롤되는 걸 막습니다.
  if (total > 0 && page > pageCount) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.tag}>Column</p>
          <h1 className={styles.title}>칼럼</h1>
          <p className={styles.desc}>
            세무법인 스타택스가 현장에서 마주한 세금 이슈를 정리해 전해드립니다.
          </p>
        </header>

        <div className={styles.controls}>
          <ColumnFilterBar activeCategory={category} search={search} />
          <ColumnSearchForm category={category} search={search} />
        </div>

        {search && (
          <p className={styles.resultMeta}>
            <strong>{search}</strong> 검색 결과 {total}건
          </p>
        )}

        {items.length > 0 ? (
          <div className={styles.list}>
            {items.map((item) => (
              <ColumnListRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            {search || category
              ? '조건에 맞는 칼럼이 없습니다.'
              : '아직 등록된 칼럼이 없습니다.'}
          </p>
        )}

        <ColumnPagination
          page={page}
          pageCount={pageCount}
          category={category}
          search={search}
        />
      </div>
    </div>
  );
}
