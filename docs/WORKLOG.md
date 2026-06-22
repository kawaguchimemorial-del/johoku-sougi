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

## （ここから上に新しい作業を追記）
