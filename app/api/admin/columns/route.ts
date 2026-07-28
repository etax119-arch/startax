import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../lib/admin/auth';
import { ColumnValidationError, parseColumnInput } from '../../../lib/columns/validate';
import { insertColumn, revalidateColumns } from '../../../lib/columns/persist';

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const input = parseColumnInput(await request.json());
    const result = await insertColumn(input);

    revalidateColumns([result.slug]);

    return NextResponse.json({ id: result.id, slug: result.slug }, { status: 201 });
  } catch (err) {
    if (err instanceof ColumnValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error('Create column error:', err);
    return NextResponse.json({ error: '칼럼 저장에 실패했습니다.' }, { status: 500 });
  }
}
