import type { Metadata } from "next";
import { Noto_Serif_KR, DM_Sans } from "next/font/google";
import "./globals.css";
import { ConsultationProvider } from "./context/ConsultationContext";

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--font-noto-serif-kr",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.startax.kr"),
  title: "세무법인 스타택스 | 병의원 전문 세무 컨설팅",
  description: "병의원 전문 세무 컨설팅부터 법인·상속·세무조사 대응까지. 10년 이상의 전문가가 원스톱으로 함께합니다.",
  keywords: "세무법인, 스타택스, 병의원 세무, 세무 컨설팅, 법인세, 상속증여, 세무조사",
  openGraph: {
    title: "세무법인 스타택스 | 병의원 전문 세무 컨설팅",
    description: "병의원 전문 세무 컨설팅부터 법인·상속·세무조사 대응까지. 10년 이상의 전문가가 원스톱으로 함께합니다.",
    type: "website",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: "세무법인 스타택스",
  url: "https://www.startax.kr",
  telephone: "02-423-7110",
  email: "etax119@hanmail.net",
  address: {
    "@type": "PostalAddress",
    streetAddress: "아차산로17길 49 생각공장데시앙플렉스 1509~1512호",
    addressLocality: "성동구",
    addressRegion: "서울",
    addressCountry: "KR",
  },
  description:
    "병의원 전문 세무 컨설팅부터 법인·상속·세무조사 대응까지. 10년 이상의 전문가가 원스톱으로 함께합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSerifKr.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-nav">본문 바로가기</a>
        <ConsultationProvider>
          {children}
        </ConsultationProvider>
      </body>
    </html>
  );
}
