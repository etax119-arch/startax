import styles from './VentureSection.module.css';

const BENEFITS = [
  {
    num: '01',
    category: '세제',
    desc: '최대 5년간 법인세 소득세 50% 감면, 취득세 75% 감면, 재산세 3년간 면제, 이후 2년간 50% 감면',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    num: '02',
    category: '금융',
    desc: '50억원 이행보증과 전자상거래 담보보증 70억원, 코스닥 기준 50억 → 15억, 법인세비용차감전계속사업이익 기준 50% 우대',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    num: '03',
    category: '입지',
    desc: '취득세 50%, 재산세 35% 경감, 취득세(2배), 등록면허세(3배), 재산세(5배) 중과적용 면제',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    num: '04',
    category: 'M&A',
    desc: '대기업 인수 합병 시 상호출자제한 기업집단으로의 계열 편입을 7년간 유예',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    num: '05',
    category: '인력',
    desc: '연구소 인력 기준 완화, 스톡옵션 부여대상 확대',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    num: '06',
    category: '광고',
    desc: 'TV·라디오 최대 70% 할인 (정상가 35억 한도), TV·라디오 광고제작비 최대 70% 지원',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
      </svg>
    ),
  },
];

const TYPES = [
  {
    title: '벤처투자유형',
    desc: '벤처투자기관으로부터 투자받은 금액이 자본금의 10% 이상인 기업',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: '연구개발유형',
    desc: '기업부설연구소를 보유하고 연구개발비가 매출액의 5% 이상인 기업',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    title: '기술평가 보증·대출유형',
    desc: '기술보증기금 또는 중소벤처기업진흥공단의 기술성 평가 결과 우수한 기업',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: '예비벤처유형',
    desc: '법인 설립 또는 사업자 등록 전 기술과 사업계획이 우수한 예비창업자',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function VentureSection() {
  return (
    <section id="venture" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>VENTURE CERTIFICATION</div>
          <h2 className={styles.sectionTitle}>벤처기업 인증</h2>
          <p className={styles.sectionDesc}>
            획기적인 기술과 성장 가능성이 높다고 판단되어<br />
            벤처기업으로 인증받게 되면 다양한 세제 혜택과 보증기관들로부터 가점을 부여받게 되며, 이로 인해 각종 혜택들을 받을 수 있어 사업을 운영할 수 있습니다.
          </p>
        </div>

        <div className={styles.benefitSection}>
          <h3 className={styles.benefitHeading}>벤처인증 기업의 혜택</h3>
          <div className={styles.benefitGrid}>
            {BENEFITS.map((item, index) => (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitIconWrap}>{item.icon}</div>
                <div className={styles.benefitNum}>{item.num}</div>
                <h4 className={styles.benefitCategory}>{item.category}</h4>
                <p className={styles.benefitDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.typeSection}>
          <h3 className={styles.typeHeading}>벤처 인증 유형</h3>
          <p className={styles.typeSubtext}>
            각 항목 중 하나의 요건을 모두 충족하여야 벤처기업확인 신청이 가능합니다.
          </p>
          <div className={styles.typeDiagram}>
            <div className={styles.typeHub}>
              <div className={styles.typeHubInner}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span>벤처기업 인증</span>
              </div>
            </div>
            <div className={styles.typeGrid}>
              {TYPES.map((type, index) => (
                <div key={index} className={styles.typeCard}>
                  <div className={styles.typeIconWrap}>{type.icon}</div>
                  <h4 className={styles.typeTitle}>{type.title}</h4>
                  <p className={styles.typeDesc}>{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
