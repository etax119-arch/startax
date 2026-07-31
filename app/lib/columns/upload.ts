import 'server-only';

import { getAdminSupabase } from '../supabase/admin';

/**
 * 칼럼 첨부물 업로드의 공통 조각.
 *
 * 이미지는 서버 라우트를 거쳐 올라가고(uploadColumnAsset), 첨부 파일은 서명 URL 로
 * 스토리지에 직접 올라갑니다 — Vercel 함수의 4.5MB 바디 상한 때문입니다.
 * 경로 규칙과 크기 메시지는 두 경로가 공유해야 하므로 여기 모읍니다.
 */

/**
 * 상한을 넘으면 사용자에게 보여줄 메시지를, 통과하면 null 을 돌려줍니다.
 * subject 에는 조사까지 붙여 넘깁니다 ('이미지는' / '파일은').
 */
export function uploadSizeError(size: number, subject: string, maxBytes: number): string | null {
  if (size <= maxBytes) return null;
  return `${subject} ${Math.round(maxBytes / (1024 * 1024))}MB 이하만 업로드할 수 있습니다.`;
}

/**
 * 객체 키 규칙: columns/{YYYY}/{MM}/{uuid}.{ext}
 * supabase/schema.sql 의 주석과 같은 규칙이며, 원본 파일명은 쓰지 않습니다
 * (경로 조작과 한글·공백 인코딩 문제를 피하기 위함).
 */
export function buildAssetPath(extension: string): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `columns/${year}/${month}/${crypto.randomUUID()}.${extension}`;
}

interface UploadColumnAssetParams {
  bucket: string;
  file: File;
  /** 저장 경로에 쓸 확장자. 호출자가 자기 화이트리스트로 이미 검증한 값입니다. */
  extension: string;
  /** 저장할 Content-Type. 클라이언트가 보낸 값을 그대로 넘기지 마세요. */
  contentType: string;
}

/** 저장에 실패하면 로그를 남기고 null 을 돌려줍니다 (호출자가 형식에 맞는 문구로 응답). */
export async function uploadColumnAsset({
  bucket,
  file,
  extension,
  contentType,
}: UploadColumnAssetParams): Promise<{ url: string; path: string } | null> {
  const path = buildAssetPath(extension);
  const supabase = getAdminSupabase();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, await file.arrayBuffer(), {
      contentType,
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
}
