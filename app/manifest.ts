export default function manifest() {
  return {
    name: "세무법인 스타택스",
    short_name: "스타택스",
    description: "병의원 전문 세무경영 컨설팅",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0D0D",
    theme_color: "#D4AF7A",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
