import 'server-only';

import { getAdminSupabase } from '../supabase/admin';
import { parseBlocks } from './blocks';
import type { AdminColumnListItem, ColumnRow } from './types';

/** 관리자 목록은 미발행 글도 보여야 하므로 service_role 클라이언트로 조회합니다. */
export async function listAllColumns(): Promise<AdminColumnListItem[]> {
  const { data, error } = await getAdminSupabase()
    .from('columns')
    .select('id,slug,title,category,excerpt,thumbnail_url,published,published_at,created_at,updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`listAllColumns failed: ${error.message}`);
  }
  return (data ?? []) as AdminColumnListItem[];
}

export async function getColumnById(id: string): Promise<ColumnRow | null> {
  const { data, error } = await getAdminSupabase()
    .from('columns')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`getColumnById failed: ${error.message}`);
  }
  if (!data) return null;

  return { ...data, blocks: parseBlocks(data.blocks) } as ColumnRow;
}
