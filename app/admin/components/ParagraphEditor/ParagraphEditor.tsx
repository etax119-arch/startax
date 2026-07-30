'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Highlight from '@tiptap/extension-highlight';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { CharacterCount } from '@tiptap/extensions/character-count';
import { Placeholder } from '@tiptap/extensions/placeholder';
import { UndoRedo } from '@tiptap/extensions/undo-redo';
import styles from './ParagraphEditor.module.css';
import { COLUMN_LIMITS } from '../../../lib/columns/constants';
import {
  inlineToPlainText,
  normalizeInlineContent,
  type InlineNode,
} from '../../../lib/columns/inline';

/**
 * 문단 편집기. 하이라이트를 켜고 글을 쓰면 그 자리부터 금빛으로 강조되며 입력됩니다
 * (ProseMirror 의 storedMarks 동작).
 *
 * 스키마를 의도적으로 최소한으로 잠갔습니다 — 문단 하나, 텍스트, 줄바꿈, highlight
 * 마크뿐입니다. 편집기가 그 밖의 무엇도 만들 수 없으므로 저장 형식이 예측 가능하고,
 * 붙여넣기로 들어온 서식·태그는 자동으로 버려집니다.
 */

/** doc 이 문단 하나만 담도록 제한합니다. 블록 추가/분할은 BlockEditor 가 담당합니다. */
const SingleParagraphDocument = Document.extend({ content: 'paragraph' });

/**
 * doc 을 쪼갤 수 없으니 Enter 는 줄바꿈으로 씁니다.
 * 기존 편집기의 "줄바꿈은 그대로 유지됩니다" 동작을 이어받습니다.
 */
const EnterAsHardBreak = HardBreak.extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Enter: () => this.editor.commands.setHardBreak(),
    };
  },
});

/**
 * getJSON() 의 노드 타입은 스키마에 따라 넓은 유니온이라 좁히기가 번거롭습니다.
 * 어차피 필드를 하나씩 확인하며 옮기므로 필요한 모양만 지역 타입으로 선언합니다.
 */
interface ProseMirrorInlineNode {
  type?: string;
  text?: string;
  marks?: { type?: string }[];
}

/** ProseMirror JSON → 저장 형식. 알 수 없는 노드·마크는 여기서 걸러집니다. */
function toInlineContent(editor: Editor): InlineNode[] {
  const paragraph = editor.getJSON().content?.[0];
  const nodes = (paragraph?.content ?? []) as ProseMirrorInlineNode[];
  const content: InlineNode[] = [];

  for (const node of nodes) {
    if (node.type === 'hardBreak') {
      content.push({ type: 'hardBreak' });
      continue;
    }
    if (node.type !== 'text' || typeof node.text !== 'string') continue;

    const highlighted = node.marks?.some((mark) => mark.type === 'highlight');
    content.push(
      highlighted
        ? { type: 'text', text: node.text, marks: ['highlight'] }
        : { type: 'text', text: node.text }
    );
  }

  return normalizeInlineContent(content);
}

/** 저장 형식 → ProseMirror JSON. */
function toProseMirrorDoc(content: InlineNode[]) {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: content.map((node) =>
          node.type === 'hardBreak'
            ? { type: 'hardBreak' }
            : {
                type: 'text',
                text: node.text,
                ...(node.marks?.includes('highlight')
                  ? { marks: [{ type: 'highlight' }] }
                  : {}),
              }
        ),
      },
    ],
  };
}

interface ParagraphEditorProps {
  content: InlineNode[];
  onChange: (content: InlineNode[]) => void;
}

export default function ParagraphEditor({ content, onChange }: ParagraphEditorProps) {
  const editor = useEditor({
    extensions: [
      SingleParagraphDocument,
      Paragraph,
      Text,
      EnterAsHardBreak,
      Highlight,
      UndoRedo,
      Placeholder.configure({
        placeholder: '본문 내용을 입력하세요. 줄바꿈은 그대로 유지됩니다.',
      }),
      CharacterCount.configure({ limit: COLUMN_LIMITS.blockText }),
    ],
    content: toProseMirrorDoc(content),
    // Next 는 클라이언트 컴포넌트도 서버에서 렌더하므로 즉시 렌더하면 hydration 이 어긋납니다.
    immediatelyRender: false,
    editorProps: { attributes: { class: styles.surface } },
    onUpdate: ({ editor }) => onChange(toInlineContent(editor)),
  });

  // 블록 순서를 바꾸면 같은 컴포넌트가 다른 문단을 받습니다. 편집기 내용과 어긋나면 맞춰줍니다.
  // (편집 중 자기 onUpdate 로 되돌아온 값에는 반응하지 않도록 평문을 비교합니다.)
  useEffect(() => {
    if (!editor) return;
    const incoming = inlineToPlainText(content);
    if (incoming === editor.getText()) return;
    editor.commands.setContent(toProseMirrorDoc(content), { emitUpdate: false });
  }, [editor, content]);

  const characters = editor?.storage.characterCount.characters() ?? 0;
  const isHighlightActive = editor?.isActive('highlight') ?? false;

  return (
    <div className={styles.field}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={`${styles.markButton} ${isHighlightActive ? styles.markButtonActive : ''}`}
          onClick={() => editor?.chain().focus().toggleHighlight().run()}
          disabled={!editor}
          aria-pressed={isHighlightActive}
          title="선택한 글자에 금빛 강조, 또는 켠 뒤 이어서 입력 (⌘/Ctrl+Shift+H)"
          aria-keyshortcuts="Meta+Shift+H Control+Shift+H"
        >
          <span aria-hidden="true" className={styles.markSwatch} />
          하이라이트
        </button>
        <span className={styles.counter}>
          {characters.toLocaleString('ko-KR')} / {COLUMN_LIMITS.blockText.toLocaleString('ko-KR')}자
        </span>
      </div>

      <EditorContent editor={editor} className={styles.editor} />
    </div>
  );
}
