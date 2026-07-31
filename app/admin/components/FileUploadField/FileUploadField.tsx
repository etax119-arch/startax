'use client';

import { useId, useRef, useState, type ChangeEvent } from 'react';
import styles from './FileUploadField.module.css';
import {
  ALLOWED_FILE_EXTENSIONS,
  COLUMN_FILE_BUCKET,
  MAX_FILE_UPLOAD_MB,
} from '../../../lib/columns/constants';
import { fileExtensionLabel, formatFileSize } from '../../../lib/columns/file';
import { getBrowserSupabase } from '../../../lib/supabase/browser';
import { postJson } from '../../../lib/http';

// 서버가 허용하는 목록에서 직접 만들어, 파일 선택창과 서버 검증이 어긋날 수 없게 합니다.
const ACCEPT_ATTR = ALLOWED_FILE_EXTENSIONS.map((ext) => `.${ext}`).join(',');
const SUPPORTED_LABEL = ALLOWED_FILE_EXTENSIONS.map((ext) => ext.toUpperCase()).join(', ');

/** /api/admin/upload-file/sign 응답. */
interface SignedUpload {
  path: string;
  token: string;
  url: string;
  name: string;
  contentType: string;
}

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

    const finish = (message?: string) => {
      setIsUploading(false);
      // 같은 파일을 다시 선택해도 change 가 발생하도록 초기화합니다.
      if (inputRef.current) inputRef.current.value = '';
      if (message) setError(message);
    };

    // 1) 서버에서 권한·형식·크기를 확인하고 올릴 자리를 받습니다.
    const signed = await postJson<SignedUpload>(
      '/api/admin/upload-file/sign',
      { name: file.name, size: file.size },
      '파일 업로드를 시작하지 못했습니다.'
    );
    if (!signed.ok) {
      finish(signed.error);
      return;
    }

    // 2) 파일은 서버를 거치지 않고 스토리지로 직접 올립니다 (4.5MB 바디 상한 회피).
    //    File 을 그대로 넘기면 브라우저가 알려준 MIME 이 저장되므로, 서버가 정해 준
    //    타입으로 감싸 올립니다. 실행 가능한 타입으로 저장되는 것을 막기 위함입니다.
    const { data } = signed;
    const { error: uploadError } = await getBrowserSupabase()
      .storage.from(COLUMN_FILE_BUCKET)
      .uploadToSignedUrl(data.path, data.token, new Blob([file], { type: data.contentType }));

    if (uploadError) {
      console.error('Signed upload failed:', uploadError);
      finish('파일 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    finish();
    onChange({ url: data.url, name: data.name, size: file.size });
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
          {SUPPORTED_LABEL} · {MAX_FILE_UPLOAD_MB}MB 이하. 독자에게는 항상 내려받기로 열립니다.
        </p>
      )}
    </div>
  );
}
