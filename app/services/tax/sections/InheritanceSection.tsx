import { Fragment } from 'react';
import styles from './InheritanceSection.module.css';

const ASSET_ICONS = [
  {
    label: '금융자산',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="16" r="2" />
        <circle cx="8" cy="14" r="2" />
        <circle cx="12" cy="16" r="2" />
        <circle cx="12" cy="14" r="2" />
        <path d="M10 8h4" />
        <path d="M12 6v4" />
        <rect x="7" y="5" width="10" height="6" rx="1" />
      </svg>
    ),
  },
  {
    label: '부동산',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-6h6v6" />
        <path d="M10 10h4" />
        <path d="M10 13h4" />
      </svg>
    ),
  },
  {
    label: '동산',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8M3.6 15h16.8" />
        <path d="M12 3a9 9 0 0 1 0 18" />
        <path d="M12 3a9 9 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    label: '사업자산',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="3" />
        <path d="M5 21v-2a7 7 0 0 1 7-7" />
        <rect x="14" y="15" width="7" height="5" rx="1" />
        <path d="M16 15v-2h3v2" />
      </svg>
    ),
  },
  {
    label: '지적재산권',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z" />
        <path d="m9 9 2 2 4-4" />
      </svg>
    ),
  },
  {
    label: '가상화폐',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 8h4.5a2.5 2.5 0 0 1 0 5H9V8z" />
        <path d="M9 13h5a2.5 2.5 0 0 1 0 5H9v-5z" />
        <path d="M11 6v2M13 6v2M11 18v-2M13 18v-2" />
      </svg>
    ),
  },
  {
    label: '회원권',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <circle cx="12" cy="10" r="3" />
        <path d="M9 16h6" />
        <path d="M10 19h4" />
      </svg>
    ),
  },
];

const HEX_STEPS = [
  {
    label: '정책 변경',
    colorClass: 'hexDark' as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8M8 11h5" />
      </svg>
    ),
  },
  {
    label: '세율 변경',
    colorClass: 'hexBlue' as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M8 6h8" />
        <path d="M8 10h2M14 10h2" />
        <path d="M8 14h2M14 14h2" />
        <path d="M8 18h8" />
        <circle cx="18" cy="18" r="4" fill="currentColor" fillOpacity="0.15" />
        <path d="m16.5 18 1 1 2-2" />
      </svg>
    ),
  },
  {
    label: '자산 변동',
    colorClass: 'hexNavy' as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M14 12l2-3 2 3M15 12v-3" />
        <rect x="9" y="14" width="4" height="4" rx="0.5" />
      </svg>
    ),
  },
  {
    label: '자녀의 성장',
    colorClass: 'hexRoyal' as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="3" />
        <circle cx="17" cy="9" r="2" />
        <path d="M3 21v-2a6 6 0 0 1 6-6h0" />
        <path d="M13 21v-1a4 4 0 0 1 4-4h0" />
        <path d="M12 2l1 2.5L12 7l-1-2.5L12 2z" />
      </svg>
    ),
  },
];

export default function InheritanceSection() {
  return (
    <section id="inheritance" className={styles.sectionAlt}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>INHERITANCE & GIFT</div>
          <h2 className={styles.sectionTitle}>상속증여</h2>
          <p className={styles.sectionDesc}>
            상속세/증여세 줄이고 싶다면?
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.assetIconGrid}>
            {ASSET_ICONS.map((asset, index) => (
              <div key={index} className={styles.assetIconCard}>
                <span className={styles.assetIconLabel}>{asset.label}</span>
                <div className={styles.assetIconBox}>{asset.icon}</div>
              </div>
            ))}
          </div>

          <div className={styles.policySection}>
            <div className={styles.hexFlow}>
              {HEX_STEPS.map((item, i, arr) => (
                <Fragment key={i}>
                  <div className={styles.hexStep}>
                    <div className={`${styles.hexagon} ${styles[item.colorClass]}`}>
                      {item.icon}
                    </div>
                    <span className={styles.hexLabel}>{item.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={styles.hexConnector}>
                      <span className={styles.hexDot} />
                      <span className={styles.hexDotLine} />
                      <span className={styles.hexDot} />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          <p className={styles.desc}>
            정책 변동, 세율 변경, 자산의 변동과 상속·증여될 자녀의 성장 등<br />
            많은 변화를 고려하여 최적의 세금으로 컨설팅 해드립니다.
          </p>
        </div>
      </div>
    </section>
  );
}
