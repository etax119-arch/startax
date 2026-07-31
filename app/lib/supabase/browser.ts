import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAnonKey, getSupabaseUrl } from '../env';

let cached: SupabaseClient | null = null;

/**
 * 브라우저에서 쓰는 anon 클라이언트.
 *
 * 지금은 첨부 파일을 서명 URL 로 스토리지에 직접 올리는 데만 씁니다
 * (app/admin/components/FileUploadField). 업로드 권한은 anon 키가 아니라 서버가
 * 발급한 토큰에서 나오므로, 이 클라이언트로 할 수 있는 일이 늘어나지는 않습니다.
 *
 * getPublicSupabase 와 나눠 둔 이유: 그쪽은 server-only 경로에서 쓰이는 읽기용이고,
 * 이건 관리자 화면 번들에 들어갑니다. 한 모듈로 합치면 서버 전용 코드가 클라이언트
 * 번들로 딸려 들어갈 여지가 생깁니다.
 */
export function getBrowserSupabase(): SupabaseClient {
  if (!cached) {
    cached = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
