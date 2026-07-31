import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../lib/admin/auth';
import {
  ALLOWED_FILE_EXTENSIONS,
  COLUMN_FILE_BUCKET,
  COLUMN_LIMITS,
  FILE_CONTENT_TYPES,
  isAllowedFileExtension,
} from '../../../lib/columns/constants';
import { uploadColumnAsset, uploadSizeError } from '../../../lib/columns/upload';

/** 파일명에서 소문자 확장자만 뽑습니다. 확장자가 없으면 빈 문자열. */
function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  if (dot < 0 || dot === fileName.length - 1) return '';
  return fileName.slice(dot + 1).toLowerCase();
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: '파일이 필요합니다.' }, { status: 400 });
    }

    // 이미지와 달리 확장자로 거릅니다 — .hwp/.xlsx 는 MIME 이 제각각이라 신뢰할 수 없습니다.
    const extension = extensionOf(file.name);
    if (!isAllowedFileExtension(extension)) {
      const supported = ALLOWED_FILE_EXTENSIONS.map((ext) => ext.toUpperCase()).join(', ');
      return NextResponse.json(
        { error: `지원하지 않는 파일 형식입니다. (${supported})` },
        { status: 400 }
      );
    }

    const tooLarge = uploadSizeError(file, '파일은');
    if (tooLarge) {
      return NextResponse.json({ error: tooLarge }, { status: 400 });
    }

    const name = file.name.slice(0, COLUMN_LIMITS.fileName);
    const uploaded = await uploadColumnAsset({
      bucket: COLUMN_FILE_BUCKET,
      file,
      extension,
      // 클라이언트가 보낸 Content-Type 을 쓰지 않습니다. 위장 파일이 브라우저에서
      // 실행되지 않도록 우리가 고른 값(대개 octet-stream)으로 고정합니다.
      contentType: FILE_CONTENT_TYPES[extension] ?? 'application/octet-stream',
      // 첨부는 항상 내려받기로 열립니다. URL 을 손으로 조립하지 않고 SDK 에 맡깁니다.
      downloadName: name,
    });

    if (!uploaded) {
      return NextResponse.json({ error: '파일 업로드에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ url: uploaded.url, path: uploaded.path, name, size: file.size });
  } catch (err) {
    console.error('Admin file upload error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
