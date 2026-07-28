'use client';

import { useId, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import styles from './ImageUploadField.module.css';
import { ALLOWED_IMAGE_TYPES } from '../../../lib/columns/constants';
import { requestJson } from '../../../lib/http';

// 서버가 허용하는 목록에서 직접 만들어, 파일 선택창과 서버 검증이 어긋날 수 없게 합니다.
const ACCEPT_ATTR = Object.keys(ALLOWED_IMAGE_TYPES).join(',');

interface UploadedImage {
  url: string;
  width: number | null;
  height: number | null;
}

interface ImageUploadFieldProps {
  value: string | null;
  onChange: (image: UploadedImage | null) => void;
  label: string;
  hint?: string;
}

/**
 * 자연 크기를 브라우저에서 측정합니다.
 * 서버에 이미지 디코딩 의존성을 들이지 않으면서, 상세 페이지의 next/image 에
 * width/height 를 넘겨 레이아웃 이동(CLS)을 없애기 위함입니다.
 */
async function measureImage(file: File): Promise<{ width: number | null; height: number | null }> {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return { width: null, height: null };
  }
}

export default function ImageUploadField({ value, onChange, label, hint }: ImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    const size = await measureImage(file);
    const body = new FormData();
    body.append('file', file);

    const result = await requestJson<{ url: string }>(
      '/api/admin/upload',
      { method: 'POST', body },
      '이미지 업로드에 실패했습니다.'
    );

    setIsUploading(false);
    // 같은 파일을 다시 선택해도 change 가 발생하도록 초기화합니다.
    if (inputRef.current) inputRef.current.value = '';

    if (!result.ok) {
      setError(result.error);
      return;
    }
    onChange({ url: result.data.url, width: size.width, height: size.height });
  };

  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>

      {value ? (
        <div className={styles.preview}>
          <Image src={value} alt="" fill sizes="240px" className={styles.previewImage} />
          <button
            type="button"
            className={styles.remove}
            onClick={() => onChange(null)}
            aria-label="이미지 제거"
          >
            ✕
          </button>
        </div>
      ) : (
        <label htmlFor={inputId} className={styles.dropzone}>
          <span className={styles.dropzoneIcon} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </span>
          <span className={styles.dropzoneText}>
            {isUploading ? '업로드 중…' : '이미지 선택'}
          </span>
        </label>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT_ATTR}
        onChange={handleFileChange}
        disabled={isUploading}
        className={styles.input}
      />

      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
