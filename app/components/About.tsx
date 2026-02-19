import styles from './About.module.css';

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.tag}>ABOUT STARTAX</div>
          <h2 className={styles.headline}>
            병의원 세무의 본질을 아는<br />
            전문가 집단
          </h2>
          <div className={styles.body}>
            <p>
              세무법인 스타택스는 병의원만의 절세 중심 서비스를 제공하며,<br />
              개원 이전부터 경영 전반에 이르는 전문적 노하우를 축적해 왔습니다.
            </p>
            <p>
              예상과 검증, 검증에 검증을 더한 스타택스만의 시스템으로<br />
              원장님들의 압도적 지지를 받고 있습니다.
            </p>
            <p>
              현재는 병의원을 넘어 법인 컨설팅, 상속·증여, 세무조사 대응까지<br />
              종합 세무 파트너로 성장하고 있습니다.
            </p>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.card}>
            <div className={styles.initial}>Y</div>
            <div className={styles.info}>
              <div className={styles.name}>윤현웅</div>
              <div className={styles.title}>대표세무사</div>
            </div>
            <div className={styles.accent}></div>
          </div>
        </div>
      </div>
    </section>
  );
}