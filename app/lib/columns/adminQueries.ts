import 'server-only';

import { getAdminSupabase } from '../supabase/admin';
import { ADMIN_COLUMNS_PAGE_SIZE } from './constants';
import { parseBlocks } from './blocks';
import type { AdminColumnListItem, ColumnRow } from './types';

/**
 * 목록에 필요한 컬럼만 고릅니다 — 특히 blocks(본문 전체 jsonb)를 제외하는 것이 핵심입니다.
 * 예전에는 썸네일 폴백(resolveCoverUrl)을 위해 blocks 를 함께 가져왔지만 관리자 목록은
 * 썸네일을 렌더하지 않아 그 결과를 그대로 버렸습니다. 글이 늘어날수록 본문 전체를
 * 전송받아 파싱하고 버리는 비용만 커집니다.
 */
const ADMIN_LIST_FIELDS =
  'id,slug,title,category,published,published_at,created_at,updated_at';

export interface AdminColumnListResult {
  items: AdminColumnListItem[];
  total: number;
  page: number;
  pageCount: number;
}

/**
 * 관리자 목록. 미발행 글도 보여야 하므로 service_role 클라이언트로 조회합니다.
 * 저장 직후 바로 반영돼야 하는 화면이라 캐시하지 않습니다 — 그래서 한 페이지 분량으로
 * 끊어서 가져오는 것이 중요합니다.
 */
export async function listAdminColumns(page = 1): Promise<AdminColumnListResult> {
  const requested = Math.max(1, page);
  const first = await fetchAdminPage(requested);

  // 마지막 페이지의 마지막 글을 지우면 범위를 벗어난 페이지에 남게 됩니다.
  // 빈 목록을 "칼럼이 없습니다" 로 보여주지 않도록 마지막 페이지로 당겨옵니다.
  if (first.items.length === 0 && first.total > 0 && requested > first.pageCount) {
    return fetchAdminPage(first.pageCount);
  }

  return first;
}

async function fetchAdminPage(page: number): Promise<AdminColumnListResult> {
  const from = (page - 1) * ADMIN_COLUMNS_PAGE_SIZE;

  const { data, error, count } = await getAdminSupabase()
    .from('columns')
    .select(ADMIN_LIST_FIELDS, { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(from, from + ADMIN_COLUMNS_PAGE_SIZE - 1);

  if (error) {
    throw new Error(`listAdminColumns failed: ${error.message}`);
  }

  const total = count ?? 0;
  return {
    items: (data ?? []) as unknown as AdminColumnListItem[],
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / ADMIN_COLUMNS_PAGE_SIZE)),
  };
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
