import styles from './VentureDeductionSection.module.css';

const DEDUCTION_RATES = [
  { amount: '3,000만원', rate: '100%' },
  { amount: '5,000만원', rate: '70%' },
];

export default function VentureDeductionSection() {
  return (
    <section id="venture" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>VENTURE INVESTMENT</div>
          <h2 className={styles.sectionTitle}>벤처투자 소득공제</h2>
          <p className={styles.sectionDesc}>
            연간 3천만원 100%, 연간 5천만원 70% 소득공제 가능한 효과적인 세테크
          </p>
        </div>

        <div className={styles.contentBlock}>
          <p className={styles.bodyText}>
            묻지마 투자가 아닌, 안전한 벤처기업을 선정하여 최소화된 리스크를 통해<br />
            안전하게 세금을 공제받을 수 있는 솔루션을 제공합니다.<br />
            조세특례법에 따라 개인이 벤처기업에 투자할 때 일정 금액에 대해 소득세를 공제해주는 제도입니다.
          </p>
        </div>

        <div className={styles.deductionSection}>
          <div className={styles.deductionGrid}>
            {DEDUCTION_RATES.map((item, i) => (
              <div key={i} className={styles.deductionCard}>
                <div className={styles.deductionAmount}>{item.amount}</div>
                <div className={styles.deductionRate}>{item.rate}</div>
                <div className={styles.deductionLabel}>소득공제</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.simulationSection}>
          <h3 className={styles.subTitle}>환급 시뮬레이션</h3>
          <div className={styles.simulationCard}>
            <div className={styles.simulationHeader}>
              <span>연소득 2억 / 투자금 5천만원 기준</span>
            </div>
            <div className={styles.simulationBody}>
              <div className={styles.simulationRow}>
                <div className={styles.simulationStep}>
                  <div className={styles.simulationStepNum}>01</div>
                  <div>
                    <div className={styles.simulationStepTitle}>3,000만원 구간</div>
                    <div className={styles.simulationStepDesc}>100% 공제 = 3,000만원</div>
                  </div>
                </div>
                <div className={styles.simulationPlus}>+</div>
                <div className={styles.simulationStep}>
                  <div className={styles.simulationStepNum}>02</div>
                  <div>
                    <div className={styles.simulationStepTitle}>2,000만원 구간</div>
                    <div className={styles.simulationStepDesc}>70% 공제 = 1,400만원</div>
                  </div>
                </div>
              </div>
              <div className={styles.simulationResult}>
                <div className={styles.simulationResultLabel}>총 공제액</div>
                <div className={styles.simulationResultAmount}>4,400만원</div>
              </div>
              <div className={styles.simulationRefund}>
                <div className={styles.simulationRefundLabel}>예상 소득세 환급액</div>
                <div className={styles.simulationRefundAmount}>약 1,839만원</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
