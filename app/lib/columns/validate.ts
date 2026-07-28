import { COLUMN_LIMITS, isColumnCategory } from './constants';
import { BlockValidationError, validateBlocks } from './blocks';
import { slugify } from './slug';
import type { ColumnInput } from './types';

export class ColumnValidationError extends Error {}

function requireText(value: unknown, label: string, max: number): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ColumnValidationError(`${label}을(를) 입력해주세요.`);
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw new ColumnValidationError(`${label}은(는) ${max}자 이하로 입력해주세요.`);
  }
  return trimmed;
}

function optionalText(value: unknown, label: string, max: number): string {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string') {
    throw new ColumnValidationError(`${label} 형식이 올바르지 않습니다.`);
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw new ColumnValidationError(`${label}은(는) ${max}자 이하로 입력해주세요.`);
  }
  return trimmed;
}

/**
 * 생성/수정 엔드포인트가 공유하는 단일 검증 지점.
 * 클라이언트 검증은 UX용이고, 실제 신뢰 경계는 여기입니다.
 */
export function parseColumnInput(body: unknown): ColumnInput {
  if (!body || typeof body !== 'object') {
    throw new ColumnValidationError('요청 형식이 올바르지 않습니다.');
  }
  const raw = body as Record<string, unknown>;

  const title = requireText(raw.title, '제목', COLUMN_LIMITS.title);

  if (!isColumnCategory(raw.category)) {
    throw new ColumnValidationError('카테고리를 선택해주세요.');
  }

  const rawSlug = optionalText(raw.slug, 'URL 주소', COLUMN_LIMITS.slug);
  const slug = slugify(rawSlug || title);
  // 제목이 전부 특수문자이거나 slugify 가 지원하지 않는 문자로만 이뤄지면 빈 문자열이
  // 됩니다. 그대로 저장하면 /column/ (목록 페이지)와 충돌하므로 반드시 막아야 합니다.
  if (!slug) {
    throw new ColumnValidationError(
      'URL 주소를 만들 수 없습니다. 한글, 영문, 숫자를 포함한 주소를 직접 입력해주세요.'
    );
  }

  let blocks;
  try {
    blocks = validateBlocks(raw.blocks);
  } catch (err) {
    if (err instanceof BlockValidationError) {
      throw new ColumnValidationError(err.message);
    }
    throw err;
  }

  const thumbnailUrl = optionalText(raw.thumbnailUrl, '대표 이미지', COLUMN_LIMITS.url) || null;

  return {
    slug,
    title,
    category: raw.category,
    excerpt: optionalText(raw.excerpt, '요약', COLUMN_LIMITS.excerpt),
    thumbnailUrl,
    blocks,
    published: raw.published === true,
  };
}
