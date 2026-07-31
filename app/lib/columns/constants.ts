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

/** 관리자 목록은 관리 작업이라 한 화면에 더 많이 보여줍니다. */
export const ADMIN_COLUMNS_PAGE_SIZE = 20;

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
  /** 첨부 파일 표시 이름 */
  fileName: 200,
} as const;

/**
 * 이미지 업로드 상한.
 *
 * 이미지는 서버 라우트를 거쳐 올라가므로 Vercel 함수의 요청 바디 상한(4.5MB)에
 * 묶입니다. 이 값을 올리면 그 요청이 413 으로 통째로 거부되므로, 더 큰 이미지를
 * 받으려면 첨부 파일처럼 스토리지로 직접 올리는 방식으로 바꿔야 합니다.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** 화면 문구용. 서버 에러 메시지와 편집기 안내가 같은 값을 보게 합니다. */
export const MAX_UPLOAD_MB = MAX_UPLOAD_BYTES / (1024 * 1024);

/**
 * 첨부 파일 상한.
 *
 * 첨부는 서명 URL 로 스토리지에 직접 올라가 서버 함수를 거치지 않으므로 4.5MB 제약이
 * 없습니다. 다만 이 상수는 '안내와 사전 차단'일 뿐 실제 강제력은 버킷의
 * file_size_limit 에 있습니다 — 서명을 받은 뒤 다른 파일을 올릴 수 있기 때문입니다.
 * 값을 바꾸면 Supabase 의 column-files 버킷 설정도 함께 바꿔야 합니다.
 */
export const MAX_FILE_UPLOAD_BYTES = 20 * 1024 * 1024;

export const MAX_FILE_UPLOAD_MB = MAX_FILE_UPLOAD_BYTES / (1024 * 1024);

/** 확장자는 파일명이 아니라 이 화이트리스트에서 파생합니다. SVG는 XSS 위험으로 제외. */
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export const COLUMN_IMAGE_BUCKET = 'column-images';

/**
 * 첨부 파일은 이미지와 달리 '확장자' 화이트리스트로 거릅니다.
 *
 * .hwp/.xlsx 같은 형식은 브라우저·OS 마다 MIME 이 제각각이고 application/octet-stream
 * 으로 오는 경우도 흔해서, 이미지처럼 MIME 에서 확장자를 파생하면 정상 파일이 거부됩니다.
 * 대신 저장할 때 클라이언트가 보낸 Content-Type 을 믿지 않고 우리가 고른 값을 쓰며
 * (FILE_CONTENT_TYPES), 링크는 항상 다운로드로 내려보냅니다. 그래서 확장자를 위장한
 * 파일이 올라와도 우리 도메인에서 실행될 수 없습니다.
 */
export const ALLOWED_FILE_EXTENSIONS = [
  'pdf',
  'hwp',
  'hwpx',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'csv',
  'zip',
] as const;

export type AllowedFileExtension = (typeof ALLOWED_FILE_EXTENSIONS)[number];

export function isAllowedFileExtension(value: string): value is AllowedFileExtension {
  return (ALLOWED_FILE_EXTENSIONS as readonly string[]).includes(value);
}

/**
 * 저장 시 쓸 Content-Type. 목록에 없으면 octet-stream 이라 브라우저가 렌더하지 않습니다.
 * PDF 만 제 타입을 주는 이유: 브라우저 내장 뷰어는 샌드박스라 우리 오리진에 접근하지
 * 못하고, 나중에 '미리보기' 링크를 붙일 여지를 남겨둡니다.
 */
export const FILE_CONTENT_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
};

export const COLUMN_FILE_BUCKET = 'column-files';
