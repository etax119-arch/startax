import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAnonKey, getSupabaseUrl } from '../env';

let cached: SupabaseClient | null = null;

/**
 * anon 키를 쓰는 읽기 전용 클라이언트. RLS 가 적용되어 발행된 글만 보입니다.
 *
 * 지연 생성하는 이유: 모듈 최상위에서 만들면 환경변수가 없는 환경(로컬 초기 설정,
 * CI 등)에서 import 만으로 빌드가 터집니다. app/api/send-email/route.ts 가
 * 그 패턴이라 같은 문제를 반복하지 않기 위함입니다.
 */
export function getPublicSupabase(): SupabaseClient {
  if (!cached) {
    cached = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
