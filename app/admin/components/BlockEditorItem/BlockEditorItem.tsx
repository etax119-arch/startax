'use client';

import Image from 'next/image';
import styles from './BlockEditorItem.module.css';
import ImageUploadField from '../ImageUploadField';
import { COLUMN_LIMITS } from '../../../lib/columns/constants';
import type { ColumnBlock, YoutubeBlock } from '../../../lib/columns/types';
import { extractYouTubeId, youtubeThumbnailUrl } from '../../../lib/youtube';

const BLOCK_LABELS: Record<ColumnBlock['type'], string> = {
  paragraph: '문단',
  heading: '소제목',
  image: '이미지',
  youtube: '유튜브',
};

interface BlockEditorItemProps {
  block: ColumnBlock;
  index: number;
  total: number;
  onChange: (id: string, patch: Partial<ColumnBlock>) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
}

export default function BlockEditorItem({
  block,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: BlockEditorItemProps) {
  const patch = (values: Partial<ColumnBlock>) => onChange(block.id, values);

  return (
    <div className={styles.item}>
      <div className={styles.toolbar}>
        <span className={styles.badge}>
          {index + 1}. {BLOCK_LABELS[block.type]}
        </span>
        <div className={styles.toolbarActions}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => onMove(block.id, -1)}
            disabled={index === 0}
            aria-label="위로 이동"
          >
            ↑
          </button>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => onMove(block.id, 1)}
            disabled={index === total - 1}
            aria-label="아래로 이동"
          >
            ↓
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.removeButton}`}
            onClick={() => onRemove(block.id)}
            aria-label="블록 삭제"
          >
            ✕
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {block.type === 'paragraph' && (
          <textarea
            value={block.text}
            onChange={(event) => patch({ text: event.target.value })}
            placeholder="본문 내용을 입력하세요. 줄바꿈은 그대로 유지됩니다."
            maxLength={COLUMN_LIMITS.blockText}
            className={styles.textarea}
          />
        )}

        {block.type === 'heading' && (
          <input
            type="text"
            value={block.text}
            onChange={(event) => patch({ text: event.target.value })}
            placeholder="소제목"
            maxLength={COLUMN_LIMITS.headingText}
            className={styles.input}
          />
        )}

        {block.type === 'image' && (
          <div className={styles.grid}>
            <ImageUploadField
              label="이미지"
              value={block.url || null}
              onChange={(uploaded) =>
                patch({
                  url: uploaded?.url ?? '',
                  width: uploaded?.width ?? null,
                  height: uploaded?.height ?? null,
                })
              }
            />
            <div className={styles.fields}>
              <div className={styles.formGroup}>
                <label className={styles.label}>설명 (대체 텍스트)</label>
                <input
                  type="text"
                  value={block.alt}
                  onChange={(event) => patch({ alt: event.target.value })}
                  placeholder="이미지 내용을 설명하는 문구"
                  maxLength={COLUMN_LIMITS.alt}
                  className={styles.input}
                />
                <p className={styles.hint}>
                  화면에는 보이지 않지만 검색엔진과 스크린리더가 읽습니다.
                </p>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>캡션 (선택)</label>
                <input
                  type="text"
                  value={block.caption}
                  onChange={(event) => patch({ caption: event.target.value })}
                  placeholder="이미지 아래에 표시할 문구"
                  maxLength={COLUMN_LIMITS.caption}
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        )}

        {block.type === 'youtube' && (
          <YoutubeFields block={block} patch={patch} />
        )}
      </div>
    </div>
  );
}

function YoutubeFields({
  block,
  patch,
}: {
  block: YoutubeBlock;
  patch: (values: Partial<ColumnBlock>) => void;
}) {
  const hasUrl = block.url.trim().length > 0;

  return (
    <div className={styles.grid}>
      <div className={styles.thumbSlot}>
        {block.videoId ? (
          <div className={styles.thumb}>
            <Image
              src={youtubeThumbnailUrl(block.videoId, 'hq')}
              alt=""
              fill
              sizes="240px"
              className={styles.thumbImage}
            />
          </div>
        ) : (
          <div className={styles.thumbEmpty}>썸네일 미리보기</div>
        )}
      </div>

      <div className={styles.fields}>
        <div className={styles.formGroup}>
          <label className={styles.label}>유튜브 링크</label>
          <input
            type="url"
            value={block.url}
            onChange={(event) => {
              const url = event.target.value;
              patch({ url, videoId: extractYouTubeId(url) ?? '' });
            }}
            placeholder="https://youtu.be/..."
            maxLength={COLUMN_LIMITS.url}
            className={styles.input}
          />
          {hasUrl && !block.videoId ? (
            <p className={styles.error}>유튜브 영상 주소를 인식하지 못했습니다.</p>
          ) : (
            <p className={styles.hint}>
              youtu.be, watch?v=, shorts, embed 형태 모두 인식합니다.
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>캡션 (선택)</label>
          <input
            type="text"
            value={block.caption}
            onChange={(event) => patch({ caption: event.target.value })}
            placeholder="영상 아래에 표시할 문구"
            maxLength={COLUMN_LIMITS.caption}
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
}
