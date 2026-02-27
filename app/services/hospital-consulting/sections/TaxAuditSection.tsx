import styles from './TaxAuditSection.module.css';

const TAXPAYER_RIGHTS = [
  '공정한 세무조사를 받을 권리',
  '세무서와 소통할 수 있는 절차적 권리',
  '불합리한 세금에 이의를 제기할 권리',
  '과도한 세금이 부과되지 않도록 보호받을 권리',
  '법적으로 알권리와 이의신청, 항소의 권리',
];

const STRATEGIES = [
  { title: '여유시간 확보', desc: '대응 자료 확보를 위한 최대한의 여유시간 확보' },
  { title: '전문가 확보', desc: '기일 대응 및 조정 가능 전문가 확보' },
  { title: '대응정보 확보', desc: '소명 및 항명 관련 정보 수집' },
];

export default function TaxAuditSection() {
  return (
    <section id="tax-audit" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>TAX AUDIT & DIAGNOSIS</div>
          <h2 className={styles.sectionTitle}>세무진단/조사</h2>
          <p className={styles.sectionDesc}>
            국세청으로부터 세무조사 대상으로 통지서를 받으셨다면!
          </p>
        </div>

        <div className={styles.contentBlock}>
          <p className={styles.bodyText}>
            모든 납세자는 납세자 권리헌장에 의해 권리보호를 요청할 수 있습니다.<br />
            세무조사는 복잡하고 전문적인 영역이기에, 전문가의 체계적인 대응이 필수적입니다.
          </p>
        </div>

        <div className={styles.rightsSection}>
          <h3 className={styles.subTitle}>납세자 5대 권리</h3>
          <div className={styles.rightsGrid}>
            {TAXPAYER_RIGHTS.map((title, index) => (
              <div key={index} className={styles.rightCard}>
                <div className={styles.rightNum}>{String(index + 1).padStart(2, '0')}</div>
                <p className={styles.rightText}>{title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.strategySection}>
          <h3 className={styles.subTitle}>스타택스의 대응 전략</h3>
          <div className={styles.strategyGrid}>
            {STRATEGIES.map((strategy, index) => (
              <div key={index} className={styles.strategyCard}>
                <h4 className={styles.strategyCardTitle}>{strategy.title}</h4>
                <p className={styles.strategyCardDesc}>{strategy.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
