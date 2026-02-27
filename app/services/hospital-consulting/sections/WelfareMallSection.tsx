import styles from './WelfareMallSection.module.css';

const WELFARE_FEATURES = ['명절 선물 간편 배송', '선택적 복지 포인트', '다양한 제휴 혜택', '비용 처리 간소화'];

export default function WelfareMallSection() {
  return (
    <section id="welfare-mall" className={styles.sectionAlt}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>WELFARE MALL</div>
          <h2 className={styles.sectionTitle}>복지몰</h2>
          <p className={styles.sectionDesc}>
            이제 무겁게 선물을 들고가는 명절을 좋아하지 않아요
          </p>
        </div>

        <div className={styles.welfareMallContent}>
          <div className={styles.welfareMallCard}>
            <h3 className={styles.welfareMallTitle}>선택적 복지서비스</h3>
            <p className={styles.welfareMallDesc}>
              병의원도 중소기업에서도 대기업과 동일하게 선택적 복지서비스인<br />
              복지몰 서비스를 운영할 수 있습니다.
              직원들에게 다양한 복지 혜택을 제공하며, 기업은 비용 절감과 세제 혜택을 동시에 누릴 수 있습니다.
            </p>
            <div className={styles.welfareMallFeatures}>
              {WELFARE_FEATURES.map((feature, index) => (
                <div key={index} className={styles.welfareMallFeature}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
