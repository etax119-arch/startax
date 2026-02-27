import styles from './SuccessionSection.module.css';

const PROCESS_STEPS = [
  { step: '01', title: '10년 이상 경영', desc: '중소기업 운영 기간 요건 충족' },
  { step: '02', title: '승계 대상 확인', desc: '배우자 또는 자녀 자격 요건 검토' },
  { step: '03', title: '공제 신청', desc: '최대 500억 가업상속재산 100% 공제' },
  { step: '04', title: '사후 관리', desc: '사후 요건 충족 및 지속 경영 지원' },
];

const CONDITIONS = [
  { label: '자녀 요건', value: '18세 이상' },
  { label: '부모 요건', value: '60세 이상' },
  { label: '용도', value: '창업 자금' },
];

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function SuccessionSection() {
  return (
    <section id="succession" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>BUSINESS SUCCESSION</div>
          <h2 className={styles.sectionTitle}>가업승계</h2>
          <p className={styles.sectionDesc}>
            가업을 배우자나 자식에게 승계 시 최대 500억까지 100% 상속 공제
          </p>
        </div>

        <div className={styles.highlightBanner}>
          <span className={styles.highlightIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
          미리미리 승계를 준비하세요!
        </div>

        {/* 가업상속 공제 */}
        <div className={styles.featureBlock}>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>01</div>
            <h3 className={styles.featureTitle}>가업상속 공제</h3>
            <p className={styles.featureBody}>
              10년 이상된 중소기업을 배우자나 자녀에게 승계하시고자 한다면,<br />
              이때 최대 500억까지 가업상속재산가액의 100%를 상속 공제하여<br />
              자연스럽게 가업을 이어나갈 수 있도록 지원하는 제도입니다.
            </p>
            <div className={styles.processFlow}>
              {PROCESS_STEPS.map((item, index) => (
                <div key={index} className={styles.processItem}>
                  <div className={styles.processStep}>{item.step}</div>
                  <div className={styles.processInfo}>
                    <div className={styles.processTitle}>{item.title}</div>
                    <div className={styles.processDesc}>{item.desc}</div>
                  </div>
                  {index < 3 && (
                    <div className={styles.processArrow}>
                      <ArrowIcon />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 가업승계 주식 증여세 과세특례제도 */}
        <div className={styles.featureBlock}>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>02</div>
            <h3 className={styles.featureTitle}>가업승계 주식 증여세 과세특례제도</h3>
            <p className={styles.featureBody}>
              10년 이상된 중소기업의 60대 이상 경영자가 다른 사람에게 증여를 할 경우에는<br />
              5억을 공제하고 10% 낮은 세율로 증여세를 부과하는 제도입니다.<br />
              이 제도는 사전 증여도 가능합니다.
            </p>
            <div className={styles.comparisonGrid}>
              <div className={styles.comparisonCard}>
                <div className={styles.comparisonLabel}>일반 증여</div>
                <div className={styles.comparisonValue}>일반 세율 적용</div>
                <div className={styles.comparisonDesc}>최대 50% 세율</div>
              </div>
              <div className={styles.comparisonArrow}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
              <div className={`${styles.comparisonCard} ${styles.comparisonHighlight}`}>
                <div className={styles.comparisonLabel}>과세특례 적용</div>
                <div className={styles.comparisonValue}>5억 공제 + 10% 세율</div>
                <div className={styles.comparisonDesc}>사전 증여 가능</div>
              </div>
            </div>
          </div>
        </div>

        {/* 창업자금 증여세 과세특례제도 */}
        <div className={styles.featureBlock}>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>03</div>
            <h3 className={styles.featureTitle}>창업자금 증여세 과세특례제도</h3>
            <p className={styles.featureBody}>
              18세 이상 자녀가 60세 이상 부모에게 자금을 받아 창업을 한다면<br />
              세제혜택을 받을 수 있는 제도입니다.<br />
              사업 자금 준비와 동시에 상속세 부담을 완화할 수 있습니다.
            </p>
            <div className={styles.conditionGrid}>
              {CONDITIONS.map((item, index) => (
                <div key={index} className={styles.conditionCard}>
                  <div className={styles.conditionLabel}>{item.label}</div>
                  <div className={styles.conditionValue}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
