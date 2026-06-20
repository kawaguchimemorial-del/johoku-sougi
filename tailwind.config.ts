import type { Config } from "tailwindcss";

// Tailwind CSS v4 ではテーマ定義は app/globals.css の @theme で行っています。
// 本ファイルは content の明示と将来の拡張・互換性のために配置しています。
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
};

export default config;
