import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/admin/auth';
import { ColumnValidationError, parseColumnInput } from '../../../../lib/columns/validate';
import {
  ColumnNotFoundError,
  deleteColumn,
  revalidateColumns,
  updateColumn,
} from '../../../../lib/columns/persist';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const input = parseColumnInput(await request.json());
    const result = await updateColumn(id, input);

    // slug 가 바뀌었으면 구 경로 캐시도 함께 비워야 옛 URL 이 404 로 바뀝니다.
    revalidateColumns([result.slug, result.previousSlug]);

    return NextResponse.json({ id: result.id, slug: result.slug });
  } catch (err) {
    if (err instanceof ColumnValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof ColumnNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error('Update column error:', err);
    return NextResponse.json({ error: '칼럼 수정에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const { slug } = await deleteColumn(id);

    revalidateColumns([slug]);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof ColumnNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error('Delete column error:', err);
    return NextResponse.json({ error: '칼럼 삭제에 실패했습니다.' }, { status: 500 });
  }
}
