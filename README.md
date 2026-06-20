# 城北セレモニーサポートセンター

北区・板橋区で、戸田斎場を中心に一日葬・火葬式・直葬・家族葬をご検討の方へ向けた、葬儀相談窓口サイトです。

- **サイト名**：城北セレモニーサポートセンター
- **運営・施行**：川口典礼
- **電話**：0120-963-765（24時間365日受付・ご相談お見積り無料）
- **本番URL（想定）**：https://johoku-sougi.jp/

> 本サイトは、戸田斎場・舟渡斎場・北区セレモニーホール・蓮根レインボーホール等の **公式施設サイトではありません**。運営・施行は川口典礼です。

## サイトの目的

北区・板橋区の方が、戸田斎場をはじめとする斎場を利用してご葬儀を行う際の相談窓口です。
川口典礼の本体サイト（川口市エリア／めぐりの森・川口メモリアルホール等）とは役割を分け、
北区・板橋区および各斎場名の検索意図を受け止めます。詳細は `docs/SITE_STRATEGY.md`。

## 技術構成

- **Next.js 16**（App Router）
- **TypeScript**
- **Tailwind CSS v4**（テーマは `app/globals.css` の `@theme`）
- 静的生成（SSG）中心
- **Vercel** へのデプロイを前提（Framework Preset: Next.js / Root Directory: `./`）

## 主要URL

| URL | 内容 |
|---|---|
| `/` | トップ |
| `/area/kita-ku/` | 北区の葬儀相談 |
| `/area/itabashi-ku/` | 板橋区の葬儀相談 |
| `/hall/` | 対応斎場一覧 |
| `/hall/toda-saijo/` | 戸田斎場 |
| `/hall/renkon-rainbow-hall/` | 蓮根レインボーホール |
| `/hall/kita-ceremony-hall/` | 北区セレモニーホール |
| `/hall/funado-saijo/` | 舟渡斎場 |
| `/plan/one-day-funeral/` | 一日葬 |
| `/plan/direct-funeral/` | 火葬式・直葬 |
| `/plan/family-funeral/` | 家族葬 |
| `/faq/` | よくある質問 |
| `/company/` | 運営者情報 |
| `/contact/` | ご相談・お見積り |
| `/privacy/` | プライバシーポリシー |

## 開発コマンド

```bash
npm install      # 依存関係のインストール
npm run dev      # 開発サーバー（http://localhost:3000）
npm run build    # 本番ビルド
npm run start    # 本番ビルドの起動
npm run lint     # ESLint
```

## ディレクトリ構成（主要）

```
app/                 # App Router（各ページ・layout・sitemap・robots）
  config/site.ts     # サイト共通設定（社名・電話番号・注記・CTA文言）
data/                # halls / plans / areas / faqs のデータ
components/          # 共通UI（Header / Footer / MobileFixedCTA など）
lib/                 # seo.ts（metadata生成）/ jsonld.ts（構造化データ）
public/images/       # hero / hall / plan 画像の配置先
docs/                # サイト戦略・デザイン・コピー・SEO/AIOガイド
```

## Vercel デプロイ前提

- リポジトリ直下に `package.json` / `app/` / `next.config.ts` / `tsconfig.json` / `public/` が存在し、
  Vercel が **Framework Preset: Next.js** として自動認識できる構成です。
- **Root Directory**：`./`
- **Build Command**：自動（`npm run build`）
- **Install Command**：自動（`npm install`）
- **Output Directory**：空欄（自動 / `.next` を手動指定しない）
- `vercel.json` は `framework: nextjs` を明示するのみで、自動検出を妨げません。

## 運用上の注意

- 価格は必ず「目安」「税込」「内容により変動」「個別見積り」を併記する（`components/PriceNote.tsx`）。
- 「最安・必ず・No.1・公式・公認」等の禁止表現を使わない（`docs/COPYWRITING_GUIDE.md`）。
- 全ページで「運営・施行：川口典礼」「公式施設サイトではない」旨を明記する。
- 存在しない住所・営業所を作らない。北区・板橋区に実店舗があるように見せない。
- 文言・電話番号は `app/config/site.ts` で一元管理し、直書きしない。
