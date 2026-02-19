import styles from './Expertise.module.css';

export default function Expertise() {
  const areas = [
    { title: '병의원 세무', desc: '병의원 특화 절세 전략과 운영 컨설팅' },
    { title: '법인 설립·운영', desc: '법인 전환부터 운영까지 토탈 지원' },
    { title: '상속·증여·양도', desc: '자산 승계 및 양도세 전문 컨설팅' },
    { title: '세무조사 대응', desc: '국세청 출신 전문가의 세무조사 대응' },
    { title: '경정청구·절세', desc: '환급 가능한 세금 찾아 청구 대행' },
    { title: '노무 컨설팅', desc: '인사·노무 전문 파트너 연계 서비스' },
  ];

  return (
    <section id="expertise" className={styles.expertise}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tag}>EXPERTISE</div>
          <h2 className={styles.headline}>전문 영역</h2>
        </div>

        <div className={styles.grid}>
          {areas.map((area, index) => (
            <div key={index} className={styles.card}>
              <svg className={styles.icon} width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect
                  x="8"
                  y="8"
                  width="24"
                  height="24"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16 18L20 22L28 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className={styles.cardTitle}>{area.title}</h3>
              <p className={styles.cardDesc}>{area.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}