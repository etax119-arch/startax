/**
 * TypeScript 쪽 단일 출처입니다.
 * 같은 목록이 supabase/schema.sql 의 `check (category in (...))` 제약에도 적혀 있으므로
 * 여기에 항목을 추가하면 DB 제약도 함께 수정해야 합니다.
 * (제약 위반 23514 는 persist.ts 가 사용자에게 보이는 메시지로 변환합니다.)
 */
export const COLUMN_CATEGORIES = [
  '세무',
  '병의원',
  '경영컨설팅',
  '세무상식',
] as const;

export type ColumnCategory = (typeof COLUMN_CATEGORIES)[number];

export function isColumnCategory(value: unknown): value is ColumnCategory {
  return (
    typeof value === 'string' &&
    (COLUMN_CATEGORIES as readonly string[]).includes(value)
  );
}

export const COLUMNS_PAGE_SIZE = 10;

export const COLUMN_LIMITS = {
  title: 120,
  slug: 120,
  excerpt: 300,
  search: 60,
  /** 문단 본문 */
  blockText: 5000,
  /** 소제목 — 클라이언트 maxLength 와 서버 검증이 같은 값을 봐야 합니다. */
  headingText: 200,
  caption: 200,
  alt: 200,
  url: 500,
  blocks: 200,
} as const;

/** 이미지 업로드 제한. Vercel 서버리스 요청 바디 상한(4.5MB)보다 낮게 잡습니다. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** 확장자는 파일명이 아니라 이 화이트리스트에서 파생합니다. SVG는 XSS 위험으로 제외. */
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export const COLUMN_IMAGE_BUCKET = 'column-images';
