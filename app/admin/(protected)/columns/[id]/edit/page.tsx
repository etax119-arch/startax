import { notFound } from 'next/navigation';
import ColumnEditor from '../../../../components/ColumnEditor';
import { getColumnById } from '../../../../../lib/columns/adminQueries';

interface EditColumnPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditColumnPage({ params }: EditColumnPageProps) {
  const { id } = await params;
  const column = await getColumnById(id);

  if (!column) {
    notFound();
  }

  return <ColumnEditor column={column} />;
}
