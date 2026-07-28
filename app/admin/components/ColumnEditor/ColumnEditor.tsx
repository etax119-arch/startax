'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './ColumnEditor.module.css';
import BlockEditor from '../BlockEditor';
import ImageUploadField from '../ImageUploadField';
import {
  COLUMN_CATEGORIES,
  COLUMN_LIMITS,
  type ColumnCategory,
} from '../../../lib/columns/constants';
import { slugify } from '../../../lib/columns/slug';
import { requestJson } from '../../../lib/http';
import type { ColumnBlock, ColumnRow } from '../../../lib/columns/types';

interface ColumnEditorProps {
  /** 수정 모드일 때만 전달됩니다. */
  column?: ColumnRow;
}

export default function ColumnEditor({ column }: ColumnEditorProps) {
  const router = useRouter();
  const isEdit = Boolean(column);

  const [title, setTitle] = useState(column?.title ?? '');
  const [slug, setSlug] = useState(column?.slug ?? '');
  // 수정 모드에서는 기존 slug 를 보존하고, 새 글에서만 제목을 따라가게 합니다.
  const [isSlugTouched, setIsSlugTouched] = useState(isEdit);
  const [category, setCategory] = useState<ColumnCategory>(column?.category ?? COLUMN_CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState(column?.excerpt ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(column?.thumbnail_url ?? null);
  const [blocks, setBlocks] = useState<ColumnBlock[]>(column?.blocks ?? []);
  const [published, setPublished] = useState(column?.published ?? false);

  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const effectiveSlug = isSlugTouched ? slug : slugify(title);

  // 긴 글을 실수로 날리는 게 이 화면에서 가장 뼈아픈 실패라 이탈을 막습니다.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const markDirty = () => setIsDirty(true);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    const result = await requestJson(
      isEdit ? `/api/admin/columns/${column!.id}` : '/api/admin/columns',
      {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: effectiveSlug,
          category,
          excerpt,
          thumbnailUrl,
          blocks,
          published,
        }),
      },
      '저장에 실패했습니다.'
    );

    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsDirty(false);
    router.push('/admin/columns');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>{isEdit ? '칼럼 수정' : '새 칼럼 작성'}</h1>
        <Link href="/admin/columns" className={styles.secondaryButton}>
          목록으로
        </Link>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>기본 정보</h2>

        <div className={styles.formGroup}>
          <label htmlFor="column-title" className={styles.label}>
            제목 <span className={styles.required}>*</span>
          </label>
          <input
            id="column-title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              markDirty();
            }}
            maxLength={COLUMN_LIMITS.title}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="column-category" className={styles.label}>
              카테고리 <span className={styles.required}>*</span>
            </label>
            <select
              id="column-category"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value as ColumnCategory);
                markDirty();
              }}
              className={styles.select}
            >
              {COLUMN_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="column-slug" className={styles.label}>
              URL 주소
            </label>
            <input
              id="column-slug"
              type="text"
              value={effectiveSlug}
              onChange={(event) => {
                setIsSlugTouched(true);
                setSlug(event.target.value);
                markDirty();
              }}
              maxLength={COLUMN_LIMITS.slug}
              className={styles.input}
              placeholder="제목에서 자동 생성됩니다"
            />
            <p className={styles.hint}>
              /column/{effectiveSlug || '…'}
              {isEdit && ' — 주소를 바꾸면 기존 링크는 접속되지 않습니다.'}
            </p>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="column-excerpt" className={styles.label}>
            요약
          </label>
          <textarea
            id="column-excerpt"
            value={excerpt}
            onChange={(event) => {
              setExcerpt(event.target.value);
              markDirty();
            }}
            maxLength={COLUMN_LIMITS.excerpt}
            className={styles.excerptTextarea}
            placeholder="목록과 검색 결과에 표시됩니다. 비워두면 첫 문단에서 자동 생성됩니다."
          />
        </div>

        <ImageUploadField
          label="대표 이미지"
          value={thumbnailUrl}
          hint="목록의 썸네일과 공유 미리보기(og:image)에 사용됩니다."
          onChange={(uploaded) => {
            setThumbnailUrl(uploaded?.url ?? null);
            markDirty();
          }}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>본문</h2>
        <BlockEditor
          blocks={blocks}
          onChange={(next) => {
            setBlocks(next);
            markDirty();
          }}
        />
      </section>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.actions}>
        <label className={styles.publishToggle}>
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => {
              setPublished(event.target.checked);
              markDirty();
            }}
            className={styles.checkbox}
          />
          <span>
            발행하기
            <span className={styles.publishHint}>
              {published ? '사이트에 공개됩니다' : '체크하지 않으면 임시저장 상태입니다'}
            </span>
          </span>
        </label>

        <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
          {isSubmitting ? '저장 중…' : '저장'}
        </button>
      </div>
    </form>
  );
}
