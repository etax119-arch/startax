import type { ColumnCategory } from './constants';

/** 블록 공통 필드. id는 클라이언트가 crypto.randomUUID()로 생성 — React key + 순서 이동 식별자. */
interface BlockBase {
  id: string;
}

export interface ParagraphBlock extends BlockBase {
  type: 'paragraph';
  text: string;
}

export interface HeadingBlock extends BlockBase {
  type: 'heading';
  text: string;
}

export interface ImageBlock extends BlockBase {
  type: 'image';
  /** Supabase Storage 공개 URL */
  url: string;
  alt: string;
  caption: string;
  /** 업로드 시 클라이언트가 측정한 자연 크기. CLS 방지용이며 없으면 폴백 비율을 씁니다. */
  width: number | null;
  height: number | null;
}

export interface YoutubeBlock extends BlockBase {
  type: 'youtube';
  /** 정규화된 11자 영상 ID */
  videoId: string;
  /** 사용자가 붙여넣은 원본 URL (수정 화면에서 그대로 보여주기 위해 보관) */
  url: string;
  caption: string;
}

export type ColumnBlock = ParagraphBlock | HeadingBlock | ImageBlock | YoutubeBlock;
export type ColumnBlockType = ColumnBlock['type'];

export interface ColumnRow {
  id: string;
  slug: string;
  title: string;
  category: ColumnCategory;
  excerpt: string;
  thumbnail_url: string | null;
  blocks: ColumnBlock[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** 목록 화면 전용. blocks 는 절대 select 하지 않습니다. */
export type ColumnListItem = Pick<
  ColumnRow,
  'id' | 'slug' | 'title' | 'category' | 'excerpt' | 'thumbnail_url' | 'published_at' | 'created_at'
>;

/** 관리자 목록은 미발행 글도 보여주므로 published 상태가 필요합니다. */
export type AdminColumnListItem = ColumnListItem & Pick<ColumnRow, 'published' | 'updated_at'>;

/** 생성/수정 엔드포인트가 받는 입력 형태. */
export interface ColumnInput {
  slug: string;
  title: string;
  category: ColumnCategory;
  excerpt: string;
  thumbnailUrl: string | null;
  blocks: ColumnBlock[];
  published: boolean;
}
