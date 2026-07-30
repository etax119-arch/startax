/**
 * 문단(paragraph) 블록의 인라인 내용 모델.
 *
 * 문단은 평문 문자열이 아니라 인라인 노드 배열로 저장합니다. 편집기(TipTap)와 공개
 * 렌더러가 같은 표현을 쓰므로 `==` 같은 마커가 본문에 노출되지 않고, 편집 화면에서
 * 바로 강조된 모습으로 글을 쓸 수 있습니다.
 *
 *   [
 *     { type: 'text', text: '병의원 개원 초기에는 ' },
 *     { type: 'text', text: '절세 계획', marks: ['highlight'] },
 *     { type: 'text', text: '이 중요합니다.' },
 *     { type: 'hardBreak' },
 *     { type: 'text', text: '다음 줄입니다.' },
 *   ]
 *
 * 이 표현은 TipTap/ProseMirror 의 인라인 JSON 과 거의 같지만, 저장 형식은 우리가
 * 통제합니다 — marks 를 문자열 배열로 좁혀두어 알 수 없는 마크나 속성이 DB 에
 * 들어올 수 없습니다. HTML 을 저장하지 않으므로 렌더러는 여전히 React 엘리먼트만
 * 만들고(BlockRenderer), sanitizer 없이 XSS 가 구조적으로 불가능합니다.
 *
 * 하위 호환: 이전에는 문단이 `text: string` 이었습니다. parseBlocks 가 읽을 때
 * inlineFromPlainText 로 변환하므로 DB 백필이 필요 없고, 옛 글은 저장 형식이
 * 그대로 남아 있어도 정상 동작합니다.
 */

/** 지금은 하이라이트 하나뿐입니다. 굵게·링크를 추가할 때 여기에 더하면 됩니다. */
export const INLINE_MARKS = ['highlight'] as const;
export type InlineMark = (typeof INLINE_MARKS)[number];

export interface InlineTextNode {
  type: 'text';
  text: string;
  /** 없거나 빈 배열이면 서식 없는 평문입니다. */
  marks?: InlineMark[];
}

export interface InlineBreakNode {
  type: 'hardBreak';
}

export type InlineNode = InlineTextNode | InlineBreakNode;

/** 문단 하나가 가질 수 있는 인라인 노드 수 상한. 병적으로 큰 jsonb 를 막습니다. */
export const MAX_INLINE_NODES = 2000;

function isInlineMark(value: unknown): value is InlineMark {
  return typeof value === 'string' && (INLINE_MARKS as readonly string[]).includes(value);
}

/** 검색·요약·og:description 에 쓰는 평문. 줄바꿈은 \n 으로 되돌립니다. */
export function inlineToPlainText(content: InlineNode[]): string {
  return content.map((node) => (node.type === 'hardBreak' ? '\n' : node.text)).join('');
}

/** 옛 문단(`text: string`)을 인라인 노드로. 줄바꿈은 hardBreak 노드가 됩니다. */
export function inlineFromPlainText(text: string): InlineNode[] {
  const content: InlineNode[] = [];

  text.split('\n').forEach((line, index) => {
    if (index > 0) content.push({ type: 'hardBreak' });
    if (line) content.push({ type: 'text', text: line });
  });

  return content;
}

/**
 * jsonb 는 unknown 으로 돌아오므로 읽기 시에도 검증합니다.
 * 읽기용 — 깨진 노드는 조용히 버리고 나머지를 살립니다. 절대 throw 하지 않습니다.
 * 옛 형식(문자열)과 새 형식(배열)을 모두 받습니다.
 */
export function parseInlineContent(raw: unknown, maxTextLength: number): InlineNode[] {
  if (typeof raw === 'string') return inlineFromPlainText(raw.slice(0, maxTextLength));
  if (!Array.isArray(raw)) return [];

  const content: InlineNode[] = [];
  let textLength = 0;

  for (const item of raw.slice(0, MAX_INLINE_NODES)) {
    if (!item || typeof item !== 'object') continue;
    const candidate = item as Record<string, unknown>;

    if (candidate.type === 'hardBreak') {
      if (textLength >= maxTextLength) continue;
      textLength += 1;
      content.push({ type: 'hardBreak' });
      continue;
    }

    if (candidate.type !== 'text' || typeof candidate.text !== 'string') continue;

    const text = candidate.text.slice(0, maxTextLength - textLength);
    if (!text) continue;
    textLength += text.length;

    const marks = Array.isArray(candidate.marks) ? candidate.marks.filter(isInlineMark) : [];
    content.push(marks.length > 0 ? { type: 'text', text, marks } : { type: 'text', text });
  }

  return normalizeInlineContent(content);
}

/**
 * 같은 서식을 가진 인접 텍스트 노드를 합치고, 앞뒤의 의미 없는 줄바꿈을 걷어냅니다.
 * 편집기가 만드는 조각난 노드를 정리해 저장 형식이 안정적으로 유지됩니다.
 */
export function normalizeInlineContent(content: InlineNode[]): InlineNode[] {
  const merged: InlineNode[] = [];

  for (const node of content) {
    const previous = merged[merged.length - 1];

    if (
      node.type === 'text' &&
      previous?.type === 'text' &&
      markKey(previous.marks) === markKey(node.marks)
    ) {
      merged[merged.length - 1] = { ...previous, text: previous.text + node.text };
      continue;
    }
    if (node.type === 'text' && !node.text) continue;

    merged.push(node);
  }

  // 문단 앞뒤의 빈 줄은 여백으로만 보이고 평문에도 섞이므로 버립니다.
  while (merged[0]?.type === 'hardBreak') merged.shift();
  while (merged[merged.length - 1]?.type === 'hardBreak') merged.pop();

  return merged;
}

function markKey(marks: InlineMark[] | undefined): string {
  return marks && marks.length > 0 ? [...marks].sort().join(',') : '';
}

export class InlineValidationError extends Error {}

/**
 * 쓰기용 — 잘못된 입력은 명확한 한국어 메시지로 throw 합니다.
 * parseInlineContent 와 달리 조용히 버리지 않습니다(관리자가 실패 이유를 알아야 하므로).
 */
export function validateInlineContent(raw: unknown, maxTextLength: number): InlineNode[] {
  if (typeof raw === 'string') {
    // 옛 형식으로 저장을 시도하는 경로는 없어야 하지만, 있어도 손실 없이 받아줍니다.
    if (raw.length > maxTextLength) {
      throw new InlineValidationError(`문단은 최대 ${maxTextLength}자까지 입력할 수 있습니다.`);
    }
    return inlineFromPlainText(raw);
  }
  if (!Array.isArray(raw)) {
    throw new InlineValidationError('문단 형식이 올바르지 않습니다.');
  }
  if (raw.length > MAX_INLINE_NODES) {
    throw new InlineValidationError('문단이 너무 잘게 쪼개져 있습니다. 문단을 나눠주세요.');
  }

  const content: InlineNode[] = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') {
      throw new InlineValidationError('문단 형식이 올바르지 않습니다.');
    }
    const candidate = item as Record<string, unknown>;

    if (candidate.type === 'hardBreak') {
      content.push({ type: 'hardBreak' });
      continue;
    }
    if (candidate.type !== 'text' || typeof candidate.text !== 'string') {
      throw new InlineValidationError('문단 형식이 올바르지 않습니다.');
    }

    const rawMarks = candidate.marks === undefined ? [] : candidate.marks;
    if (!Array.isArray(rawMarks) || !rawMarks.every(isInlineMark)) {
      throw new InlineValidationError('문단에 지원하지 않는 서식이 있습니다.');
    }

    const marks = rawMarks as InlineMark[];
    content.push(
      marks.length > 0 ? { type: 'text', text: candidate.text, marks } : { type: 'text', text: candidate.text }
    );
  }

  const normalized = normalizeInlineContent(content);
  if (inlineToPlainText(normalized).length > maxTextLength) {
    throw new InlineValidationError(`문단은 최대 ${maxTextLength}자까지 입력할 수 있습니다.`);
  }

  return normalized;
}
