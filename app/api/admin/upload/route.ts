import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../lib/admin/auth';
import { getAdminSupabase } from '../../../lib/supabase/admin';
import {
  ALLOWED_IMAGE_TYPES,
  COLUMN_IMAGE_BUCKET,
  MAX_UPLOAD_BYTES,
} from '../../../lib/columns/constants';

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: '파일이 필요합니다.' }, { status: 400 });
    }

    // 확장자는 파일명이 아니라 화이트리스트 MIME 에서 파생합니다.
    // (.html 을 .jpg 로 개명해 올리는 우회를 막고, SVG 는 XSS 위험으로 아예 제외)
    const extension = ALLOWED_IMAGE_TYPES[file.type];
    if (!extension) {
      const supported = Object.values(ALLOWED_IMAGE_TYPES)
        .map((ext) => ext.toUpperCase())
        .join(', ');
      return NextResponse.json(
        { error: `지원하지 않는 이미지 형식입니다. (${supported})` },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      const limitMb = Math.round(MAX_UPLOAD_BYTES / (1024 * 1024));
      return NextResponse.json(
        { error: `이미지는 ${limitMb}MB 이하만 업로드할 수 있습니다.` },
        { status: 400 }
      );
    }

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const path = `columns/${year}/${month}/${crypto.randomUUID()}.${extension}`;

    const supabase = getAdminSupabase();
    const { error } = await supabase.storage
      .from(COLUMN_IMAGE_BUCKET)
      .upload(path, await file.arrayBuffer(), {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return NextResponse.json({ error: '이미지 업로드에 실패했습니다.' }, { status: 500 });
    }

    const { data } = supabase.storage.from(COLUMN_IMAGE_BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path });
  } catch (err) {
    console.error('Admin upload error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
