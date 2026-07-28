const SLUG_MAX = 80;

/**
 * 제목을 URL slug 로 변환합니다.
 * 한글은 그대로 남깁니다 — URL 에서 퍼센트 인코딩되며 네이버/구글 모두 정상 처리하고,
 * 키워드가 URL 에 남아 SEO 에 유리합니다. 영문 slug 를 원하면 에디터에서 직접 수정하면 됩니다.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX)
    .replace(/-+$/g, '');
}

/** `base`, `base-2`, `base-3` … 순으로 다음 후보를 만듭니다. */
export function nextSlugCandidate(base: string, attempt: number): string {
  if (attempt <= 1) return base;
  const suffix = `-${attempt}`;
  // 잘라낸 자리에 하이픈이 남으면 `--2` 가 되므로 정리합니다.
  const trimmed = base.slice(0, SLUG_MAX - suffix.length).replace(/-+$/g, '');
  return `${trimmed}${suffix}`;
}
