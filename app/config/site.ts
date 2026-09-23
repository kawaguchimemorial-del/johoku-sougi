// サイト共通設定。文言・電話番号・URL などはここで一元管理する。

export const siteConfig = {
  name: "城北セレモニーサポートセンター",
  shortName: "城北セレモニーサポート",
  // 運営・施行（中立サイトを装わない。明記する）
  operator: "川口典礼",
  description:
    "東京都北区・板橋区で、戸田斎場を利用した一日葬・火葬式・直葬・家族葬をご検討の方の相談窓口です。運営・施行は川口典礼。24時間365日受付、ご相談・お見積り無料。",
  // 正規ドメインは www に統一（apex は Vercel 側で www へ 308 リダイレクト）。
  // canonical / og:url / sitemap / robots(host) はすべてこの値から生成される。
  url: "https://www.johoku-sougi.jp",
  // 主CTA
  tel: "0120-963-765",
  telLink: "tel:0120963765",
  telNote: "24時間365日受付・ご相談お見積り無料",
  // 川口典礼 本体サイト（控えめにリンク）
  parentSiteName: "川口典礼 公式サイト",
  parentSiteUrl: "https://kawaguchitenrei.com/",
  // 対応エリア
  areas: ["東京都北区", "東京都板橋区", "東京都足立区", "周辺地域"],
  // OG 画像は app/opengraph-image.tsx で動的生成（既定）。
  // ページ個別の OG 画像は buildMetadata の image 引数で上書きする。
  // JSON-LD（FuneralHome / Article）の画像が未指定のときの既定（実在する写真）。
  defaultImage: "/images/hall/toda-saijo/exterior.png",
  locale: "ja_JP",
  // Google Tag Manager コンテナID（未設定なら空文字。空のときは出力しない）
  gtmId: "GTM-N4G6QFDS",
} as const;

// 運営会社（川口典礼）の実績。すべて確定事実（川口典礼 本体サイト lib/company.ts と同一値）。
// 誇張・推測で数字を変えない。更新時は本体サイトの値と揃える。
export const operatorFacts = {
  legalName: "株式会社川口典礼",
  foundedYear: 2006,
  yearsInBusiness: 20,
  cumulativeCases: "4,600件以上",
  annualCases: "約260件",
  satisfactionRate: "97%以上",
  satisfactionNote: "ご葬儀後にお答えいただいたアンケートの満足度",
  googleRating: 4.6,
  googleReviewCount: 29,
  googleReviewsUrl: "https://www.google.com/maps?cid=8136740303180194415",
  postal: "333-0833",
  address: "埼玉県川口市西新井宿440-1",
  hallName: "川口メモリアルホール",
  // 北区・板橋区・足立区には店舗なし（お迎え・打合せに伺う形）
  visitNote:
    "北区・板橋区・足立区には店舗を構えていません。ご自宅・病院・施設などへお伺いしてご相談・お打合せをいたします。",
} as const;

// 価格・料金を表示する際に必ず添える注記文
export const priceNotes = [
  "表示価格は目安です。内容により費用が変わる場合があります。",
  "式場料金・火葬料金・宗教者へのお礼・返礼品・飲食費などは内容により変動します。",
  "正確な費用は個別にお見積りします。詳しくはお問い合わせください。",
] as const;

// 公式施設サイトではない旨（必要箇所で明記）
export const disclaimer =
  "城北セレモニーサポートセンターは、戸田斎場・町屋斎場および各公共施設の公式サイトではありません。運営・施行は川口典礼です。";

export const ctaText = {
  primary: "まずは「戸田斎場で考えている」とお電話ください",
  appeals: [
    "24時間365日受付",
    "ご相談・お見積り無料",
    "斎場の空き確認もお電話で",
    "病院・施設からのお迎え",
    "安置先のご相談",
    "お見積りのご案内",
  ],
} as const;
