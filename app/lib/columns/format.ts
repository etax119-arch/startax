const KST_DATE = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const KST_DATETIME = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * 2026. 03. 14. → 2026.03.14
 * 반드시 서버에서 포맷해 문자열로 내려보냅니다. 클라이언트에서 포맷하면
 * 서버/브라우저 타임존 차이로 hydration mismatch 가 발생합니다.
 */
export function formatColumnDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return KST_DATE.format(date).replace(/\.\s*/g, '.').replace(/\.$/, '');
}

export function formatColumnDateTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return KST_DATETIME.format(date);
}
