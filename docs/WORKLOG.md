# 作業ログ — WORKLOG

このファイルは「いつ・何を・なぜ変更したか」を時系列で記録する作業履歴です。
**新しい作業をしたら、いちばん上（新しい順）に追記していきます。**
「あのとき何やったっけ？」と振り返るときは、まずこのファイルを読みます。

記録のルール：
- 日付は `YYYY-MM-DD`（実施日）。
- 「何を」「なぜ」「関連ファイル」「あなた側の作業（あれば）」を簡潔に。
- 設定値（ID・トークン等）でコードに無いものは、ここか `docs/` 内に必ず控える。
- commit のハッシュやメッセージも書いておくと後で追いやすい。

---

## 2026-06-22 — 計測・アクセス解析の導入（Search Console / GTM / GA4 / Vercel Analytics）

この日、サイトの計測環境を一通り構築した。コードに無い ID も含めて以下に記録する。

### 1. Google Search Console（所有権確認）
- **方法**: DNS TXT レコード（ドメイン プロパティ）
- **確認トークン**: `google-site-verification=sFGRE5_oHwf9v9Vhu62IQVwuMv0XV1yYUigFe4sJuck`
- **設定場所**: Xserver の DNS レコード（TXT、TTL 3600）。既存の SPF レコード（`v=spf1 ...`）とは**別レコード**として追加。
- **メモ**: SPF を消さずに新規 TXT を追加するのがポイント。コード変更なし。

### 2. Google Tag Manager（GTM）
- **コンテナID**: `GTM-N4G6QFDS`
- **実装**: コードに直書きせず `app/config/site.ts` の `gtmId` で一元管理。
  - `components/GoogleTagManager.tsx`（新規）… head 用 script ＋ body 直後 noscript を出力。`gtmId` が空なら何も出力しない安全実装。
  - `app/layout.tsx` … `<head>` と `<body>` 直後に組み込み（全ページ適用）。
- **commit**: `17508e5 GTM（Google Tag Manager）を全ページに導入`
- **あなた側の作業**: GTM 管理画面で「公開」を押すこと。タグ追加・変更は今後すべて GTM 画面で行う（コード変更不要）。

### 3. Google Analytics 4（GA4）
- **測定ID**: `G-8VK17H3XH7`
- **実装方針**: コードには入れない。**GTM 経由**で「Google タグ」タグ＋「All Pages」トリガーとして設定。
  - 理由: gtag.js を直貼りすると GTM と二重計測になり PV が水増しされるため。
- **このIDの所在**: リポジトリには無い。GTM 管理画面とこのログにのみ存在。

### 4. Vercel Analytics
- **実装**: `@vercel/analytics` を追加し、`app/layout.tsx` に `<Analytics />` を設置（全ページ計測）。
- **commit**: `7d61741 Vercel Analytics を導入`
- **あなた側の作業**: Vercel ダッシュボードの Analytics が「Enabled」か確認。データは Vercel → プロジェクト → Analytics タブに表示。

### 計測まわりの今後の運用メモ
- タグ（GA4 イベント等）の追加・変更は **GTM 管理画面**で行い、最後に必ず「公開」を押す。
- gtag.js やアナリティクスのコードを**サイトに直貼りしない**（二重計測防止）。
- GA4 = 詳細な行動分析、Vercel Analytics = 軽量＋表示速度（Web Vitals）。両方併用で問題なし。

---

## 2026-06-22 — 裏ページ（SEOチェック・非公開）を新設＋title二重バグ修正

### 裏ページ（社内SEOチェック・本人のみ閲覧）
- **URL**: `/seo-x7k2q`（推測しにくいパス。サイトマップ・ナビ・robotsに載せない）
- **保護**: `proxy.ts`（旧middleware）で Basic 認証。パスワードは環境変数 **`SEO_PASS`**。
  - env未設定なら常に401（誤公開防止）。ページ自体も `noindex`。
- **中身**（`app/seo-x7k2q/page.tsx`）:
  1. 社内SEOチェック一覧 … 全ページの title/description 字数・重複・keywords欠落を自動判定（`lib/seoAudit.ts`）
  2. 主要KWの順位記録表 … `data/seoKeywords.ts` に Search Console の平均掲載順位を手入力→表示
  3. キーワード→ページ対応表 … 各ページ keywords を集計しカニバリ（複数ページで同一KW）を検出
  4. Search Console 自動連携 … 未接続。APIサービスアカウント準備後に実装予定（画面に手順表示）
- **あなた側の作業**:
  - Vercel の環境変数に `SEO_PASS`（好きなパスワード）を追加 → 再デプロイ。
  - ローカルで見るなら `.env.local` に `SEO_PASS=...` を記載。
  - 閲覧時はブラウザのBasic認証ダイアログで、ユーザー名は任意・パスワードに `SEO_PASS` の値を入力。
  - 順位は `data/seoKeywords.ts` を編集して記録（commitで反映）。

### ついでに発見・修正したバグ
- 全ページ（トップ以外）で `<title>` のサイト名が**二重**になっていた（例:「…の相談｜城北セレモニーサポートセンター｜城北セレモニーサポートセンター」）。
- 原因: `lib/seo.ts` の `buildMetadata` がサイト名込みの文字列を返し、`layout.tsx` の `title.template` が再度サイト名を付与していた。
- 修正: `buildMetadata` を `title: { absolute: fullTitle }` に変更（template の二重付与を回避）。ビルド済みHTMLで単一表示を確認済み。

### その他
- Next 16 の警告対応で `middleware.ts` を `proxy.ts` にリネーム（関数も `export default function proxy`）。

---

## 2026-06-22 — 裏ページの判定（⚠）を解消するSEO修正

裏ページ `/seo-x7k2q` の判定で出ていた警告を修正。

### title が長い（67件）→ 解消
- 原因: `<title>` 末尾の社名「｜城北セレモニーサポートセンター」（16字）。説明部分自体は25〜32字で適正だった。
- 修正: `lib/seo.ts` の `buildMetadata` で **`<title>` から社名を外した**（トップページのみ社名入り）。
  - 社名は **OG/Twitter タイトル・H1・ヘッダー**には残すのでブランドは保持（`socialTitle` を別に用意）。
  - `lib/seoAudit.ts` の `fullTitle` も実際の `<title>`（社名なし）に合わせて更新。
- 結果: 全ページ title ≤ 35字。

### description が長い（5件）→ 解消
- `data/columns.ts` の以下を120字以内に短縮：funeral-flow / funeral-cost-guide / toda-saijo-guide / 区民葬(kumin-sou) / toda-saijo-access。
- 戸田斎場・区民葬ページは「公式施設サイトではない／指定葬儀社ではない」注記を残したまま短縮。

### カニバリ検出の誤検出を修正
- コラムの `keywords` は「絞り込みタグ（費用・マナー等）」でSEOの狙いKWではないため、カニバリ検出の対象から除外。
- 斎場・プラン・エリアの狙いKWだけで重複を見るように `app/seo-x7k2q/page.tsx` を変更。

### 補足（未対応・意図的）
- 「description が短い（・印）」は警告ではなく情報レベル（60〜79字でSEO上は許容）。今回は変更せず。必要なら個別に加筆可能。
- title は OG/H1 等にブランドが残るため、`<title>` から社名を外す方針とした。`<title>` にも短いブランドを入れたい場合は別途調整可能。

---

## （ここから上に新しい作業を追記）
