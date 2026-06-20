# デザインシステム — DESIGN_SYSTEM

葬儀サイトとして信頼されることを最優先に、上品・落ち着き・安心感を軸にする。
実装は Tailwind CSS v4。テーマトークンは `app/globals.css` の `@theme` に定義。

## 1. 色（カラートークン）

| トークン | 値 | 用途 |
|---|---|---|
| `navy` | `#1b2a4a` | 基調色。ヘッダー・CTA帯・見出し |
| `navy-dark` | `#131f38` | フッター・FVグラデ下端 |
| `navy-light` | `#2c4170` | FVグラデ上端・補助 |
| `gold` | `#b08d4f` | アクセント。ボタン・チェック・強調 |
| `gold-light` | `#c9a96a` | 紺背景上の金テキスト |
| `cream` | `#f7f4ee` | 生成りの背景（セクション交互） |
| `ink` | `#232323` | 本文テキスト |
| `muted` | `#5d6470` | 補足テキスト |

- 白 → cream → 白 のセクション交互で、落ち着いたリズムを作る。
- 金は「差し色」。多用しない。価格やCTAなど要所のみ。

## 2. 余白・レイアウト

- コンテナ最大幅：`max-w-5xl`、左右パディング `px-5 sm:px-6`（`components/Container.tsx`）。
- セクション縦余白：`py-12`〜`py-14`。
- スマホは固定CTA分、`body` に `padding-bottom` を確保（`globals.css`）。

## 3. フォントサイズ

- 本文：基本 16px、`line-height: 1.8`（和文の可読性重視）。
- H1：`text-2xl sm:text-3xl/4xl`、H2：`text-xl sm:text-2xl`。
- 補足・注記：`text-xs` 〜 `text-sm`、色は `muted`。
- フォントは Hiragino / Noto Sans JP / Meiryo 系のサンセリフを優先。

## 4. ボタン

- **電話CTA（最優先）**：金背景 `bg-gold`／白文字、電話番号を大きく（`text-2xl sm:text-3xl`）。`components/CallButton.tsx`。
- **副CTA**：紺の枠線ボタン、または白背景＋紺文字。
- 角丸 `rounded-lg`、影 `shadow-md`、ホバーで `opacity-90`。
- ラベルは「今すぐ申込」ではなく「まずは相談」「空き確認」「見積り相談」。

## 5. カード

- `rounded-xl border border-black/5 bg-white p-6 shadow-sm`。
- ホバー：`hover:border-gold/40 hover:shadow-md`。
- プラン／斎場／お悩み／流れはカードで一覧化し、視認性を高める。

## 6. FV（ファーストビュー）

- 紺グラデーション（`from-navy-dark to-navy-light`）＋白文字。
- 構成：ラベル（北区・板橋区の葬儀相談窓口）→ H1（顧客不安に直結）→ リード → 運営・施行：川口典礼 → 電話CTA＋副CTA →「戸田斎場で考えているとお電話ください」。
- H1 は検索意図と不安に直結。煽らない。

## 7. CTA設計

- ページ下部に共通の相談CTA帯（`components/CtaSection.tsx`、紺背景）。
- 訴求：24時間365日受付／ご相談お見積り無料／空き確認／搬送／安置相談／見積り。
- 強い営業トーンを出さず、「まず相談」の姿勢を保つ。

## 8. モバイル固定CTA

- `components/MobileFixedCTA.tsx`。画面下部に固定、`md` 以上で非表示。
- 2分割：左＝電話（金背景・最優先）、右＝相談・見積り（紺背景・`/contact/`）。

## 9. NGデザイン

- 派手な価格バナー／安売り感／過度な煽り。
- ポータルサイト風の価格訴求だけのレイアウト。
- 公共機関・公式施設に見える配色や紋章的表現。
- 価格を主役にしすぎる構成（必ず注記と「相談で整理できる」を添える）。
