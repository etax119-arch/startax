import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const logoPath = join(
    process.cwd(),
    "public/assets/used/logo/startax-logo.png"
  );
  const logoData = readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0D0D0D",
        }}
      >
        <img src={logoBase64} width={140} height={147} alt="" />
        <p
          style={{
            marginTop: 32,
            fontSize: 48,
            color: "#D4AF7A",
            fontWeight: 700,
          }}
        >
          세무법인 스타택스
        </p>
      </div>
    ),
    { ...size }
  );
}
