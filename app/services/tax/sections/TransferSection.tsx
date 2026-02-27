import styles from './TransferSection.module.css';

const ASSETS = ['포괄양수도', '주식', '채권', '계약', '특허권', '부동산'];

const DIAMOND_CARDS = [
  {
    colorClass: 'diamondBlue',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M8 6h8" />
        <path d="M8 10h2M14 10h2" />
        <path d="M8 14h2M14 14h2" />
        <path d="M8 18h8" />
      </svg>
    ),
  },
  {
    colorClass: 'diamondDark',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    colorClass: 'diamondNavy',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v3" />
        <path d="M4 10h16" />
        <path d="M6 10l1.5 7H8" />
        <path d="M18 10l-1.5 7H16" />
        <path d="M12 10v7" />
        <path d="M5 20h14" />
        <path d="M4 10l8-4 8 4" />
      </svg>
    ),
  },
  {
    colorClass: 'diamondMedium',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 15l1.5-1 1.5 1 1.5-1 1.5 1" />
        <path d="M9 11l1.5-1 1.5 1 1.5-1 1.5 1" />
      </svg>
    ),
  },
];

const LABELS = [
  { position: 'labelTopLeft', text: '세무회계' },
  { position: 'labelBottomLeft', text: '법률 자문' },
  { position: 'labelTopRight', text: '분쟁 방지' },
  { position: 'labelBottomRight', text: '감정평가' },
];

export default function TransferSection() {
  return (
    <section id="transfer" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>TRANSFER</div>
          <h2 className={styles.sectionTitle}>양도양수</h2>
          <p className={styles.sectionDesc}>
            양도양수 막막하고 어려우신가요?
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.assetGrid}>
            {ASSETS.map((asset, index) => (
              <div key={index} className={styles.assetTag}>{asset}</div>
            ))}
          </div>

          <p className={styles.desc}>
            계약서 검토부터 세금 및 비용, 법적 규정의 준수를 통한 승인까지<br />
            복잡한 법적, 재정적 요소가 포함된 절차들로 이루어져 있어<br />
            이를 진행할 때 세무전문가 및 법률 전문가의 도움을 받는 것이 중요합니다.
          </p>

          <div className={styles.partnershipSection}>
            <h3 className={styles.partnershipTitle}>스타택스 파트너십</h3>

            <div className={styles.diamondWrapper}>
              {/* Left labels */}
              {LABELS.slice(0, 2).map((label) => (
                <div key={label.position} className={`${styles.diamondLabel} ${styles[label.position as keyof typeof styles]}`}>
                  <span>{label.text}</span>
                  <div className={styles.labelLine} />
                </div>
              ))}

              {/* Diamond grid */}
              <div className={styles.diamondGrid}>
                {DIAMOND_CARDS.map((card, i) => (
                  <div key={i} className={`${styles.diamondCard} ${styles[card.colorClass as keyof typeof styles]}`}>
                    <div className={styles.diamondIconWrap}>{card.icon}</div>
                  </div>
                ))}
              </div>

              {/* Center circle */}
              <div className={styles.diamondCenter}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2E2620" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <span className={styles.diamondCenterText}>세무법인스타택스</span>
              </div>

              {/* Right labels */}
              {LABELS.slice(2).map((label) => (
                <div key={label.position} className={`${styles.diamondLabel} ${styles[label.position as keyof typeof styles]}`}>
                  <div className={styles.labelLine} />
                  <span>{label.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
