import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "세무법인 스타택스 | 병의원 전문 세무 컨설팅",
  description: "병의원 전문 세무 컨설팅부터 법인·상속·세무조사 대응까지. 10년 이상의 전문가가 원스톱으로 함께합니다.",
  keywords: "세무법인, 스타택스, 병의원 세무, 세무 컨설팅, 법인세, 상속증여, 세무조사",
  openGraph: {
    title: "세무법인 스타택스 | 병의원 전문 세무 컨설팅",
    description: "병의원 전문 세무 컨설팅부터 법인·상속·세무조사 대응까지. 10년 이상의 전문가가 원스톱으로 함께합니다.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600;700;900&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
