import 'server-only';

import { revalidatePath, revalidateTag } from 'next/cache';
import { getAdminSupabase } from '../supabase/admin';
import { buildExcerpt, buildSearchText } from './blocks';
import { COLUMN_BASE_PATH, buildColumnHref } from './href';
import { nextSlugCandidate } from './slug';
import { COLUMNS_CACHE_TAG } from './queries';
import { ColumnValidationError } from './validate';
import type { ColumnInput } from './types';

const UNIQUE_VIOLATION = '23505';
const CHECK_VIOLATION = '23514';
const MAX_SLUG_ATTEMPTS = 20;

export class ColumnNotFoundError extends Error {}

interface ColumnRecord {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  thumbnail_url: string | null;
  blocks: ColumnInput['blocks'];
  search_text: string;
  published: boolean;
}

/**
 * 요약을 비워두면 첫 문단에서 자동 생성하고, 검색용 평문도 여기서 계산합니다.
 * slug 재시도 루프 밖에서 한 번만 계산합니다 — 시도마다 바뀌는 건 slug 뿐인데
 * buildSearchText 는 본문 블록 전체를 훑기 때문입니다.
 */
function buildRecord(input: ColumnInput): Omit<ColumnRecord, 'slug'> {
  const excerpt = input.excerpt || buildExcerpt(input.blocks);
  return {
    title: input.title,
    category: input.category,
    excerpt,
    thumbnail_url: input.thumbnailUrl,
    blocks: input.blocks,
    search_text: buildSearchText(input.title, excerpt, input.blocks),
    published: input.published,
  };
}

/** 목록/사이트맵 캐시와 지정한 상세 페이지들을 무효화합니다. */
export function revalidateColumns(slugs: string[]) {
  // Next 16 의 두 번째 인자는 무효화 대상의 최대 수명입니다.
  // 'max' 로 두면 수명과 무관하게 모든 항목이 즉시 만료됩니다.
  // (updateTag 는 Server Action 전용이라 Route Handler 에서는 쓸 수 없습니다.)
  revalidateTag(COLUMNS_CACHE_TAG, 'max');
  revalidatePath(COLUMN_BASE_PATH);
  revalidatePath('/sitemap.xml');
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(buildColumnHref(slug));
  }
}

interface SupabaseWriteResult<T> {
  data: T | null;
  error: { code?: string; message: string } | null;
}

/**
 * slug 가 이미 있으면 `-2`, `-3` … 으로 재시도합니다.
 * 사전 조회 대신 unique 위반(23505)을 잡는 이유는, 조회와 삽입 사이의 경합에서도
 * 데이터베이스 제약이 최종 판정을 내리게 하기 위함입니다.
 */
async function withSlugRetry<T>(
  base: string,
  label: string,
  run: (slug: string) => PromiseLike<SupabaseWriteResult<T>>
): Promise<T> {
  for (let attempt = 1; attempt <= MAX_SLUG_ATTEMPTS; attempt += 1) {
    const { data, error } = await run(nextSlugCandidate(base, attempt));

    if (!error) return data as T;
    if (error.code === UNIQUE_VIOLATION) continue;
    // 카테고리 CHECK 제약 위반은 코드의 COLUMN_CATEGORIES 와 스키마가 어긋난 경우입니다.
    // 불투명한 500 대신 원인을 알 수 있는 메시지로 바꿔 돌려줍니다.
    if (error.code === CHECK_VIOLATION) {
      throw new ColumnValidationError(
        '데이터베이스가 허용하지 않는 값입니다. 카테고리 목록이 스키마와 일치하는지 확인해주세요.'
      );
    }
    throw new Error(`${label} failed: ${error.message}`);
  }

  throw new ColumnValidationError(
    '사용 가능한 URL 주소를 찾지 못했습니다. 주소를 직접 지정해주세요.'
  );
}

export interface PersistResult {
  id: string;
  slug: string;
}

export async function insertColumn(input: ColumnInput): Promise<PersistResult> {
  const supabase = getAdminSupabase();
  const publishedAt = input.published ? new Date().toISOString() : null;
  const record = buildRecord(input);

  return withSlugRetry<PersistResult>(input.slug, 'insertColumn', (slug) =>
    supabase
      .from('columns')
      .insert({ ...record, slug, published_at: publishedAt })
      .select('id,slug')
      .single()
  );
}

export interface UpdateColumnResult extends PersistResult {
  previousSlug: string;
}

export async function updateColumn(
  id: string,
  input: ColumnInput
): Promise<UpdateColumnResult> {
  const supabase = getAdminSupabase();

  const { data: existing, error: fetchError } = await supabase
    .from('columns')
    .select('slug,published_at')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`updateColumn failed: ${fetchError.message}`);
  }
  if (!existing) {
    throw new ColumnNotFoundError('해당 칼럼을 찾을 수 없습니다.');
  }

  // 미발행 → 발행으로 처음 전환될 때만 발행 시각을 찍습니다.
  // (이미 발행된 글을 수정해도 발행일이 밀리지 않도록)
  const publishedAt =
    input.published && !existing.published_at
      ? new Date().toISOString()
      : existing.published_at;

  const record = buildRecord(input);

  const result = await withSlugRetry<PersistResult>(input.slug, 'updateColumn', (slug) =>
    supabase
      .from('columns')
      .update({ ...record, slug, published_at: publishedAt })
      .eq('id', id)
      .select('id,slug')
      .single()
  );

  return { ...result, previousSlug: existing.slug };
}

export async function deleteColumn(id: string): Promise<{ slug: string }> {
  const { data, error } = await getAdminSupabase()
    .from('columns')
    .delete()
    .eq('id', id)
    .select('slug')
    .maybeSingle();

  if (error) {
    throw new Error(`deleteColumn failed: ${error.message}`);
  }
  if (!data) {
    throw new ColumnNotFoundError('해당 칼럼을 찾을 수 없습니다.');
  }

  return data as { slug: string };
}
