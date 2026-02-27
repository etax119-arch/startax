import styles from './IncorporationSection.module.css';

const BENEFITS = [
  { number: '01', title: '세율 부담 감소', before: '소득세율 6~45%', after: '법인세율 9~24%', desc: '개인사업자 대비 법인세율이 현저히 낮아 세금 부담이 크게 줄어듭니다' },
  { number: '02', title: '의료보험 절감', before: '지역의료보험 (높은 보험료)', after: '직장의료보험 (낮은 보험료)', desc: '직장인 의료보험으로 변경되어 보험료 부담이 경감됩니다' },
  { number: '03', title: '채무 부담 감소', before: '무한책임 (개인사업자)', after: '유한책임 (법인)', desc: '법인의 유한책임으로 사업 실패 시 책임부담이 경감됩니다' },
  { number: '04', title: '제도 정책 활용 용이', before: '지원 자금 제한', after: '정부 지원 자금 활용', desc: '정부 지원 운전·시설·고용 자금 및 소상공인 자금 지원 가능합니다' },
];

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function IncorporationSection() {
  return (
    <section id="incorporation" className={styles.sectionAlt}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>INCORPORATION</div>
          <h2 className={styles.sectionTitle}>법인전환</h2>
          <p className={styles.sectionDesc}>
            개인사업자가 사업의 조직형태를<br />
            법인 사업자의 형태로 변경하는 것을 말합니다.
            기존의 권리와 의무 등을 그대로 이양하여 영업을 지속하고자 할 때 법인전환을 하게 됩니다.
          </p>
        </div>

        <div className={styles.benefitGrid}>
          {BENEFITS.map((benefit, index) => (
            <div key={index} className={styles.benefitCard}>
              <div className={styles.benefitNumber}>{benefit.number}</div>
              <h3 className={styles.benefitTitle}>{benefit.title}</h3>
              <div className={styles.benefitComparison}>
                <div className={styles.benefitBefore}>
                  <span className={styles.benefitLabel}>Before</span>
                  <span>{benefit.before}</span>
                </div>
                <div className={styles.benefitArrow}>
                  <ArrowIcon />
                </div>
                <div className={styles.benefitAfter}>
                  <span className={styles.benefitLabel}>After</span>
                  <span>{benefit.after}</span>
                </div>
              </div>
              <p className={styles.benefitDesc}>{benefit.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.noticeBox}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p>
            지속할 영업적 권리와 의무 등이 존재하지 않는 경우에는 신규법인 설립으로 진행하면 됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}
