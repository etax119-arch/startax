import type { ColumnCategory } from './constants';

/** 칼럼 섹션의 기준 경로. 경로를 바꿀 일이 생기면 여기 한 곳만 고치면 됩니다. */
export const COLUMN_BASE_PATH = '/column';

export interface ColumnListQuery {
  category?: ColumnCategory;
  q?: string;
  page?: number;
}

/**
 * 목록 페이지 URL 을 만듭니다. 기본값(page=1, 카테고리 없음)은 쿼리에서 생략해
 * 같은 화면이 여러 URL 로 색인되는 걸 막습니다.
 */
export function buildColumnListHref({ category, q, page }: ColumnListQuery): string {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (q) params.set('q', q);
  if (page && page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `${COLUMN_BASE_PATH}?${query}` : COLUMN_BASE_PATH;
}

/** 상세 페이지 경로. 한글 slug 가 있으므로 인코딩을 여기서 한 번만 책임집니다. */
export function buildColumnHref(slug: string): string {
  return `${COLUMN_BASE_PATH}/${encodeURIComponent(slug)}`;
}

/** 관리자 칼럼 목록 경로. 1페이지는 쿼리를 생략합니다. */
export const ADMIN_COLUMN_BASE_PATH = '/admin/columns';

export function buildAdminColumnListHref(page?: number): string {
  return page && page > 1 ? `${ADMIN_COLUMN_BASE_PATH}?page=${page}` : ADMIN_COLUMN_BASE_PATH;
}
