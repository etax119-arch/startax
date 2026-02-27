import ServiceNav from './components/ServiceNav';

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceNav />
      <main id="main-content">{children}</main>
    </>
  );
}
