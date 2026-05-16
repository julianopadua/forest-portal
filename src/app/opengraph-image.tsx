import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Instituto Forest";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND_BG = "#1d4432";
const LOGO_PATH = join(process.cwd(), "public/images/logos/002-wbig-logo.png");

export default async function OpenGraphImage() {
  const logoBytes = await readFile(LOGO_PATH);
  const logoSrc = `data:image/png;base64,${logoBytes.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BRAND_BG,
        }}
      >
        <img
          src={logoSrc}
          alt=""
          width={920}
          height={266}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size },
  );
}
