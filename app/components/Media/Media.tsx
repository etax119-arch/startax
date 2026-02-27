import Image from 'next/image';
import styles from './Media.module.css';

export default function Media() {
  const videos = [
    { title: '가족 법인을 설립하면 유리한 점', thumbnail: '/assets/used/media/family-corporation.png', link: 'https://youtu.be/bmxqYee47sk?si=yYjKN5IIzfxrajqu' },
    { title: '벤처 투자 소득공제를 통한 절세', thumbnail: '/assets/used/media/venture-investment.png', link: 'https://youtu.be/y8NB2TRzyn0?si=hW2el3IARYGoaFeE' },
    { title: '기부금 경비 처리 간단 요약', thumbnail: '/assets/used/media/donation-expense.png', link: 'https://youtu.be/t1_QlZb_61E?si=-ONpwbtkGNMZ9s_Q' },
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
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.thumbnail}>
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={640}
                  height={360}
                  className={styles.thumbnailImage}
                />
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
