import Image from 'next/image';
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
              세무법인 스타택스는 병의원을 전문으로 10년 이상의<br />
              업무경력을 가진 전문가들로 이루어져 있으며, 병의원 개원 이전부터<br />
              경영 전반에 이르는 절세활동에 대한 전문적인 노하우와 풍부한<br />
              실무적 경험들을 가지고 있습니다.
            </p>
            <p>
              세무법인 스타택스는 병의원에서 필요로 하는 경영 적정성 분석과<br />
              이를 위한 컨설팅 서비스를 제공하며, 아울러 제휴를 통해 온라인에서<br />
              세부적인 매입매출부터 경비관리까지 언제 어디서나 확인할 수 있도록 하여<br />
              사각지대 없는 완벽한 관리서비스를 제공하고 있습니다.
            </p>
            <p>
              또한 병의원 전문 세무법인인 만큼 세무 품질 관리를 위한<br />
              체계적인 교육체계를 가지고 있으며 더욱 완벽한 서비스를 제공하기 위해<br />
              언제나 노력할 것입니다.
            </p>
          </div>
          <Image
            src="/assets/used/logo/signature_gold1.png"
            alt="대표세무사 서명"
            width={200}
            height={60}
            className={styles.signature}
          />
        </div>

        <div className={styles.right}>
          <div className={styles.profile}>
            <div className={styles.photoWrapper}>
              <Image
                src="/assets/used/profile/현웅짱_누끼.png"
                alt="윤현웅 대표세무사"
                width={400}
                height={500}
                className={styles.photo}
                priority
              />
              <div className={styles.photoGradient}></div>
            </div>
            <div className={styles.info}>
              <div className={styles.name}>윤현웅</div>
              <div className={styles.title}>대표세무사</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
