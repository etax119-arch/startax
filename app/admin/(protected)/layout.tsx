import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import styles from './layout.module.css';
import AdminHeader from '../components/AdminHeader';
import { isAdminAuthenticated } from '../../lib/admin/auth';

/**
 * 관리자 화면의 실질적 관문입니다.
 * cookies() 를 읽는 것만으로 하위 페이지 전체가 동적 렌더로 전환되므로
 * 관리자 HTML 이 정적 캐시에 남을 여지가 없습니다.
 */
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login');
  }

  return (
    <div className={styles.shell}>
      <AdminHeader />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
