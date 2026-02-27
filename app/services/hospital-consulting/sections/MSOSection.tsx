import styles from './MSOSection.module.css';

const MSO_TARGETS = [
  { num: '01', title: '인력 규모', desc: '병의원내 인력이 10인 이상인 경우' },
  { num: '02', title: '고액 부동산', desc: '병원장님 또는 가족이 고액의 부동산 소지 시' },
  { num: '03', title: '별도 사업', desc: '별도의 사업을 추진하고자 할 때' },
  { num: '04', title: '프랜차이즈', desc: '병원 프랜차이즈를 모색하고자 할 때' },
  { num: '05', title: '규모 확장', desc: '병원의 규모를 키우고자 할 때' },
  { num: '06', title: '정책자금 활용', desc: '정책 자금 지원 제도를 활용하고 싶을 때' },
];

export default function MSOSection() {
  return (
    <section id="mso" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.tag}>MSO ESTABLISHMENT</div>
          <h2 className={styles.sectionTitle}>MSO설립/운영</h2>
          <p className={styles.sectionDesc}>
            병의원 절세를 위한 확실한 선택!
          </p>
        </div>

        <div className={styles.contentBlock}>
          <p className={styles.bodyText}>
            병원장님과 가족의 지분으로 설립된, 병의원에 의료행위 및 행정관리에 대한<br />
            각종 서비스를 지원하는 병의원 경영지원 기업입니다.<br />
            MSO를 통해 합법적인 절세와 체계적인 경영 지원이 가능합니다.
          </p>
        </div>

        <div className={styles.msoTargetSection}>
          <h3 className={styles.subTitle}>MSO 검토 대상 병의원</h3>
          <div className={styles.msoGrid}>
            {MSO_TARGETS.map((item, index) => (
              <div key={index} className={styles.msoCard}>
                <div className={styles.msoNum}>{item.num}</div>
                <h4 className={styles.msoCardTitle}>{item.title}</h4>
                <p className={styles.msoCardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
