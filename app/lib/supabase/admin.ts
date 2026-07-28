import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseServiceRoleKey, getSupabaseUrl } from '../env';

let cached: SupabaseClient | null = null;

/**
 * service_role 키 — RLS 를 완전히 우회합니다.
 * 절대 클라이언트 컴포넌트나, 클라이언트 컴포넌트에서 도달 가능한 모듈에서
 * import 하지 마세요. 최상단의 'server-only' 가 그런 import 를 빌드 에러로 막습니다.
 */
export function getAdminSupabase(): SupabaseClient {
  if (!cached) {
    cached = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
