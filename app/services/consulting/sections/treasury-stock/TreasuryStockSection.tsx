import styles from './TreasuryStockSection.module.css';

const STRATEGIES = [
  { title: '주가 안정화 및 상승', desc: '주주 가치 향상' },
  { title: '잉여 현금 활용', desc: '배당 대체 효과' },
  { title: '주식 희석 방지', desc: '지분율 보호' },
  { title: '적대적 인수 방어', desc: '경영권 보호' },
  { title: '주주 신뢰 강화', desc: '재무 비율 개선' },
  { title: 'M&A 자산 확보', desc: '인수합병 준비' },
];

const DISPOSAL_PAIRS = [
  { condition: '처분 금액 > 장부금액', result: '자본잉여금의 자기주식 처분 이익으로 처리' },
  { condition: '처분 금액 < 장부금액', result: '자본조정의 자기주식 처분 손실로 처리' },
];

const RETIREMENT_PAIRS = [
  { condition: '이익소각', result: '취득원가에 해당하는 이익잉여금을 상계처리' },
  { condition: '감자소각', result: '취득가액 vs 액면금액에 따라 감자차익 또는 감자차손으로 처리' },
];

export default function TreasuryStockSection() {
  return (
    <section id="treasury-stock" className={styles.sectionAlt}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>TREASURY STOCK</div>
          <h2 className={styles.sectionTitle}>자기주식 처분</h2>
          <p className={styles.sectionDesc}>
            자기주식 취득 시 적법한 절차에 따라 진행한다면 주주의 권리 확보는 물론<br />
            누적된 가지급금과 미처분 이익잉여금과 같은 경영 리스크 해결 비용을<br />
            상당 부분 절감할 수 있습니다.
          </p>
        </div>

        <h3 className={styles.benefitHeading}>자기주식 처분의 혜택</h3>
        <div className={styles.benefitGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <div className={styles.benefitLabel}>매입목적의 취득</div>
            <p className={styles.benefitDesc}>
              자기주식을 취득한 원가로 자본조정의 자기주식 과목으로 회계 처리
            </p>
            <span className={styles.benefitSub}>(자본항목의 마이너스 계정으로 처리)</span>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </div>
            <div className={styles.benefitLabel}>처분 시</div>
            <div className={styles.pairsWrap}>
              {DISPOSAL_PAIRS.map((pair, i) => (
                <div key={i} className={styles.pair}>
                  <span className={styles.pairCondition}>{pair.condition}</span>
                  <span className={styles.pairResult}>{pair.result}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <div className={styles.benefitLabel}>소각 시</div>
            <div className={styles.pairsWrap}>
              {RETIREMENT_PAIRS.map((pair, i) => (
                <div key={i} className={styles.pair}>
                  <span className={styles.pairCondition}>{pair.condition}</span>
                  <span className={styles.pairResult}>{pair.result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.featureBlock}>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>02</div>
            <h3 className={styles.featureTitle}>전략적 활용</h3>
            <div className={styles.strategyGrid}>
              {STRATEGIES.map((item, index) => (
                <div key={index} className={styles.strategyCard}>
                  <h4 className={styles.strategyTitle}>{item.title}</h4>
                  <p className={styles.strategyDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.featureBlock}>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>03</div>
            <h3 className={styles.featureTitle}>세무 관련</h3>
            <div className={styles.taxGrid}>
              <div className={styles.taxCard}>
                <div className={styles.taxLabel}>법적 제한</div>
                <p className={styles.taxDesc}>현행 법령 취지에 맞는 합법적 절차 진행</p>
              </div>
              <div className={styles.taxCard}>
                <div className={styles.taxLabel}>세무 이슈 해소</div>
                <p className={styles.taxDesc}>개인이익 및 가지급금 문제 대응</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
