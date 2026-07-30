'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Highlight from '@tiptap/extension-highlight';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import { CharacterCount } from '@tiptap/extensions/character-count';
import { Placeholder } from '@tiptap/extensions/placeholder';
import { UndoRedo } from '@tiptap/extensions/undo-redo';
import styles from './ParagraphEditor.module.css';
import { COLUMN_LIMITS } from '../../../lib/columns/constants';
import {
  INLINE_MARKS,
  inlineToPlainText,
  normalizeInlineContent,
  type InlineMark,
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

    // INLINE_MARKS 에 있는 것만, 항상 같은 순서로 담습니다 — 저장 형식이 안정적으로
    // 유지되고 normalizeInlineContent 가 인접 노드를 제대로 병합할 수 있습니다.
    const marks = INLINE_MARKS.filter((name) =>
      node.marks?.some((mark) => mark.type === name)
    ) as InlineMark[];

    content.push(
      marks.length > 0
        ? { type: 'text', text: node.text, marks }
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
                ...(node.marks && node.marks.length > 0
                  ? { marks: node.marks.map((name) => ({ type: name })) }
                  : {}),
              }
        ),
      },
    ],
  };
}

/**
 * 툴바 버튼. 단축키는 각 익스텐션에 이미 들어 있어 여기서는 안내만 합니다
 * (Highlight: Mod-Shift-h, Bold: Mod-b, Underline: Mod-u).
 * previewClass 는 버튼 라벨 자체를 그 서식으로 보여주기 위한 것입니다.
 */
const MARK_BUTTONS: {
  mark: InlineMark;
  label: string;
  title: string;
  shortcutLabel: string;
  ariaKeyshortcuts: string;
  previewClass: 'labelHighlight' | 'labelBold' | 'labelUnderline';
}[] = [
  {
    mark: 'highlight',
    label: '하이라이트',
    title: '선택한 글자에 금빛 강조, 또는 켠 뒤 이어서 입력',
    shortcutLabel: '⌘/Ctrl+Shift+H',
    ariaKeyshortcuts: 'Meta+Shift+H Control+Shift+H',
    previewClass: 'labelHighlight',
  },
  {
    mark: 'bold',
    label: '굵게',
    title: '선택한 글자를 굵게, 또는 켠 뒤 이어서 입력',
    shortcutLabel: '⌘/Ctrl+B',
    ariaKeyshortcuts: 'Meta+B Control+B',
    previewClass: 'labelBold',
  },
  {
    mark: 'underline',
    label: '밑줄',
    title: '선택한 글자에 밑줄, 또는 켠 뒤 이어서 입력',
    shortcutLabel: '⌘/Ctrl+U',
    ariaKeyshortcuts: 'Meta+U Control+U',
    previewClass: 'labelUnderline',
  },
];

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
      Bold,
      Underline,
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

  /**
   * useEditor 는 기본적으로 트랜잭션마다 리렌더하지 않습니다(shouldRerenderOnTransaction: false).
   * 커서만 둔 채 하이라이트를 켜면 문서는 그대로고 storedMarks 만 바뀌는 트랜잭션이라
   * onUpdate 도 불리지 않아, 글을 입력해 문서가 바뀔 때까지 버튼이 갱신되지 않았습니다.
   * useEditorState 로 툴바가 쓰는 값만 구독하면 켠 즉시·끈 즉시 반영되고,
   * 리렌더는 그 값이 실제로 달라질 때만 일어납니다(기본 비교는 deep equal).
   */
  const toolbar = useEditorState({
    editor,
    selector: ({ editor }) => ({
      active: MARK_BUTTONS.map(({ mark }) => editor?.isActive(mark) ?? false),
      characters: editor?.storage.characterCount.characters() ?? 0,
    }),
  });
  const characters = toolbar?.characters ?? 0;

  return (
    <div className={styles.field}>
      <div className={styles.toolbar}>
        <div className={styles.markButtons}>
          {MARK_BUTTONS.map((button, index) => {
            const isActive = toolbar?.active[index] ?? false;
            return (
              <button
                key={button.mark}
                type="button"
                className={`${styles.markButton} ${isActive ? styles.markButtonActive : ''}`}
                // 버튼을 눌러도 편집기가 포커스를 잃지 않게 합니다 — 켜자마자 바로 이어서 입력됩니다.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => editor?.chain().focus().toggleMark(button.mark).run()}
                disabled={!editor}
                aria-pressed={isActive}
                title={`${button.title} (${button.shortcutLabel})`}
                aria-keyshortcuts={button.ariaKeyshortcuts}
              >
                {button.mark === 'highlight' && (
                  <span aria-hidden="true" className={styles.markSwatch} />
                )}
                <span className={styles[button.previewClass]}>{button.label}</span>
              </button>
            );
          })}
        </div>
        <span className={styles.counter}>
          {characters.toLocaleString('ko-KR')} / {COLUMN_LIMITS.blockText.toLocaleString('ko-KR')}자
        </span>
      </div>

      <EditorContent editor={editor} className={styles.editor} />
    </div>
  );
}
