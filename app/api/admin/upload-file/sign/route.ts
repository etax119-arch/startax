import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/admin/auth';
import { getAdminSupabase } from '../../../../lib/supabase/admin';
import {
  ALLOWED_FILE_EXTENSIONS,
  COLUMN_FILE_BUCKET,
  COLUMN_LIMITS,
  FILE_CONTENT_TYPES,
  MAX_FILE_UPLOAD_BYTES,
  isAllowedFileExtension,
} from '../../../../lib/columns/constants';
import { buildAssetPath, uploadSizeError } from '../../../../lib/columns/upload';

/**
 * 첨부 파일 업로드용 서명 URL 발급.
 *
 * 파일 자체는 이 라우트를 지나가지 않습니다 — Vercel 함수의 요청 바디 상한이 4.5MB 라
 * 그보다 큰 문서를 받으려면 브라우저가 스토리지로 직접 올려야 합니다. 여기서는
 * 권한과 형식·크기를 검사하고, 올릴 자리(경로)와 그 자리의 최종 공개 URL 만 정해 줍니다.
 *
 * 서명을 받은 뒤 다른 파일을 올리는 것까지는 막지 못하므로, 실제 상한은 버킷의
 * file_size_limit / allowed_mime_types 가 강제합니다 (supabase/schema.sql 참고).
 */

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
    const body = (await request.json()) as { name?: unknown; size?: unknown };
    const rawName = typeof body.name === 'string' ? body.name : '';
    const size = typeof body.size === 'number' && Number.isFinite(body.size) ? body.size : -1;

    if (!rawName || size < 0) {
      return NextResponse.json({ error: '파일 정보가 올바르지 않습니다.' }, { status: 400 });
    }

    // 이미지와 달리 확장자로 거릅니다 — .hwp/.xlsx 는 MIME 이 제각각이라 신뢰할 수 없습니다.
    const extension = extensionOf(rawName);
    if (!isAllowedFileExtension(extension)) {
      const supported = ALLOWED_FILE_EXTENSIONS.map((ext) => ext.toUpperCase()).join(', ');
      return NextResponse.json(
        { error: `지원하지 않는 파일 형식입니다. (${supported})` },
        { status: 400 }
      );
    }

    const tooLarge = uploadSizeError(size, '파일은', MAX_FILE_UPLOAD_BYTES);
    if (tooLarge) {
      return NextResponse.json({ error: tooLarge }, { status: 400 });
    }

    const name = rawName.slice(0, COLUMN_LIMITS.fileName);
    const path = buildAssetPath(extension);
    const supabase = getAdminSupabase();

    const { data, error } = await supabase.storage
      .from(COLUMN_FILE_BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error('Supabase signed upload url error:', error);
      return NextResponse.json({ error: '파일 업로드를 시작하지 못했습니다.' }, { status: 500 });
    }

    // 업로드 전에도 최종 URL 을 알 수 있습니다(경로를 우리가 정했으므로).
    // download 를 붙여 두면 Content-Disposition: attachment 로 내려갑니다.
    const { data: publicUrl } = supabase.storage
      .from(COLUMN_FILE_BUCKET)
      .getPublicUrl(path, { download: name });

    return NextResponse.json({
      path: data.path,
      token: data.token,
      url: publicUrl.publicUrl,
      name,
      // 클라이언트가 이 타입으로 올리도록 알려 줍니다. 강제력은 버킷 설정에 있습니다.
      contentType: FILE_CONTENT_TYPES[extension] ?? 'application/octet-stream',
    });
  } catch (err) {
    console.error('Admin file sign error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
