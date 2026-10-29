import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // CSS（約48KB）を <head> に埋め込み、外部CSSの読み込み待ちで表示が遅れるのを防ぐ（PSIでFCP/LCPを3秒以上押し下げていた）
  experimental: {
    inlineCss: true,
  },
  images: {
    // AVIF を優先し、スマホ中心のサイトなので最大幅は 1920 までに抑える
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // quality={55} などページ側で指定する値を許可
    qualities: [55, 75],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
