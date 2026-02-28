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
  metadataBase: new URL("https://www.startaxltd.com"),
  title: "세무법인 스타택스",
  description: "병원의 성장 뒤에는 스타택스가 있습니다! 병의원 전문 세무경영 컨설팅부터 법인·상속·경정청구 등 10년 이상의 전문가들과 원스톱으로 함께합니다.",
  keywords: "스타택스, 세무법인, 병원절세, 병원세무사, 병의원 세무사, 병원 컨설팅, 병원 세무법인, 법인 병원",
  openGraph: {
    title: "세무법인 스타택스",
    description: "병원의 성장 뒤에는 스타택스가 있습니다! 병의원 전문 세무경영 컨설팅부터 법인·상속·경정청구 등 10년 이상의 전문가들과 원스톱으로 함께합니다.",
    type: "website",
    url: "https://www.startaxltd.com",
    locale: "ko_KR",
    siteName: "세무법인 스타택스",
  },
  twitter: {
    card: "summary_large_image",
    title: "세무법인 스타택스",
    description: "병원의 성장 뒤에는 스타택스가 있습니다! 병의원 전문 세무경영 컨설팅부터 법인·상속·경정청구 등 10년 이상의 전문가들과 원스톱으로 함께합니다.",
  },
  alternates: {
    canonical: "https://www.startaxltd.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: "세무법인 스타택스",
  url: "https://www.startaxltd.com",
  logo: "https://www.startaxltd.com/assets/used/logo/startax_logo.png",
  image: "https://www.startaxltd.com/opengraph-image",
  telephone: "02-423-7110",
  email: "etax119@hanmail.net",
  address: {
    "@type": "PostalAddress",
    streetAddress: "아차산로17길 49 생각공장데시앙플렉스 1509~1512호",
    addressLocality: "성동구",
    addressRegion: "서울",
    postalCode: "04782",
    addressCountry: "KR",
  },
  description:
    "병원의 성장 뒤에는 스타택스가 있습니다! 병의원 전문 세무경영 컨설팅부터 법인·상속·경정청구 등 10년 이상의 전문가들과 원스톱으로 함께합니다.",
  areaServed: {
    "@type": "Country",
    name: "KR",
  },
  priceRange: "$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [
    "https://blog.naver.com/etax119",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSerifKr.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <meta name="naver-site-verification" content="navera0ce0e11369b7cf64e2efe139ad39aa1" />
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
