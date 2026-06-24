import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/config/site";

// 既定のOG画像（画像未指定のページすべてに自動適用される）。
// Next.js のファイル規約により og:image / twitter:image を生成する。
export const alt = `${siteConfig.name}｜北区・板橋区の葬儀相談窓口`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const heading = siteConfig.name;
const sub = "北区・板橋区の葬儀相談窓口";
const operator = `運営・施行：${siteConfig.operator}`;
const tel = siteConfig.tel;

// OG画像内で使う日本語を含む全文字をサブセット取得し、軽量にフォント読み込み。
async function loadJpFont(text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(
    text,
  )}`;
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype|woff2?)'\)/);
  if (!src) throw new Error("OGフォントのURL抽出に失敗");
  const res = await fetch(src[1]);
  if (!res.ok) throw new Error("OGフォントの取得に失敗");
  return res.arrayBuffer();
}

export default async function Image() {
  const fontData = await loadJpFont(heading + sub + operator + tel + alt + "｜・：");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#1b2a4a",
          color: "#ffffff",
          fontFamily: "Noto Sans JP",
        }}
      >
        <div style={{ width: 96, height: 6, backgroundColor: "#c8a45c", marginBottom: 36 }} />
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.25 }}>{heading}</div>
        <div style={{ fontSize: 40, color: "#dfe5ef", marginTop: 24 }}>{sub}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "auto",
            fontSize: 30,
            color: "#c8a45c",
          }}
        >
          <span>{operator}</span>
          <span>{tel}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Noto Sans JP", data: fontData, weight: 700, style: "normal" }],
    },
  );
}
