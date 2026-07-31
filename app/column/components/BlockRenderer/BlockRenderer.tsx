import { Fragment, type ReactNode } from 'react';
import Image from 'next/image';
import styles from './BlockRenderer.module.css';
import LiteYouTube from '../LiteYouTube';
import { fileExtensionLabel, formatFileSize } from '../../../lib/columns/file';
import type { InlineNode } from '../../../lib/columns/inline';
import type { ColumnBlock } from '../../../lib/columns/types';

// 비율을 모르는 옛 글에서 next/image 가 자리를 잡을 수 있도록 쓰는 기본값입니다.
// 실제 표시 크기는 CSS 가 정하고(width: 100%), 이 값은 CLS 방지용 자리표시자입니다.
const FALLBACK_WIDTH = 1200;
const FALLBACK_HEIGHT = 800;

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

    // 마크가 겹칠 수 있으므로 안쪽부터 순서를 고정해 감쌉니다 — 같은 입력이 항상 같은
    // DOM 을 만듭니다. 하이라이트를 가장 바깥에 두어 금빛 배경이 굵게·밑줄까지 덮습니다.
    let element: ReactNode = node.text;
    if (node.marks?.includes('underline')) element = <u>{element}</u>;
    if (node.marks?.includes('bold')) element = <strong>{element}</strong>;
    if (node.marks?.includes('highlight')) {
      element = <mark className={styles.highlight}>{element}</mark>;
    }

    // 배열 자식이므로 문자열에도 key 가 필요합니다.
    return <Fragment key={index}>{element}</Fragment>;
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

          case 'file': {
            const size = formatFileSize(block.size);
            return (
              <a
                key={block.id}
                href={block.url}
                className={styles.file}
                // 저장소가 Content-Disposition 을 붙여주지만, 브라우저에도 의도를 알립니다.
                download={block.name}
                rel="noopener noreferrer nofollow"
                aria-label={`${block.name} 내려받기`}
              >
                <span className={styles.fileBadge} aria-hidden="true">
                  {fileExtensionLabel(block.name)}
                </span>
                <span className={styles.fileBody}>
                  <span className={styles.fileName}>{block.name}</span>
                  {size && <span className={styles.fileSize}>{size}</span>}
                </span>
                <span className={styles.fileAction} aria-hidden="true">
                  내려받기
                </span>
              </a>
            );
          }
        }
      })}
    </div>
  );
}
