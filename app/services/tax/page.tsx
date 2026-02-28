import type { Metadata } from 'next';
import ServicePageNav from '../components/ServicePageNav';
import ServiceKeywordNav from '../components/ServiceKeywordNav';
import ServiceCTA from '../components/ServiceCTA';
import BookkeepingSection from './sections/BookkeepingSection';
import CorrectionSection from './sections/CorrectionSection';
import TransferSection from './sections/TransferSection';
import InheritanceSection from './sections/InheritanceSection';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '세무 서비스 | 세무법인 스타택스',
  description: '병의원 세무기장, 경정청구, 양도양수, 상속증여까지 — 스타택스의 10년 이상 경력 세무 전문가가 병원장님의 절세와 안정적인 세무 운영을 원스톱으로 지원합니다.',
  openGraph: {
    title: '세무 서비스 | 세무법인 스타택스',
    description: '병의원 세무기장, 경정청구, 양도양수, 상속증여까지 — 스타택스의 10년 이상 경력 세무 전문가가 병원장님의 절세와 안정적인 세무 운영을 원스톱으로 지원합니다.',
  },
  alternates: { canonical: "https://www.startaxltd.com/services/tax" },
};

const SECTIONS = [
  { id: 'bookkeeping', label: '세무기장 및 운영컨설팅' },
  { id: 'correction', label: '경정청구' },
  { id: 'transfer', label: '양도양수' },
  { id: 'inheritance', label: '상속증여' },
];

export default function TaxServicePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.tag}>TAX SERVICE</div>
          <h1 className={styles.heroTitle}>
            35,996개 병원장님들을 위한<br />
            <span className={styles.goldText}>특별한 세무서비스</span>를 경험해보세요
          </h1>
          <p className={styles.heroDesc}>
            사업과 경영상태가 달라집니다.
          </p>
        </div>
        <ServicePageNav currentPath="/services/tax" />
        <ServiceKeywordNav sections={SECTIONS} defaultSection="bookkeeping" />
      </section>

      <BookkeepingSection />
      <CorrectionSection />
      <TransferSection />
      <InheritanceSection />

      <ServiceCTA
        title="전문 세무 상담이 필요하신가요?"
        description="스타택스의 세무 전문가가 병원장님의 성공적인 경영을 함께합니다"
      />
    </>
  );
}
