import Link from 'next/link';
import styles from './page.module.css';
import AdminColumnTable from '../../components/AdminColumnTable';
import ColumnPagination from '../../../column/components/ColumnPagination';
import { listAdminColumns } from '../../../lib/columns/adminQueries';
import { formatColumnDateTime } from '../../../lib/columns/format';
import { buildAdminColumnListHref } from '../../../lib/columns/href';

interface AdminColumnsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminColumnsPage({ searchParams }: AdminColumnsPageProps) {
  const parsedPage = Number.parseInt((await searchParams).page ?? '1', 10);
  const requestedPage = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;

  const { items: rows, total, page, pageCount } = await listAdminColumns(requestedPage);
  const items = rows.map((row) => ({
    ...row,
    dateLabel: formatColumnDateTime(row.updated_at),
  }));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>칼럼 관리</h1>
          <p className={styles.count}>
            전체 {total}개{pageCount > 1 && ` · ${page}/${pageCount} 페이지`}
          </p>
        </div>
        <Link href="/admin/columns/new" className={styles.newButton}>
          새 칼럼 작성
        </Link>
      </div>

      <AdminColumnTable items={items} />

      <ColumnPagination page={page} pageCount={pageCount} buildHref={buildAdminColumnListHref} />
    </div>
  );
}
