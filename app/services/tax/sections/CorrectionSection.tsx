import styles from './CorrectionSection.module.css';

const REFUND_ITEMS = [
  { label: '잘못된 보험청구', amount: '100~500만원', icon: '01' },
  { label: '세금의 과다납부', amount: '200~300만원', icon: '02' },
  { label: '보험의 청구오류', amount: '100~500만원', icon: '03' },
];

export default function CorrectionSection() {
  return (
    <section id="correction" className={styles.sectionAlt}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>TAX CORRECTION</div>
          <h2 className={styles.sectionTitle}>경정청구</h2>
          <p className={styles.sectionDesc}>
            과다하게 납부한 세금이 있다는 것, 알고 계신가요?
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.info}>
            <p className={styles.text}>
              납세자가 세금을 신고하거나 납부한 후, 잘못된 점이 있거나 과다하게 납부한 경우, 이를 정정하여 환급받기 위해 세무서에 신청하는 것을 말하며 이를 통해 실제로 환급을 받게 되거나 부족세액을 징수하지 않게 됩니다.
            </p>
          </div>

          <div className={styles.refundGrid}>
            <h3 className={styles.refundTitle}>동네 병의원 평균 환급액</h3>
            <div className={styles.refundCards}>
              {REFUND_ITEMS.map((item, index) => (
                <div key={index} className={styles.refundCard}>
                  <div className={styles.refundIcon}>{item.icon}</div>
                  <div className={styles.refundLabel}>{item.label}</div>
                  <div className={styles.refundAmount}>{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
