import styles from './Media.module.css';

export default function Media() {
  const videos = [
    { title: '병의원 절세 전략', thumbnail: '' },
    { title: '법인 전환 가이드', thumbnail: '' },
    { title: '세무조사 대응법', thumbnail: '' },
  ];

  return (
    <section id="media" className={styles.media}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tag}>MEDIA</div>
          <h2 className={styles.headline}>절세의 답을 찾는 방법</h2>
        </div>

        <div className={styles.grid}>
          {videos.map((video, index) => (
            <a
              key={index}
              href="https://www.youtube.com/@startaxaccounting"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.thumbnail}>
                <svg className={styles.playIcon} width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="32" fill="var(--accent-gold)" opacity="0.9" />
                  <path
                    d="M26 20L44 32L26 44V20Z"
                    fill="var(--bg-primary)"
                  />
                </svg>
              </div>
              <div className={styles.title}>{video.title}</div>
            </a>
          ))}
        </div>

        <div className={styles.cta}>
          <a
            href="https://www.youtube.com/@startaxaccounting"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            더 많은 영상 보기 →
          </a>
        </div>
      </div>
    </section>
  );
}