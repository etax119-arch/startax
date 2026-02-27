import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          fontWeight: 700,
          color: 'var(--accent-gold)',
          lineHeight: 1,
          marginBottom: '1rem',
          fontFamily: 'var(--font-display)',
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-secondary)',
          marginBottom: '2.5rem',
        }}
      >
        요청하신 페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '0.875rem 2rem',
          background: 'var(--accent-gold)',
          color: 'var(--bg-primary)',
          fontWeight: 600,
          borderRadius: '8px',
          fontSize: '1rem',
          transition: 'opacity 0.3s ease',
        }}
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
