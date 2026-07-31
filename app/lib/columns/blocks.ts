import { COLUMN_LIMITS } from './constants';
import {
  InlineValidationError,
  inlineToPlainText,
  parseInlineContent,
  validateInlineContent,
} from './inline';
import type { ColumnBlock } from './types';
import { extractYouTubeId, youtubeThumbnailUrl } from '../youtube';

function asString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function asDimension(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.round(value)
    : null;
}

/**
 * jsonb 는 unknown 으로 돌아오므로 읽기 시에도 검증이 필요합니다.
 * 읽기용 — 깨진 항목은 조용히 버리고 나머지는 살립니다. 절대 throw 하지 않습니다.
 */
export function parseBlocks(raw: unknown): ColumnBlock[] {
  if (!Array.isArray(raw)) return [];

  const blocks: ColumnBlock[] = [];

  for (const [index, item] of raw.entries()) {
    if (!item || typeof item !== 'object') continue;
    const candidate = item as Record<string, unknown>;
    const id = typeof candidate.id === 'string' && candidate.id ? candidate.id : `block-${index}`;

    switch (candidate.type) {
      case 'paragraph': {
        // 새 형식은 content 배열, 옛 형식은 text 문자열입니다 (parseInlineContent 가 둘 다 받습니다).
        const content = parseInlineContent(
          candidate.content ?? candidate.text,
          COLUMN_LIMITS.blockText
        );
        if (!inlineToPlainText(content).trim()) continue;
        blocks.push({ id, type: 'paragraph', content });
        break;
      }
      case 'heading': {
        const text = asString(candidate.text, COLUMN_LIMITS.headingText);
        if (!text.trim()) continue;
        blocks.push({ id, type: 'heading', text });
        break;
      }
      case 'image': {
        const url = asString(candidate.url, COLUMN_LIMITS.url);
        if (!url) continue;
        blocks.push({
          id,
          type: 'image',
          url,
          alt: asString(candidate.alt, COLUMN_LIMITS.alt),
          caption: asString(candidate.caption, COLUMN_LIMITS.caption),
          width: asDimension(candidate.width),
          height: asDimension(candidate.height),
        });
        break;
      }
      case 'youtube': {
        const rawUrl = asString(candidate.url, COLUMN_LIMITS.url);
        const videoId =
          (typeof candidate.videoId === 'string' && extractYouTubeId(candidate.videoId)) ||
          extractYouTubeId(rawUrl);
        if (!videoId) continue;
        blocks.push({
          id,
          type: 'youtube',
          videoId,
          url: rawUrl,
          caption: asString(candidate.caption, COLUMN_LIMITS.caption),
        });
        break;
      }
      case 'file': {
        const url = asString(candidate.url, COLUMN_LIMITS.url);
        const name = asString(candidate.name, COLUMN_LIMITS.fileName);
        if (!url || !name) continue;
        blocks.push({ id, type: 'file', url, name, size: asDimension(candidate.size) });
        break;
      }
      default:
        continue;
    }
  }

  return blocks;
}

export class BlockValidationError extends Error {}

/**
 * 쓰기용 — 잘못된 입력은 명확한 한국어 메시지로 throw 합니다.
 * parseBlocks 와 달리 조용히 버리지 않습니다 (관리자가 저장 실패 이유를 알아야 하므로).
 */
export function validateBlocks(raw: unknown): ColumnBlock[] {
  if (!Array.isArray(raw)) {
    throw new BlockValidationError('본문 형식이 올바르지 않습니다.');
  }
  if (raw.length > COLUMN_LIMITS.blocks) {
    throw new BlockValidationError(`본문 블록은 최대 ${COLUMN_LIMITS.blocks}개까지 가능합니다.`);
  }

  // 문단의 인라인 내용은 먼저 엄격히 검증합니다. parseBlocks 는 글자 수 상한을 조용히
  // 잘라내므로, 그대로 두면 문단 뒷부분이 사라진 채 저장이 성공해버립니다.
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const candidate = item as Record<string, unknown>;
    if (candidate.type !== 'paragraph') continue;

    try {
      validateInlineContent(candidate.content ?? candidate.text ?? [], COLUMN_LIMITS.blockText);
    } catch (error) {
      if (error instanceof InlineValidationError) {
        throw new BlockValidationError(error.message);
      }
      throw error;
    }
  }

  const blocks = parseBlocks(raw);

  // parseBlocks 가 걸러낸 게 있으면 비어 있는 블록을 남긴 채 저장하려 한 것입니다.
  if (blocks.length !== raw.length) {
    throw new BlockValidationError(
      '내용이 비어 있거나 형식이 올바르지 않은 블록이 있습니다. 확인 후 다시 저장해주세요.'
    );
  }
  if (blocks.length === 0) {
    throw new BlockValidationError('본문 블록을 최소 1개 이상 추가해주세요.');
  }

  return blocks;
}

/** 검색용 평문. 문단/소제목 텍스트와 이미지·영상 캡션까지 모읍니다. */
export function blocksToPlainText(blocks: ColumnBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'paragraph':
          // 인라인 서식을 벗겨 평문만 남깁니다.
          return inlineToPlainText(block.content);
        case 'heading':
          return block.text;
        case 'image':
          return [block.alt, block.caption].filter(Boolean).join(' ');
        case 'youtube':
          return block.caption;
        case 'file':
          // 첨부 파일명으로도 글을 찾을 수 있게 합니다.
          return block.name;
      }
    })
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 요약을 비워둔 경우 첫 문단에서 자동 생성합니다. */
export function buildExcerpt(blocks: ColumnBlock[], max = 160): string {
  const firstParagraph = blocks.find((block) => block.type === 'paragraph');
  const source = firstParagraph
    ? inlineToPlainText(firstParagraph.content)
    : blocksToPlainText(blocks);
  const normalized = source.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max).trimEnd()}…`;
}

/**
 * 대표 이미지를 지정하지 않았을 때 대신 쓸 이미지.
 * 본문을 위에서부터 훑어 처음 만나는 이미지 또는 유튜브 썸네일을 돌려줍니다.
 *
 * 유튜브는 maxresdefault 가 옛 영상에서 404 가 날 수 있는데, 목록 썸네일과
 * og:image 에는 화면상의 onError 폴백을 걸 수 없으므로 항상 존재하는
 * hqdefault 를 씁니다.
 */
export function firstMediaImageUrl(blocks: ColumnBlock[]): string | null {
  for (const block of blocks) {
    if (block.type === 'image' && block.url) return block.url;
    if (block.type === 'youtube' && block.videoId) {
      return youtubeThumbnailUrl(block.videoId, 'hq');
    }
  }
  return null;
}

/** 대표 이미지가 없으면 본문에서 유추합니다. 목록 썸네일과 og:image 가 같은 값을 씁니다. */
export function resolveCoverUrl(
  thumbnailUrl: string | null,
  blocks: ColumnBlock[]
): string | null {
  return thumbnailUrl || firstMediaImageUrl(blocks);
}

/** insert/update 시 search_text 컬럼에 저장할 값. */
export function buildSearchText(
  title: string,
  excerpt: string,
  blocks: ColumnBlock[]
): string {
  return [title, excerpt, blocksToPlainText(blocks)]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
