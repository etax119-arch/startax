import styles from './BookkeepingSection.module.css';

const SERVICES = [
  { title: '세무조정', desc: '정확한 세무조정으로 과세표준을 최적화하고 불필요한 세금 부담을 줄여드립니다' },
  { title: '신고대행', desc: '종합소득세, 법인세, 부가세 등 모든 세금 신고를 정확하고 기한 내에 처리합니다' },
  { title: '신청대행', desc: '각종 세무 관련 신청 업무를 대행하여 복잡한 행정 절차를 간소화해 드립니다' },
  { title: '업무대응', desc: '세무서 질의·소명요구 등 각종 세무 업무에 신속하고 전문적으로 대응합니다' },
];

const MIRIMIR_STEPS = [
  {
    label: '사전분석',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="m21 21-4.15-4.15" />
        <path d="M8 9h5M8 12h3" />
      </svg>
    ),
  },
  {
    label: '예측 시뮬레이션',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2v6h-6" />
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M3 22v-6h6" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      </svg>
    ),
  },
  {
    label: '비용 조정',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4" />
        <path d="M2 12h4M18 12h4" />
        <circle cx="12" cy="12" r="3" />
        <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
        <path d="M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    label: '예상 세액 산출',
    filled: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M8 6h8" />
        <path d="M8 10h2M14 10h2" />
        <path d="M8 14h2M14 14h2" />
        <path d="M8 18h8" />
      </svg>
    ),
  },
];

const TAX_SAVING_STEPS = [
  {
    label: '예상 매출 분석',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    label: '예상 경비 분석',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <circle cx="12" cy="15" r="3" />
        <path d="m14.5 17.5 2 2" />
      </svg>
    ),
  },
  {
    label: '경비 적정성 분석',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    label: '경비 가이드 제시',
    filled: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

function CircleFlow({ steps }: { steps: typeof MIRIMIR_STEPS }) {
  return (
    <div className={styles.circleFlow}>
      {steps.map((item, i) => (
        <div key={i} className={styles.circleStep}>
          <div className={`${styles.circle} ${item.filled ? styles.circleFilled : ''}`}>
            {item.icon}
          </div>
          <span className={styles.circleLabel}>{item.label}</span>
          {i < steps.length - 1 && <div className={styles.arrow}>&rarr;</div>}
        </div>
      ))}
    </div>
  );
}

export default function BookkeepingSection() {
  return (
    <section id="bookkeeping" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>BOOKKEEPING & CONSULTING</div>
          <h2 className={styles.sectionTitle}>세무기장 및 운영컨설팅</h2>
          <p className={styles.sectionDesc}>
            병의원에 특화된 체계적인 세무 관리로<br />안정적인 경영 환경을 만들어 드립니다
          </p>
        </div>

        <div className={styles.serviceGrid}>
          {SERVICES.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              <h3 className={styles.serviceCardTitle}>{service.title}</h3>
              <p className={styles.serviceCardDesc}>{service.desc}</p>
            </div>
          ))}
        </div>

        {/* 미리미리 서비스 */}
        <div className={styles.featureBox}>
          <div className={styles.featureBoxLeft}>
            <CircleFlow steps={MIRIMIR_STEPS} />
          </div>
          <div className={styles.featureBoxRight}>
            <h3 className={styles.featureBoxTitle}>
              스타택스의 <strong>미리미리 서비스</strong>
            </h3>
            <p className={styles.featureBoxDesc}>갑작스러운 세금 납부에 부담이 있었나요?</p>
            <p className={styles.featureBoxBody}>미리 준비해야 하는 세금! 세금을 내는데 갑자기라는 것은 없습니다.</p>
          </div>
        </div>

        {/* 절세 전략 수립 */}
        <div className={styles.featureBox}>
          <div className={styles.featureBoxLeft}>
            <h4 className={styles.featureBoxLabel}>절세 전략 수립</h4>
            <CircleFlow steps={TAX_SAVING_STEPS} />
          </div>
          <div className={styles.featureBoxRight}>
            <h3 className={styles.featureBoxTitle}>
              스타택스의 누수없는 <strong>절세 전략!</strong>
            </h3>
            <p className={styles.featureBoxDesc}>세무는 곧 절세를 의미합니다.</p>
            <p className={styles.featureBoxBody}>지속적인 관리와 효과적인 절세가 진짜 케어입니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
