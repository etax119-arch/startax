import { redirect } from 'next/navigation';
import AdminLoginForm from '../components/AdminLoginForm';
import { isAdminAuthenticated } from '../../lib/admin/auth';

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect('/admin/columns');
  }
  return <AdminLoginForm />;
}
