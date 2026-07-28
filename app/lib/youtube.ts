const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_URL =
  /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/|v\/))([A-Za-z0-9_-]{11})/;

/**
 * 다양한 형태의 유튜브 링크에서 11자 영상 ID를 추출합니다.
 * - https://youtu.be/ID?si=...        (Media.tsx 가 실제로 쓰는 형태)
 * - https://www.youtube.com/watch?v=ID&t=30s
 * - https://www.youtube.com/watch?list=...&v=ID
 * - https://www.youtube.com/embed/ID
 * - https://www.youtube.com/shorts/ID
 * - https://www.youtube.com/live/ID
 * - ID 만 그대로 붙여넣은 경우
 */
export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (YOUTUBE_ID.test(trimmed)) return trimmed;
  const match = trimmed.match(YOUTUBE_URL);
  return match ? match[1] : null;
}

/**
 * maxresdefault 는 오래된 영상에서 404 가 날 수 있습니다.
 * 화면에서는 max 로 시도하고 onError 시 hq 로 폴백합니다 (hqdefault 는 항상 존재).
 */
export function youtubeThumbnailUrl(videoId: string, quality: 'max' | 'hq' = 'max'): string {
  const file = quality === 'max' ? 'maxresdefault.jpg' : 'hqdefault.jpg';
  return `https://i.ytimg.com/vi/${videoId}/${file}`;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
}
