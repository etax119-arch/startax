import type { Metadata } from 'next';
import ServicePageNav from '../components/ServicePageNav';
import ServiceKeywordNav from '../components/ServiceKeywordNav';
import ServiceCTA from '../components/ServiceCTA';
import VentureSection from './sections/venture/VentureSection';
import TreasuryStockSection from './sections/treasury-stock/TreasuryStockSection';
import SuccessionSection from './sections/succession/SuccessionSection';
import IncorporationSection from './sections/incorporation/IncorporationSection';
import RealEstateSection from './sections/realestate/RealEstateSection';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: '경영 컨설팅 | 세무법인 스타택스',
  description: '벤처기업 인증, 자기주식 처분, 가업승계, 법인전환, 부동산·재무 컨설팅 등 병의원 경영 전문 컨설팅을 제공합니다.',
  openGraph: {
    title: '경영 컨설팅 | 세무법인 스타택스',
    description: '벤처기업 인증, 자기주식 처분, 가업승계, 법인전환, 부동산·재무 컨설팅 등 병의원 경영 전문 컨설팅을 제공합니다.',
  },
};

const SECTIONS = [
  { id: 'venture', label: '벤처기업 인증' },
  { id: 'treasury-stock', label: '자기주식 처분' },
  { id: 'succession', label: '가업승계' },
  { id: 'incorporation', label: '법인전환' },
  { id: 'realestate', label: '부동산/재무컨설팅' },
];

export default function ConsultingPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.tag}>BUSINESS CONSULTING</div>
          <h1 className={styles.heroTitle}>
            35,996개 병원장님들을 위한<br />
            <span className={styles.goldText}>경영 컨설팅</span>을 경험해보세요
          </h1>
          <p className={styles.heroDesc}>
            사업과 경영상태가 달라집니다.
          </p>
        </div>
        <ServicePageNav currentPath="/services/consulting" />
        <ServiceKeywordNav sections={SECTIONS} />
      </section>

      <VentureSection />
      <TreasuryStockSection />
      <SuccessionSection />
      <IncorporationSection />
      <RealEstateSection />

      <ServiceCTA
        title="경영 컨설팅이 필요하신가요?"
        description="스타택스의 전문가가 기업의 성장과 안정적인 경영을 함께합니다"
      />
    </>
  );
}
