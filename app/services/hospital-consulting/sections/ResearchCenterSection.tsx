import styles from './ResearchCenterSection.module.css';

const RESEARCH_BENEFITS = [
  '연구비 세액 공제', '인건비 세액 공제', '인건비 보조금', '정부지원 혜택',
  '특허관련 세금혜택', '지방세 감면', '감가상각비 혜택', '부가세 환급',
];

const SETUP_PROCESS = [
  { step: '01', title: '요건 수립', desc: '연구과제 수립, 연구독립공간 마련' },
  { step: '02', title: '인력 구성', desc: '전담부서 1인 이상, 중소기업 2인 이상, 중견기업 7명 이상' },
  { step: '03', title: '실물 제작', desc: '공간 구성, 연구 집기 설치, 현판 제작' },
  { step: '04', title: '신고/관리', desc: '서류 제출, 실사, 인정서 발급, 사후 관리' },
];

export default function ResearchCenterSection() {
  return (
    <section id="research" className={styles.sectionAlt}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>CORPORATE R&D CENTER</div>
          <h2 className={styles.sectionTitle}>기업부설연구소</h2>
          <p className={styles.sectionDesc}>
            중소기업과 중견기업의 연구개발을 촉진시키기 위한 제도
          </p>
        </div>

        <div className={styles.contentBlock}>
          <p className={styles.bodyText}>
            여러 설립요건에 충족하여 기업부설연구소를 설립하면 세금관점에서 여러 혜택을 받을 수 있으며,<br />
            이러한 관점의 컨설팅을 통해 설립 실무를 대행합니다.
          </p>
        </div>

        <div className={styles.researchBenefits}>
          <h3 className={styles.subTitle}>세제 혜택</h3>
          <div className={styles.researchGrid}>
            {RESEARCH_BENEFITS.map((title, index) => (
              <div key={index} className={styles.researchCard}>
                <span className={styles.researchCardTitle}>{title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.processSection}>
          <h3 className={styles.subTitle}>설립 절차</h3>
          <div className={styles.processFlow}>
            {SETUP_PROCESS.map((item, index) => (
              <div key={index} className={styles.processItem}>
                <div className={styles.processStep}>{item.step}</div>
                <div className={styles.processInfo}>
                  <div className={styles.processTitle}>{item.title}</div>
                  <div className={styles.processDesc}>{item.desc}</div>
                </div>
                {index < SETUP_PROCESS.length - 1 && (
                  <div className={styles.processArrow}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
