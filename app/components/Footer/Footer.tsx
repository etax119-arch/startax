'use client';

import styles from './Footer.module.css';
import { useConsultation } from '../../context/ConsultationContext';

export default function Footer() {
  const { openModal } = useConsultation();

  return (
    <footer className={styles.footer}>
      <div className={styles.cta}>
        <h2 className={styles.ctaHeadline}>세무 고민, 지금 바로 상담하세요.</h2>
        <button onClick={openModal} className={styles.ctaButton}>
          전문가 상담 신청하기
        </button>
        <div className={styles.ctaPhone}>또는 전화: 02-423-7110</div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.left}>
              <div className={styles.logo}>
                <span className={styles.logoMain}>STARTAX</span>
                <span className={styles.logoSub}>세무법인 스타택스</span>
              </div>
              <div className={styles.info}>
                <p>대표: 윤현웅 | 사업자등록번호: 154-81-02264</p>
                <p>서울 성동구 아차산로17길 49 생각공장데시앙플렉스 1509~1512호</p>
                <p>전화: 02-423-7110 | 팩스: 02-414-7222</p>
                <p>이메일: etax119@hanmail.net</p>
                <p>운영시간: 평일 09:00~17:30</p>
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.links}>
                <a
                  href="https://www.youtube.com/@startaxaccounting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  YouTube
                </a>
                <a
                  href="https://blog.naver.com/startax_medi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Blog
                </a>
              </div>
            </div>
          </div>

          <div className={styles.bottom}>
            <p>© {new Date().getFullYear()} STARTAX Tax Accounting Corporation. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}