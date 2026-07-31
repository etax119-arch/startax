import 'server-only';

import { getAdminSupabase } from '../supabase/admin';
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from './constants';

/**
 * 칼럼 첨부물(이미지·파일) 업로드의 공통 뼈대.
 *
 * 두 업로드 경로가 다른 것은 '무엇을 허용할지'(이미지는 MIME 화이트리스트,
 * 파일은 확장자 화이트리스트)뿐이고, 나머지 — 크기 검사, 객체 키 규칙, 저장, 공개 URL —
 * 는 같습니다. 그 공통 부분을 여기 한 번만 두어 규칙이 갈라지지 않게 합니다.
 */

/**
 * 상한을 넘으면 사용자에게 보여줄 메시지를, 통과하면 null 을 돌려줍니다.
 * subject 에는 조사까지 붙여 넘깁니다 ('이미지는' / '파일은').
 */
export function uploadSizeError(file: File, subject: string): string | null {
  if (file.size <= MAX_UPLOAD_BYTES) return null;
  return `${subject} ${MAX_UPLOAD_MB}MB 이하만 업로드할 수 있습니다.`;
}

/**
 * 객체 키 규칙: columns/{YYYY}/{MM}/{uuid}.{ext}
 * supabase/schema.sql 의 주석과 같은 규칙이며, 원본 파일명은 쓰지 않습니다
 * (경로 조작과 한글·공백 인코딩 문제를 피하기 위함).
 */
function buildAssetPath(extension: string): string {
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
  /**
   * 주면 공개 URL 에 ?download=<이름> 이 붙어 Content-Disposition: attachment 로
   * 내려갑니다. 첨부 파일처럼 항상 내려받아야 하는 경우에만 씁니다.
   */
  downloadName?: string;
}

/** 저장에 실패하면 로그를 남기고 null 을 돌려줍니다 (호출자가 형식에 맞는 문구로 응답). */
export async function uploadColumnAsset({
  bucket,
  file,
  extension,
  contentType,
  downloadName,
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

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path, downloadName ? { download: downloadName } : undefined);

  return { url: data.publicUrl, path };
}
