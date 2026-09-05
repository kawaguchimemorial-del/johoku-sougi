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

## 2026-09-06 — 順位押し上げ仕様書を実装（プラン・エリアページ強化／カニバリ解消／市民葬対応）

**何を**: `docs/SEO_RANKING_SPEC_2026-09.md` の §2 の順序で実装。

1. **データモデル拡張**: `data/content.ts` を新設（`ContentSection` / `ContentTable` / `ContentLink`）。`Plan` に `sections` / `areaNotes` / `faq` / `relatedColumns` / `metaTitle` / `metaDescription` / `h1` を、`Area` に `sections` / `faq` / `relatedColumns` を追加。本文はデータ側、page.tsx は描画のみという既存方針を維持。描画は `components/ContentSections.tsx` / `FaqBlock.tsx` / `RelatedColumns.tsx` を新設して共通化。
2. **一日葬（P1）**: title を「北区・板橋区の一日葬｜流れ・費用目安・戸田斎場での進め方」、H1 を「北区・板橋区の一日葬」に変更。本文6セクション（とは／当日の流れ表／費用の内訳表／向き不向き／注意点／他形式比較表）＋区別セクション3（北区・板橋区・足立区）＋FAQ6問を追加。
3. **火葬式・直葬（P2）**: title/H1 を地域語つきに変更。本文6セクション（直葬・火葬式・密葬の違い／流れ／費用／後悔しやすい点／利用しやすい火葬場／比較表）＋区別3＋FAQ6問。
4. **エリアページ（P3）**: 北区・板橋区に `metaTitle` を個別設定（従来は戸田斎場固定の既定文）。H1 を「◯区の葬儀・葬式のご相談」に変更。本文7セクション（全体像表／通夜・告別式の流れ／斎場・火葬場比較表／費用の4区分表／形式の選び方＋クエリ語アンカー／区民葬・葬祭費／相談が多い地域）＋FAQ6問。足立区も4セクション＋FAQ5問を追加。
5. **区民葬コラム（P4）**: title を「区民葬（市民葬）とは…」に変更。lead に呼称（23区=区民葬／市部=市民葬、板橋区は区民葬儀）の説明を追加。「北区の区民葬・板橋区の区民葬儀（市民葬）」セクションとFAQ2問（市民葬との違い／板橋区の対象）を追加。`keywords` に市民葬・区民葬儀を追加。
6. **家族葬（P5）**: 同じ型で本文6セクション＋区別3＋FAQ6問。
7. **横断**: `organizationLd` / `serviceLd` の `areaServed` を `siteConfig.areas` 由来に変更し**足立区を追加**（従来は北区・板橋区のみで設定と不一致）。`serviceLd` は `areaServed` を上書き可能にし、プランページは `areaNotes` から生成。プラン・エリアページに FAQPage 構造化データを追加。`Column` に `relatedAreas` を追加し、コラム→エリアページの導線を新設。トップの対応エリアを `areas` 駆動にして足立区を追加（従来はハードコードで2区のみ）。`lib/seoAudit.ts` のプラン title/description をページ実体と同じ `planTitle` / `planDescription` 参照に変更（裏ページの監査値とのズレ防止）。
8. **計測**: `data/seoKeywords.ts` を直近28日（2026-08-05〜09-02）の実測に更新し、担当ページを整理（33KW）。

**なぜ**: 表示回数は伸びている（2,992／前期2,146）のにクリックが1件で、関連KWの10位以内が0件だった。原因はプラン・エリアページが薄く（本文3段落）、Googleが当てている「北区 通夜」「北区 火葬場」等に答えるセクションが無かったこと、および1つのKWに複数ページが出るカニバリ（「北区 直葬」で担当外の /area/kita-ku/ が担当 /plan/direct-funeral/ に勝っていた）。エリアページは「その区の全体像」、プランページは「形式の詳細」と役割を分け、クエリ語入りアンカーで評価を担当ページへ寄せた。

**カニバリ解消の考え方**: エリアページでは形式の詳細を書かず、比較表＋「◯区の一日葬について」「◯区の火葬式・直葬について」というクエリ語アンカーでプランページへ送る。逆にプランページは区別セクションで「◯区から一日葬を行う場合」を持ち、地域KWに直接答える。

**書かなかったこと（意図的）**: 新規ページの量産（sitemap は 81URL のまま）、自由葬の専用ページ、戸田斎場の施設料金の数値（出典が確認できないため。町屋斎場のみ公表値を掲載済み）、`offers` スキーマ、他社斎場名クエリ（ノイズ）への対応。所要時間・距離は断定せず「目安」表記とお電話でのご案内に留めた。

**関連ファイル**: `data/content.ts`（新規）, `components/ContentSections.tsx`（新規）, `components/FaqBlock.tsx`（新規）, `components/RelatedColumns.tsx`（新規）, `data/plans.ts`, `data/areas.ts`, `data/columns.ts`, `data/seoKeywords.ts`, `lib/jsonld.ts`, `lib/seoAudit.ts`, `app/plan/[plan]/page.tsx`, `app/area/[area]/page.tsx`, `app/column/[slug]/page.tsx`, `app/page.tsx`。

**確認**: `npx tsc --noEmit` エラーなし。`npm run build` 成功（83ページ生成）、`npm run lint` エラーなし。**title 重複0件**。sitemap は 81URL のまま（新規ページなし）。本番ビルドをローカル起動して検証：対象7ページで H2 が10〜13、FAQPage 構造化データあり、本文字数が約1,000〜1,500字→4,500〜6,200字。禁止語（最安・激安・必ず・絶対・追加費用なし・No.1・どこよりも安い・公式・公認・区民のみ）の新規混入なし。価格表示箇所には `PriceNote`／表の注記を併記、斎場セクション直下に `disclaimer` を表示。

**あなた側の作業**: Search Console で以下のインデックス再登録（URL検査→インデックス登録をリクエスト）をすると反映が早まります。
- `/plan/one-day-funeral/` `/plan/direct-funeral/` `/plan/family-funeral/`
- `/area/kita-ku/` `/area/itabashi-ku/` `/area/adachi-ku/`
- `/column/kumin-sou/`

**次の判定**: 2週間後・4週間後に「北区 一日葬」「板橋区 一日葬」が10位以内に入るかを確認（仕様書 §10.3）。入らない場合は区別セクションの独立記事化を検討。

## 2026-09-06 — SEO現状チェック＋順位押し上げ仕様書を作成（コード変更なし）

**何を**: Search Console 実測（直近28日 8/05〜9/02）と本番サイトの実地確認で現状を診断し、`docs/SEO_RANKING_SPEC_2026-09.md` に実装仕様書を作成。実装は別セッション（Opus）が本仕様書を読んで行う。

**診断結果**: 表示2,992（前期2,146）・クリック1・平均順位40.9。技術面（www統一・sitemap 81URL全200・canonical・JSON-LD・robots・llms.txt）は異常なし。関連KWで10位以内は0件。「北区 一日葬」「板橋区 一日葬」が17位前後で最も1ページ目に近い。「北区 直葬」で担当外の /area/kita-ku/ が担当 /plan/direct-funeral/ に勝つカニバリあり。プラン・エリアページが薄い（本文3段落）ことが主因。表示の約2割は他社斎場名のノイズ（無視）。

**仕様書の骨子**: Plan/Area 型に sections・areaNotes・faq を追加 → 一日葬（P1）→ 直葬（P2）→ 北区・板橋区エリアページ（P3）→ 区民葬コラムに「市民葬」対応（P4）→ 家族葬（P5）。areaServed に足立区追加、クエリ語アンカーで内部リンク、seoKeywords.ts のスナップショット更新。新規ページは作らない。

**関連ファイル**: `docs/SEO_RANKING_SPEC_2026-09.md`（新規）。

**あなた側の作業**: なし（実装後に SC でインデックス再登録を依頼する予定）。

## 2026-07-27 — 足立区エリア＋町屋斎場ページを新設（施設料金つき）

**何を**:
- `data/halls.ts` に **町屋斎場**（`/hall/machiya-saijo/`）を追加。所在地・アクセス・施設構成に加え、**公表されている施設料金（火葬料金／式場使用料／休憩室／保棺）を表で掲載**。
- `data/areas.ts` に **足立区**（`/area/adachi-ku/`）を追加。町屋斎場を主軸にした内容。
- 型を拡張：Hall に `address` / `access` / `parking` / `facilities` / `fees` / `feeSource` / `serviceAreaNote` / `relatedAreas` を追加。`image` / `altar` を**任意**にし、写真が無い斎場でも他斎場の写真を流用せずレイアウトが崩れないようにした（カードは施設名プレースホルダ表示）。
- Area に `metaTitle` / `metaDescription` / `heroLead` / `featuredNote` を追加。エリアページの title/description/リード文が「戸田斎場」固定だったのを**データ駆動**に変更（既定は従来どおり戸田斎場軸）。`lib/seoAudit.ts` も同じ関数（`areaTitle` / `areaDescription`）を参照するようにして裏ページの監査値とページ実体のズレを防止。
- ヘッダー／フッターに足立区（＋フッターに町屋斎場）を追加。`siteConfig.areas` に東京都足立区を追加。`disclaimer` に町屋斎場を明記（公式施設サイトではない旨）。
- 斎場一覧ページの title/description を更新（戸田斎場・町屋斎場・舟渡斎場ほか／北区・板橋区・足立区）。
- `data/seoKeywords.ts` に足立区・町屋斎場の追跡KWを5件追加（実測はこれから）。
- sitemap / llms.txt はデータ駆動のため自動反映（88ページ生成を確認）。

**なぜ**: 足立区を対応エリアに追加するため。足立区は町屋斎場をメインとする方針のため、斎場ページを新設し、エリアページの主斎場を戸田斎場から町屋斎場へ切り替えられる構造にした。「町屋斎場 料金」は検索需要が見込めるため、公表料金を出典・確認日つきで掲載した。

**料金の出典**: 東京博善「町屋斎場 施設利用料金」 https://www.tokyohakuzen.co.jp/guide/ryokin/?hall=machiya （2026-07-27 時点の公表値）。火葬：普通炉 大人87,000／小人50,000、減額・公費 大人39,000／小人21,000、特別室 大人123,000／小人63,500、特別殯館 大人160,000／小人88,000、火葬証明書550円。式場：一体型「旅」242,000／専用控室有り「雪」275,000。休憩室：鶴74,800／星40,700／月34,100／梅19,800。保棺：冷蔵13,200・一般8,800（各1日、減額・公費は5,830／2,750）。**料金改定時はここと `data/halls.ts` の `fees` を更新すること。**

**注意（地理）**: 町屋斎場の所在地は**荒川区**であり足立区内ではない。足立区から利用しやすい斎場として案内する書き方に統一している（足立区内に施設があるように書かない）。

**関連ファイル**: `data/halls.ts`, `data/areas.ts`, `data/seoKeywords.ts`, `app/hall/[hall]/page.tsx`, `app/area/[area]/page.tsx`, `app/hall/page.tsx`, `app/config/site.ts`, `components/HallCard.tsx`, `components/Header.tsx`, `components/Footer.tsx`, `lib/seoAudit.ts`。

**確認**: `npm run build` 成功（/area/adachi-ku・/hall/machiya-saijo 生成）、`npm run lint` エラーなし。

**あなた側の作業**:
- 町屋斎場の**外観写真・祭壇写真**があれば `public/images/hall/machiya-saijo/` に置いてください（`exterior.*` / `altar.*`）。追加後にデータ側へパスを設定します。現状は写真なしでも表示されます。
- Search Console で `/area/adachi-ku/` `/hall/machiya-saijo/` のインデックス登録をリクエストすると露出が早まります。

## 2026-07-10 — 追跡キーワードを実クエリベースに刷新＋SC健全性の確認

**何を**: `data/seoKeywords.ts` を、Search Console で実際に検索されているクエリに合わせて全面更新（14→22件）。各KWに直近28日（6/09〜7/07）のSC実測スナップショット（position/impressions/updated）を付与。

**なぜ**: 旧リストは「戸田斎場 葬儀」等、実際には検索されていない言い回しで、裏ページで実測が乗らなかった。実クエリ（北区 一日葬／板橋区 一日葬／北区 直葬／板橋区 葬儀 相談／戸田 斎場／舟渡斎場 等）に置き換え、突合の空白正規化と合わせて実測が正しく表示されるようにした。スナップショットを入れたので env 未接続でも直近値が表示される。

**SC健全性の確認（サービスアカウントで直接取得）**: 全体 表示982・クリック5・平均順位53.4。週次は 6/17週51→6/24週509→7/01週422 と立ち上がり、順位も57→48へ改善。クエリは地域×葬儀の意図と一致。**新規サイト（露出開始6月中旬）として正常・健全**と判定。異常なし。戸田斎場等の斎場ページはインデックス済みだが低露出（伸びしろ）。www/non-www重複は表示比5.1%で軽微。

**関連ファイル**: `data/seoKeywords.ts`。

**確認**: `npm run build` 成功。

**あなた側の作業**: 前項（2026-07-09）の Vercel 環境変数登録が本番に効けば、この表が「SC実測（緑）」で自動更新される。効くまではスナップショット値が表示される。

## 2026-07-09 — 裏ページ 平均掲載順位が「—」になる原因の解析と修正

**何を**: `/seo-x7k2q` セクション2（主要KW順位記録表）で平均掲載順位・表示回数などが「—」になる件を、2観点で解析し修正。

原因は2層だった（2専門家レビューで確認）:
1. **本番env未設定（最有力・あなた側作業）**: SC自体はサービスアカウント（`sc-reader@johoku-sougi-seo.iam.gserviceaccount.com` / プロパティ `sc-domain:johoku-sougi.jp`）で正常にデータを返す（ローカル検証で全体 imp902・平均順位54.7）。しかし Next.js は `process.env` を読むため、`~/.config/claude-seo`（Python用）ではなく **Vercel本番の環境変数**に `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY` が必要。未登録だとセクション4は「未接続ボックス」、セクション2は全「—」になる。
2. **結合ロジック（コード修正済み）**: セクション2は手入力KWとSC実測を **完全一致** で突合していた。手入力14件は position 未入力のため、未ヒット＝「—」。SCクエリは半角/全角スペースの揺れがある。

**修正（コード）**:
- 突合を **空白正規化**（半角/全角スペース除去）に変更。衝突時は表示回数最大の行を採用（決定的マージ）。→「蓮根レインボーホール」等を回収。
- 実測にも手入力にも無く、実測クエリにも存在しないKWは「—」ではなく **「圏外」**（直近28日 表示ゼロ）と明示。バグと圏外（＝そのKWでまだ未露出）を区別。※「戸田斎場 葬儀/一日葬/家族葬」「板橋区 葬儀」「北区 火葬式」は実測に無く圏外＝重要KWの露出が取れていないSEO課題として可視化される。
- 未接続ボックスに **診断行**（EMAIL/KEY/SC_SITE_URL の有無・値は非表示、KEYはBEGIN行の有無だけ判定）を追加し、原因を即断できるようにした。

**関連ファイル**: `app/seo-x7k2q/page.tsx`（結合・表示ロジック）。データ源 `data/seoKeywords.ts` / `lib/searchConsole.ts` は変更なし。

**確認**: `npm run build` 成功。Python でSC実測を取得し、正規化突合で期待どおり約10KWがHIT・5KWが圏外になることを確認。

**あなた側の作業（本番を直す最重要手順）**: Vercel → プロジェクト → Settings → Environment Variables（Production）に以下を登録し再デプロイ。
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `sc-reader@johoku-sougi-seo.iam.gserviceaccount.com`
- `GOOGLE_PRIVATE_KEY` = `C:\Users\kawag\.config\claude-seo\service-account.json` の `private_key` の値（`-----BEGIN PRIVATE KEY-----`〜`-----END PRIVATE KEY-----` を**複数行そのまま**貼る。クオートで囲まない）
- `SC_SITE_URL` = `sc-domain:johoku-sougi.jp`（任意・未設定でも既定でこの値を使用）
登録後、`/seo-x7k2q` を開くと診断行が「設定済」になり、実測が自動表示される。

---

## 2026-06-24 — SEO監査（/seo audit）と指摘の修正

**何を**: サイト全79ページのSEO監査を実施（健全性スコア 85/100）。検出した3点を修正。
1. **正規ドメインの不一致を解消（Critical）**: apex は Vercel で www へ308リダイレクトされるのに、canonical / og:url / sitemap / robots(host) はすべて非www を宣言していた。`siteConfig.url` を `https://www.johoku-sougi.jp` に変更し www に統一（この1値から canonical・OG・sitemap・robots がすべて生成される）。
2. **OG画像の不備を修正（High）**: 既定 `/images/hero/og.png` が実在せず404。トップを含む9ページのOG画像が壊れていた。`app/opengraph-image.tsx` で紺基調のブランドOG画像を動的生成（Noto Sans JP をサブセット取得して日本語描画）。`lib/seo.ts` は画像未指定時に images を出力せずファイル規約のOG画像へフォールバック。JSON-LD（FuneralHome/Article）の画像は `siteConfig.defaultImage`（戸田斎場外観の実写）に変更。`siteConfig.ogImage` は廃止。
3. **llms.txt を新設（Medium / GEO）**: `app/llms.txt/route.ts` でサイト概要・主要ページ・プラン・斎場・エリア・全コラムをデータから自動生成して `/llms.txt` で配信。

**なぜ**: 正規URLの矛盾シグナル解消で評価の取りこぼしを防ぐ。SNS/AIプレビューの画像を正常化。AI検索（ChatGPT/Perplexity/AI Overviews）での引用性を高める。

**関連ファイル**: `app/config/site.ts` / `lib/seo.ts` / `lib/jsonld.ts` / `app/opengraph-image.tsx`（新規）/ `app/llms.txt/route.ts`（新規）

**確認**: `npm run build` / `npm run lint` 成功。OG画像は有効なPNG（約45KB、日本語描画OK）、`/llms.txt` は www URL で出力されることを確認。

**あなた側の作業**: なし（Vercelのドメイン設定は現状の www 主・apex→www のままでOK）。デプロイ後、Search Console の登録プロパティが www 側になっているか確認推奨。

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

## 2026-06-22 — SEO判定を完全クリア（短いdescription加筆＋カニバリ解消）

裏ページ `/seo-x7k2q` の残っていた判定（・印・カニバリ注意）を完全に解消。

### description が短い（・印）約40記事＋プライバシー → 解消
- `data/columns.ts` の80字未満だった約40記事の description を 85〜115字に加筆（意味・トーン維持、表現禁止ルール遵守、税/相続/年金/遺言系は「最新は専門家・公的窓口へ」注記を付与）。
- `app/privacy/page.tsx` のdescriptionも加筆（取得・利用目的/管理/第三者提供/問い合わせ窓口）。`lib/seoAudit.ts` の固定ページ控えも同期。
- ビルド済みHTMLの meta description を全件チェック → **全ページ 80〜120字** に収まることを確認。
- title も全件チェック → **全ページ 35字以下** を確認。

### カニバリ（キーワードの取り合い）→ 解消
狙いキーワードの所有を分離（重複ゼロに）：
- **斎場ページ**＝「戸田斎場 ◯◯」「蓮根レインボーホール ◯◯」等、斎場名×形式を専有。
- **プランページ**＝「北区/板橋区 一日葬・火葬式・直葬・家族葬」（地域×形式）を専有。`data/plans.ts` から「戸田斎場 ◯◯」を削除。
- **エリアページ**＝「北区 葬儀」「板橋区 葬儀」（地域×総合）を専有。`data/areas.ts` から形式別の地域KWを削除。
- 付随修正：エリアページの hero サブタイトルが `keywords.join("・")`（KW羅列の詰め込み表示）だったため、自然な一文に変更（`app/area/[area]/page.tsx`）。これで keywords をSEO用途に純化。
- `data/seoKeywords.ts` の順位記録表も新しい所有に合わせて整理し、カニバリ注意の重複行を削除。

### 補足
- `lib/seoAudit.ts` の固定ページ description はページ本体のコピー。固定ページの文言を変えたらこちらも同期すること。

---

## 2026-06-22 — Search Console 自動連携を実装（裏ページ）

裏ページ `/seo-x7k2q` のセクション4を「実測の自動取得」に。順位記録表（セクション2）にも実測を自動マージ。

### 実装
- `lib/searchConsole.ts`（新規）… 依存ライブラリなし。Node標準 `crypto` でサービスアカウントの JWT を署名→アクセストークン取得→Search Console API（searchAnalytics.query）を直接呼ぶ。直近28日・クエリ別（平均掲載順位/表示回数/クリック/CTR）を取得。終端は反映遅延を考慮し3日前。
- `app/seo-x7k2q/page.tsx` … `force-dynamic` + `runtime=nodejs` に変更。実測を取得し、
  - セクション2：キーワードが実測にあれば「SC実測」を優先表示（緑）、無ければ手入力を表示。
  - セクション4：未接続=手順表示／エラー=メッセージ表示／接続=上位クエリ表を表示。

### 必要な環境変数（Vercel）
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` … サービスアカウントのメール
- `GOOGLE_PRIVATE_KEY` … サービスアカウントJSONの private_key（`\n` のままで可。コード側で復元）
- `SC_SITE_URL` … 既定 `sc-domain:johoku-sougi.jp`（DNS認証のドメインプロパティ）

### あなた側の作業
1. Google Cloud でプロジェクト作成 →「Search Console API」を有効化。
2. サービスアカウント作成 → JSONキー発行。
3. Search Console の「設定 → ユーザーと権限」でサービスアカウントのメールを「制限付き」で追加。
4. 上記3つの環境変数を Vercel に設定 → 再デプロイ。`/seo-x7k2q` を開くと自動表示。

---

## （ここから上に新しい作業を追記）
