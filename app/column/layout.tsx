import type { ReactNode } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function ColumnLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* 다크 히어로가 없는 페이지라 네비게이션을 처음부터 불투명하게 표시합니다. */}
      <Navigation solid />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
