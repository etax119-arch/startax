import type { Metadata } from 'next';
import ServicePageNav from '../components/ServicePageNav';
import ServiceKeywordNav from '../components/ServiceKeywordNav';
import ServiceCTA from '../components/ServiceCTA';
import TaxAuditSection from './sections/TaxAuditSection';
import WelfareFundSection from './sections/WelfareFundSection';
import MSOSection from './sections/MSOSection';
import WelfareMallSection from './sections/WelfareMallSection';
import VentureDeductionSection from './sections/VentureDeductionSection';
import ResearchCenterSection from './sections/ResearchCenterSection';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '병의원 컨설팅 | 세무법인 스타택스',
  description: '세무진단·조사 대응, 사내근로복지기금, MSO 설립·운영, 복지몰, 벤처투자 소득공제, 기업부설연구소 — 병의원에 특화된 절세·경영 지원 컨설팅을 제공합니다.',
  openGraph: {
    title: '병의원 컨설팅 | 세무법인 스타택스',
    description: '세무진단·조사 대응, 사내근로복지기금, MSO 설립·운영, 복지몰, 벤처투자 소득공제, 기업부설연구소 — 병의원에 특화된 절세·경영 지원 컨설팅을 제공합니다.',
  },
};

const SECTIONS = [
  { id: 'tax-audit', label: '세무진단/조사' },
  { id: 'welfare-fund', label: '사내근로복지기금' },
  { id: 'mso', label: 'MSO설립/운영' },
  { id: 'welfare-mall', label: '복지몰' },
  { id: 'venture', label: '벤처투자 소득공제' },
  { id: 'research', label: '기업부설연구소' },
];

export default function HospitalConsultingPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.tag}>HOSPITAL CONSULTING</div>
          <h1 className={styles.heroTitle}>
            병의원 경영의 든든한 파트너<br />
            <span className={styles.goldText}>전문 컨설팅</span>으로 함께합니다
          </h1>
          <p className={styles.heroDesc}>
            절세부터 경영 지원까지, 병의원에 특화된 원스톱 컨설팅 서비스
          </p>
        </div>
        <ServicePageNav currentPath="/services/hospital-consulting" />
        <ServiceKeywordNav sections={SECTIONS} />
      </section>

      <TaxAuditSection />
      <WelfareFundSection />
      <MSOSection />
      <WelfareMallSection />
      <VentureDeductionSection />
      <ResearchCenterSection />

      <ServiceCTA
        title="병의원 전문 컨설팅이 필요하신가요?"
        description="스타택스의 전문가가 병원장님의 성공적인 경영을 함께합니다"
      />
    </>
  );
}
