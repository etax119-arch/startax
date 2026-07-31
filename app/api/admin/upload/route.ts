import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../lib/admin/auth';
import {
  ALLOWED_IMAGE_TYPES,
  COLUMN_IMAGE_BUCKET,
  MAX_UPLOAD_BYTES,
} from '../../../lib/columns/constants';
import { uploadColumnAsset, uploadSizeError } from '../../../lib/columns/upload';

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

    const tooLarge = uploadSizeError(file.size, '이미지는', MAX_UPLOAD_BYTES);
    if (tooLarge) {
      return NextResponse.json({ error: tooLarge }, { status: 400 });
    }

    const uploaded = await uploadColumnAsset({
      bucket: COLUMN_IMAGE_BUCKET,
      file,
      extension,
      // 이미 화이트리스트로 검증한 MIME 이라 그대로 씁니다 — 브라우저가 <img> 로 렌더해야 합니다.
      contentType: file.type,
    });

    if (!uploaded) {
      return NextResponse.json({ error: '이미지 업로드에 실패했습니다.' }, { status: 500 });
    }
    return NextResponse.json(uploaded);
  } catch (err) {
    console.error('Admin upload error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
