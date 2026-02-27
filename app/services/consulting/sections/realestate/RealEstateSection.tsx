import styles from './RealEstateSection.module.css';

const DEVELOPMENT_ITEMS = [
  'Project Financing 자문',
  '부동산 사업수지분석 및 투자분석',
  '부동산 재무타당성 분석',
];

const VALUATION_ITEMS = [
  '지분 매수/매각 관련 가치평가, 재무모델링',
  '사업결합에 따른 PPA (매수가격 배분 및 무형자산 공정가치 평가)',
  '영업권 손상검사, 피투자기업 지분가치평가 및 손상검사',
  '파생상품 공정가치평가',
  '지분투자 또는 M&A를 위한 재무실사',
];

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
    <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function RealEstateSection() {
  return (
    <section id="realestate" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>REAL ESTATE & FINANCE</div>
          <h2 className={styles.sectionTitle}>부동산/재무컨설팅</h2>
          <p className={styles.sectionDesc}>
            부동산 개발부터 가치평가, M&A 실사까지 전문적인 재무 컨설팅을 제공합니다
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>부동산 개발 및 시행 업무</h3>
            <ul className={styles.list}>
              {DEVELOPMENT_ITEMS.map((item, i) => (
                <li key={i}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>가치 평가 및 실사 업무</h3>
            <ul className={styles.list}>
              {VALUATION_ITEMS.map((item, i) => (
                <li key={i}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
