import Link from 'next/link';
import styles from './not-found.module.css';
import { COLUMN_BASE_PATH } from '../lib/columns/href';

export default function ColumnNotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.body}>
        <p className={styles.tag}>404</p>
        <h1 className={styles.title}>칼럼을 찾을 수 없습니다</h1>
        <p className={styles.desc}>삭제되었거나 주소가 변경된 글일 수 있습니다.</p>
        <Link href={COLUMN_BASE_PATH} className={styles.backButton}>
          칼럼 목록으로
        </Link>
      </div>
    </div>
  );
}
