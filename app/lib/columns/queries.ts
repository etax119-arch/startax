import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { getPublicSupabase } from '../supabase/public';
import { COLUMNS_PAGE_SIZE, type ColumnCategory } from './constants';
import { parseBlocks, resolveCoverUrl } from './blocks';
import type { ColumnListItem, ColumnRow } from './types';

export const COLUMNS_CACHE_TAG = 'columns';

// blocks 를 함께 가져오는 이유: 대표 이미지가 없는 글의 썸네일을 본문에서 찾아야
// 합니다. 페이지당 10건으로 제한돼 있고 파생한 URL 만 HTML 로 나가므로,
// 이 비용은 서버 ↔ DB 구간에만 발생하고 60초 캐시로 다시 줄어듭니다.
const LIST_FIELDS =
  'id,slug,title,category,excerpt,thumbnail_url,blocks,published_at,created_at';

export interface ListColumnsParams {
  /** 1-based */
  page: number;
  category?: ColumnCategory;
  search?: string;
}

export interface ListColumnsResult {
  items: ColumnListItem[];
  total: number;
  page: number;
  pageCount: number;
}

/** ILIKE 패턴에서 특수문자를 리터럴로 취급하게 합니다. */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

async function fetchColumnList(params: ListColumnsParams): Promise<ListColumnsResult> {
  const page = Math.max(1, params.page);
  const from = (page - 1) * COLUMNS_PAGE_SIZE;

  let query = getPublicSupabase()
    .from('columns')
    .select(LIST_FIELDS, { count: 'exact' })
    // RLS 가 이미 걸러주지만, 인덱스를 타게 하고 의도를 명시하기 위해 함께 둡니다.
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(from, from + COLUMNS_PAGE_SIZE - 1);

  if (params.category) {
    query = query.eq('category', params.category);
  }
  if (params.search) {
    query = query.ilike('search_text', `%${escapeLike(params.search)}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(`listPublishedColumns failed: ${error.message}`);
  }

  const total = count ?? 0;
  return {
    items: (data ?? []).map(toListItem),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / COLUMNS_PAGE_SIZE)),
  };
}

/** DB 행을 목록 아이템으로 변환합니다. blocks 는 여기서 소비하고 밖으로 내보내지 않습니다. */
export function toListItem(row: Record<string, unknown>): ColumnListItem {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as ColumnListItem['category'],
    excerpt: row.excerpt as string,
    published_at: row.published_at as string | null,
    created_at: row.created_at as string,
    coverUrl: resolveCoverUrl(
      (row.thumbnail_url as string | null) ?? null,
      parseBlocks(row.blocks)
    ),
  };
}

export async function listPublishedColumns(
  params: ListColumnsParams
): Promise<ListColumnsResult> {
  const key = [
    'columns-list',
    String(params.page),
    params.category ?? '',
    params.search ?? '',
  ];
  const run = unstable_cache(() => fetchColumnList(params), key, {
    revalidate: 60,
    tags: [COLUMNS_CACHE_TAG],
  });
  return run();
}

async function fetchColumnBySlug(slug: string): Promise<ColumnRow | null> {
  const { data, error } = await getPublicSupabase()
    .from('columns')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    throw new Error(`getPublishedColumnBySlug failed: ${error.message}`);
  }
  if (!data) return null;

  return { ...data, blocks: parseBlocks(data.blocks) } as ColumnRow;
}

/**
 * generateMetadata 와 페이지 본문이 같은 글을 각각 조회하므로 React cache 로 dedupe 합니다.
 * (한 번의 렌더 안에서만 유효하며, 요청 간 캐시는 라우트의 revalidate 가 담당합니다.)
 */
export const getPublishedColumnBySlug = cache(fetchColumnBySlug);

export async function getAllPublishedSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  const run = unstable_cache(
    async () => {
      const { data, error } = await getPublicSupabase()
        .from('columns')
        .select('slug,updated_at')
        .eq('published', true)
        .order('published_at', { ascending: false, nullsFirst: false });

      if (error) {
        throw new Error(`getAllPublishedSlugs failed: ${error.message}`);
      }
      return (data ?? []) as { slug: string; updated_at: string }[];
    },
    ['columns-slugs'],
    { revalidate: 3600, tags: [COLUMNS_CACHE_TAG] }
  );
  return run();
}
