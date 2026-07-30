import { Fragment, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import styles from './BlockRenderer.module.css';
import LiteYouTube from '../LiteYouTube';
import type { InlineNode } from '../../../lib/columns/inline';
import type { ColumnBlock } from '../../../lib/columns/types';

const FALLBACK_WIDTH = 1200;
const FALLBACK_HEIGHT = 800;

/**
 * 가로:세로 비율을 CSS 변수로 넘깁니다.
 * 스타일시트가 `max-width: 세로상한 × 비율` 로 환산해, 세로가 상한에 닿는 순간
 * 가로가 더 커지지 않게 만듭니다. 비율을 모르면(옛 글) 제한하지 않습니다.
 */
function aspectRatioStyle(width: number | null, height: number | null): CSSProperties | undefined {
  if (!width || !height) return undefined;
  return { '--column-image-ratio': String(width / height) } as CSSProperties;
}

/**
 * 문단의 인라인 노드를 React 노드로 옮깁니다. 작성자가 넣은 줄바꿈은 hardBreak 노드로
 * 저장되어 있으므로 dangerouslySetInnerHTML 없이 <br> 로 그대로 살아납니다.
 *
 * <strong> 이 아니라 <mark> 를 쓰는 이유: 시각적으로 형광펜 그 자체이고,
 * 스크린리더에 불필요한 강조(emphasis)를 덧붙이지 않습니다.
 */
function renderInlineContent(content: InlineNode[]): ReactNode[] {
  return content.map((node, index) => {
    if (node.type === 'hardBreak') return <br key={index} />;
    if (node.marks?.includes('highlight')) {
      return (
        <mark key={index} className={styles.highlight}>
          {node.text}
        </mark>
      );
    }
    // 문자열에도 key 가 필요합니다 — 배열 자식이므로 Fragment 로 감쌉니다.
    return <Fragment key={index}>{node.text}</Fragment>;
  });
}

interface BlockRendererProps {
  blocks: ColumnBlock[];
  /** 영상 캡션이 없을 때 iframe title 로 쓸 글 제목 */
  columnTitle: string;
}

/**
 * 모든 블록을 React 노드로 렌더합니다 — HTML 을 주입하지 않으므로
 * 관리자가 무엇을 입력하든 XSS 가 구조적으로 불가능합니다.
 *
 * 문단의 하이라이트도 이 원칙을 지킵니다: 저장된 인라인 노드를 보고 텍스트 자식만 가진
 * <mark> 엘리먼트를 만들 뿐이며, 노드 모델은 lib/columns/inline.ts 에 있습니다.
 */
export default function BlockRenderer({ blocks, columnTitle }: BlockRendererProps) {
  return (
    <div className={styles.content}>
      {blocks.map((block) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={block.id} className={styles.paragraph}>
                {renderInlineContent(block.content)}
              </p>
            );

          case 'heading':
            // h1 은 글 제목이 쓰므로 본문 소제목은 h2 입니다.
            return (
              <h2 key={block.id} className={styles.heading}>
                {block.text}
              </h2>
            );

          case 'image':
            return (
              <figure key={block.id} className={styles.figure}>
                <Image
                  src={block.url}
                  alt={block.alt || block.caption || ''}
                  width={block.width ?? FALLBACK_WIDTH}
                  height={block.height ?? FALLBACK_HEIGHT}
                  sizes="(max-width: 800px) 100vw, 760px"
                  className={styles.image}
                  style={aspectRatioStyle(block.width, block.height)}
                />
                {block.caption && <figcaption className={styles.caption}>{block.caption}</figcaption>}
              </figure>
            );

          case 'youtube':
            return (
              <figure key={block.id} className={styles.figure}>
                <LiteYouTube videoId={block.videoId} title={block.caption || columnTitle} />
                {block.caption && <figcaption className={styles.caption}>{block.caption}</figcaption>}
              </figure>
            );
        }
      })}
    </div>
  );
}
