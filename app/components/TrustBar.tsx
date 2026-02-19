import styles from './TrustBar.module.css';

export default function TrustBar() {
  const items = [
    '병의원 전문 세무법인',
    '국세청 출신 전문가',
    '수도권 4개 지점',
    '원스톱 토탈 서비스',
  ];

  return (
    <section className={styles.trustBar}>
      <div className={styles.container}>
        {items.map((item, index) => (
          <div key={index} className={styles.item}>
            <svg className={styles.icon} width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}