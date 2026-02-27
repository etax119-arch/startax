import styles from './WelfareFundSection.module.css';

const BENEFIT_GROUPS = [
  {
    perspective: '기업',
    benefits: [
      { title: '법인세 절감', desc: '출연금을 비용 처리하여 과세소득 감소' },
      { title: '비용처리', desc: '세금부담 감소 효과' },
      { title: '장기적 절세', desc: '직원 복지 증진으로 생산성 향상 및 이직률 감소' },
    ],
  },
  {
    perspective: '대표자',
    benefits: [
      { title: '세금부담 경감', desc: '근로자 혜택을 비과세로 처리' },
      { title: '협상력 강화', desc: '절세 혜택을 활용한 인재 유치' },
      { title: '세금 혜택 극대화', desc: '다양한 공제 항목 활용' },
    ],
  },
  {
    perspective: '근로자',
    benefits: [
      { title: '비과세 혜택', desc: '주택자금 대출, 의료비·교육비 지원 등' },
      { title: '소득세 부담 완화', desc: '실질 소득 증가 효과' },
      { title: '노후 대비', desc: '퇴직 후 생활 지원 및 연금 프로그램' },
    ],
  },
];

export default function WelfareFundSection() {
  return (
    <section id="welfare-fund" className={styles.sectionAlt}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>EMPLOYEE WELFARE FUND</div>
          <h2 className={styles.sectionTitle}>사내근로복지기금</h2>
          <p className={styles.sectionDesc}>
            기업경영주 근로자 모두가 WIN-WIN하는 사내근로복지기금
          </p>
        </div>

        <div className={styles.contentBlock}>
          <p className={styles.bodyText}>
            기업 내에서 근로자의 복지 증진을 위해 조성된 기금입니다.<br />
            회사가 일정 금액을 출연하거나 이익금의 일부를 기금으로 전환하여 조성되며,<br />
            근로자 복리후생 향상을 위해 사용됩니다.
          </p>
        </div>

        <div className={styles.benefitTriple}>
          {BENEFIT_GROUPS.map((group, gIndex) => (
            <div key={gIndex} className={styles.benefitGroup}>
              <div className={styles.benefitPerspective}>
                <span className={styles.benefitLabel}>{group.perspective} 입장의 절세 효과</span>
              </div>
              <div className={styles.benefitList}>
                {group.benefits.map((benefit, bIndex) => (
                  <div key={bIndex} className={styles.benefitItem}>
                    <div className={styles.benefitDot} />
                    <div>
                      <div className={styles.benefitTitle}>{benefit.title}</div>
                      <div className={styles.benefitDesc}>{benefit.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
