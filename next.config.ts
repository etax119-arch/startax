import type { NextConfig } from "next";

// Supabase Storage 호스트는 NEXT_PUBLIC_SUPABASE_URL 에서 파생합니다.
// 빌드 환경에 값이 없으면 크래시 대신 패턴을 생략합니다 (이미지가 로드되지 않으므로
// 배포 전에 반드시 환경변수를 설정하세요).
const supabaseHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: 'https' as const,
              hostname: supabaseHost,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
      // youtubeThumbnailUrl() 이 만드는 유일한 호스트입니다.
      { protocol: 'https' as const, hostname: 'i.ytimg.com', pathname: '/vi/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
