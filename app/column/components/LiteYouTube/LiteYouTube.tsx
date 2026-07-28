'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './LiteYouTube.module.css';
import { youtubeEmbedUrl, youtubeThumbnailUrl } from '../../../lib/youtube';

interface LiteYouTubeProps {
  videoId: string;
  title: string;
}

/**
 * 클릭 전까지는 썸네일만 보여주고, 재생을 누를 때 iframe 을 붙입니다.
 * 유튜브 iframe 은 임베드당 수백 KB + 서드파티 요청이 붙어서, 글 하나에 영상이
 * 여러 개면 LCP/TBT 가 무너집니다.
 */
export default function LiteYouTube({ videoId, title }: LiteYouTubeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState(() => youtubeThumbnailUrl(videoId, 'max'));

  if (isPlaying) {
    return (
      <div className={styles.wrapper}>
        <iframe
          className={styles.iframe}
          src={youtubeEmbedUrl(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.wrapper}
      onClick={() => setIsPlaying(true)}
      aria-label={`${title} 영상 재생`}
    >
      <Image
        src={thumbnailSrc}
        alt=""
        fill
        sizes="(max-width: 800px) 100vw, 760px"
        className={styles.thumbnail}
        // maxresdefault 는 오래된 영상에 없을 수 있어 hqdefault 로 폴백합니다.
        onError={() => setThumbnailSrc(youtubeThumbnailUrl(videoId, 'hq'))}
      />
      <svg className={styles.playIcon} width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="32" fill="var(--accent-gold)" opacity="0.9" />
        <path d="M26 20L44 32L26 44V20Z" fill="var(--bg-primary)" />
      </svg>
    </button>
  );
}
