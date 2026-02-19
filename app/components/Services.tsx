import styles from './Services.module.css';

export default function Services() {
  const services = [
    {
      title: '세무 서비스',
      items: [
        '세무 기장 대리',
        '종합소득세·법인세·부가세 신고',
        '분기별 예측 분석',
        '매출·매입 모니터링',
      ],
    },
    {
      title: '병의원 전문 컨설팅',
      items: [
        '병의원 특화 절세 전략',
        '효과적인 공제 관리',
        '개원~운영 전 과정 동반',
        '10년+ 의료업 세무 노하우',
      ],
      highlight: true,
    },
    {
      title: '경영 컨설팅',
      items: [
        '법인 설립·전환 지원',
        '상속·증여·양도세 전문',
        '세무조사 대응 전문팀',
        '노무 서비스 연계',
      ],
    },
  ];

  return (
    <section id="services" className={styles.services}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tag}>SERVICES</div>
          <h2 className={styles.headline}>전문성 있는 세무 서비스</h2>
        </div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <div
              key={index}
              className={`${styles.card} ${service.highlight ? styles.highlight : ''}`}
            >
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <ul className={styles.list}>
                {service.items.map((item, idx) => (
                  <li key={idx}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M16.667 5L7.5 14.167L3.333 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}