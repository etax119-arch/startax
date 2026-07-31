'use client';

import { useEffect, useRef } from 'react';
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Highlight from '@tiptap/extension-highlight';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import {
  Fragment,
  Slice,
  type Node as ProseMirrorNode,
  type Schema,
} from '@tiptap/pm/model';
import { CharacterCount } from '@tiptap/extensions/character-count';
import { Placeholder } from '@tiptap/extensions/placeholder';
import { UndoRedo } from '@tiptap/extensions/undo-redo';
import styles from './ParagraphEditor.module.css';
import { COLUMN_LIMITS } from '../../../lib/columns/constants';
import {
  INLINE_MARKS,
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
  // TipTap 기본 Keymap 의 Enter(splitBlock 등)보다 먼저 잡습니다. 우리 스키마에서는
  // 그 명령들이 모두 실패해 결국 여기로 넘어오지만, 순서를 명시해 두는 편이 안전합니다.
  priority: 1000,
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

/**
 * 붙여넣은 내용을 인라인으로 눕힙니다.
 *
 * 문단 블록의 doc 은 단락을 딱 하나만 담습니다(content: 'paragraph'). 그런데
 * ProseMirror 의 기본 붙여넣기는 평문을 줄 단위로 잘라 각각 <p> 로 감싸므로,
 * 여러 줄을 붙여넣으면 두 번째 줄부터 스키마에 맞지 않아 조용히 버려집니다.
 * 단락 경계를 hardBreak 으로 바꿔 모든 줄을 살립니다.
 *
 * 알려진 한계: 연속된 빈 줄은 하나의 줄바꿈으로 합쳐집니다
 * (ProseMirror 의 평문 분해가 연속 개행을 이미 하나로 합칩니다).
 */
function flattenPastedSlice(slice: Slice, schema: Schema): Slice {
  const nodes: ProseMirrorNode[] = [];
  let pendingBreak = false;

  const pushInline = (node: ProseMirrorNode) => {
    if (pendingBreak) {
      nodes.push(schema.nodes.hardBreak.create());
      pendingBreak = false;
    }
    nodes.push(node);
  };

  slice.content.descendants((node) => {
    if (node.isInline) {
      pushInline(node);
      return false;
    }
    if (node.isTextblock) {
      // 첫 단락 앞에는 줄바꿈을 넣지 않습니다.
      if (nodes.length > 0) pendingBreak = true;
      node.content.forEach(pushInline);
      return false;
    }
    return true;
  });

  // 인라인만 남았으므로 커서 위치에 그대로 끼워 넣습니다.
  return new Slice(Fragment.from(nodes), 0, 0);
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
  /** 마지막으로 우리가 위로 올려보낸 배열. 되돌아온 값을 참조만으로 알아보려고 씁니다. */
  const lastEmitted = useRef<InlineNode[] | null>(null);

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
    editorProps: {
      attributes: { class: styles.surface },
      transformPasted: (slice, view) => flattenPastedSlice(slice, view.state.schema),
    },
    onUpdate: ({ editor }) => {
      const next = toInlineContent(editor);
      lastEmitted.current = next;
      onChange(next);
    },
  });

  // 밖에서 들어온 문단이 편집기 내용과 어긋날 때만 맞춰줍니다.
  //
  // 비교에 editor.getText() 를 쓰면 안 됩니다 — ProseMirror 의 텍스트 직렬화는
  // 블록 노드에만 구분자를 넣고 hardBreak 같은 인라인 leaf 는 아무것도 만들지 않아,
  // 줄바꿈이 하나라도 있으면 저장 형식의 '\n' 과 영원히 달라집니다. 그러면 매 렌더마다
  // setContent 가 돌아 방금 누른 Enter 와 커서 위치가 지워집니다.
  useEffect(() => {
    if (!editor) return;
    // 타이핑으로 우리가 올려보낸 배열이 그대로 돌아온 경우 — 참조만 보고 끝냅니다.
    if (content === lastEmitted.current) return;
    // 참조가 다르더라도 내용이 같으면 편집기를 다시 세우지 않습니다. 같은 직렬화
    // 함수로 만든 값끼리 비교해야 위 함정에 다시 빠지지 않습니다.
    if (JSON.stringify(toInlineContent(editor)) === JSON.stringify(content)) return;
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
