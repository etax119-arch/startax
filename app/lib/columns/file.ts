/**
 * 첨부 파일 표시용 헬퍼. 공개 화면과 관리자 화면이 같은 값을 쓰도록 여기 모읍니다.
 *
 * 다운로드 URL 은 여기서 만들지 않습니다 — 업로드 시점에 Supabase SDK 의
 * getPublicUrl(path, { download }) 이 붙여 주며, 그 URL 이 그대로 저장됩니다.
 */

/** 사람이 읽는 크기. 크기를 모르면 빈 문자열이라 화면에서 생략됩니다. */
export function formatFileSize(bytes: number | null): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes <= 0) return '';

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }

  // KB 부터는 소수 한 자리까지 보여야 4.2MB 같은 값이 4MB 로 뭉개지지 않습니다.
  const rounded = unit > 0 && value < 100 ? value.toFixed(1) : String(Math.round(value));
  return `${rounded}${units[unit]}`;
}

/**
 * 배지에 쓸 확장자 라벨. 파일명에서 파생하므로 따로 저장하지 않습니다
 * (업로드가 확장자 없는 파일을 거부하므로 name 에는 항상 확장자가 있습니다).
 */
export function fileExtensionLabel(name: string): string {
  const dot = name.lastIndexOf('.');
  if (dot < 0 || dot === name.length - 1) return 'FILE';
  return name.slice(dot + 1).toUpperCase();
}
