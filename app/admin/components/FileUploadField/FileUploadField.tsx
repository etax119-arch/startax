'use client';

import { useId, useRef, useState, type ChangeEvent } from 'react';
import styles from './FileUploadField.module.css';
import { ALLOWED_FILE_EXTENSIONS, MAX_UPLOAD_MB } from '../../../lib/columns/constants';
import { fileExtensionLabel, formatFileSize } from '../../../lib/columns/file';
import { requestJson } from '../../../lib/http';

// 서버가 허용하는 목록에서 직접 만들어, 파일 선택창과 서버 검증이 어긋날 수 없게 합니다.
const ACCEPT_ATTR = ALLOWED_FILE_EXTENSIONS.map((ext) => `.${ext}`).join(',');
const SUPPORTED_LABEL = ALLOWED_FILE_EXTENSIONS.map((ext) => ext.toUpperCase()).join(', ');

export interface UploadedFile {
  url: string;
  name: string;
  size: number | null;
}

interface FileUploadFieldProps {
  value: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
}

export default function FileUploadField({ value, onChange }: FileUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    const body = new FormData();
    body.append('file', file);

    const result = await requestJson<UploadedFile>(
      '/api/admin/upload-file',
      { method: 'POST', body },
      '파일 업로드에 실패했습니다.'
    );

    setIsUploading(false);
    // 같은 파일을 다시 선택해도 change 가 발생하도록 초기화합니다.
    if (inputRef.current) inputRef.current.value = '';

    if (!result.ok) {
      setError(result.error);
      return;
    }
    onChange(result.data);
  };

  return (
    <div className={styles.field}>
      {value ? (
        <div className={styles.selected}>
          <span className={styles.badge} aria-hidden="true">
            {fileExtensionLabel(value.name)}
          </span>
          <span className={styles.info}>
            <span className={styles.name}>{value.name}</span>
            <span className={styles.size}>{formatFileSize(value.size)}</span>
          </span>
          <button
            type="button"
            className={styles.remove}
            onClick={() => onChange(null)}
            aria-label="첨부 파일 제거"
          >
            ✕
          </button>
        </div>
      ) : (
        <label htmlFor={inputId} className={styles.dropzone}>
          <span className={styles.dropzoneIcon} aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </span>
          <span className={styles.dropzoneText}>
            {isUploading ? '업로드 중…' : '파일 선택'}
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

      {error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <p className={styles.hint}>
          {SUPPORTED_LABEL} · {MAX_UPLOAD_MB}MB 이하. 독자에게는 항상 내려받기로 열립니다.
        </p>
      )}
    </div>
  );
}
