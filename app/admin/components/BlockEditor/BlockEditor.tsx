'use client';

import styles from './BlockEditor.module.css';
import BlockEditorItem from '../BlockEditorItem';
import { inlineToPlainText } from '../../../lib/columns/inline';
import type { ColumnBlock, ColumnBlockType } from '../../../lib/columns/types';

const ADD_BUTTONS: { type: ColumnBlockType; label: string }[] = [
  { type: 'paragraph', label: '+ 문단' },
  { type: 'heading', label: '+ 소제목' },
  { type: 'image', label: '+ 이미지' },
  { type: 'youtube', label: '+ 유튜브' },
  { type: 'file', label: '+ 파일' },
];

function createBlock(type: ColumnBlockType): ColumnBlock {
  const id = crypto.randomUUID();
  switch (type) {
    case 'paragraph':
      return { id, type: 'paragraph', content: [] };
    case 'heading':
      return { id, type: 'heading', text: '' };
    case 'image':
      return { id, type: 'image', url: '', alt: '', caption: '', width: null, height: null };
    case 'youtube':
      return { id, type: 'youtube', videoId: '', url: '', caption: '' };
    case 'file':
      return { id, type: 'file', url: '', name: '', size: null };
  }
}

/** 블록에 사용자가 입력한 내용이 있는지 — 삭제 시 확인 여부를 정합니다. */
function hasContent(block: ColumnBlock): boolean {
  switch (block.type) {
    case 'paragraph':
      return inlineToPlainText(block.content).trim().length > 0;
    case 'heading':
      return block.text.trim().length > 0;
    case 'image':
      return Boolean(block.url);
    case 'youtube':
      return Boolean(block.url.trim());
    case 'file':
      return Boolean(block.url);
  }
}

interface BlockEditorProps {
  blocks: ColumnBlock[];
  onChange: (blocks: ColumnBlock[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const addBlock = (type: ColumnBlockType) => {
    onChange([...blocks, createBlock(type)]);
  };

  const updateBlock = (id: string, patch: Partial<ColumnBlock>) => {
    onChange(
      blocks.map((block) => (block.id === id ? ({ ...block, ...patch } as ColumnBlock) : block))
    );
  };

  const moveBlock = (id: string, direction: -1 | 1) => {
    const index = blocks.findIndex((block) => block.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= blocks.length) return;

    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const removeBlock = (id: string) => {
    const block = blocks.find((item) => item.id === id);
    if (block && hasContent(block) && !window.confirm('이 블록을 삭제할까요?')) return;
    onChange(blocks.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.editor}>
      {blocks.length === 0 ? (
        <p className={styles.empty}>
          아래 버튼으로 본문 블록을 추가하세요. 순서는 언제든 ↑ ↓ 로 바꿀 수 있습니다.
        </p>
      ) : (
        <div className={styles.list}>
          {blocks.map((block, index) => (
            <BlockEditorItem
              key={block.id}
              block={block}
              index={index}
              total={blocks.length}
              onChange={updateBlock}
              onMove={moveBlock}
              onRemove={removeBlock}
            />
          ))}
        </div>
      )}

      <div className={styles.addBar}>
        {ADD_BUTTONS.map((button) => (
          <button
            key={button.type}
            type="button"
            className={styles.addButton}
            onClick={() => addBlock(button.type)}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
