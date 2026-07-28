import Link from 'next/link';
import styles from './page.module.css';
import AdminColumnTable from '../../components/AdminColumnTable';
import { listAllColumns } from '../../../lib/columns/adminQueries';
import { formatColumnDateTime } from '../../../lib/columns/format';

export default async function AdminColumnsPage() {
  const rows = await listAllColumns();
  const items = rows.map((row) => ({
    ...row,
    dateLabel: formatColumnDateTime(row.updated_at),
  }));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>칼럼 관리</h1>
          <p className={styles.count}>전체 {items.length}개</p>
        </div>
        <Link href="/admin/columns/new" className={styles.newButton}>
          새 칼럼 작성
        </Link>
      </div>

      <AdminColumnTable items={items} />
    </div>
  );
}
