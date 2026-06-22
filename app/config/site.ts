// サイト共通設定。文言・電話番号・URL などはここで一元管理する。

export const siteConfig = {
  name: "城北セレモニーサポートセンター",
  shortName: "城北セレモニーサポート",
  // 運営・施行（中立サイトを装わない。明記する）
  operator: "川口典礼",
  description:
    "東京都北区・板橋区で、戸田斎場を利用した一日葬・火葬式・直葬・家族葬をご検討の方の相談窓口です。運営・施行は川口典礼。24時間365日受付、ご相談・お見積り無料。",
  url: "https://johoku-sougi.jp",
  // 主CTA
  tel: "0120-963-765",
  telLink: "tel:0120963765",
  telNote: "24時間365日受付・ご相談お見積り無料",
  // 川口典礼 本体サイト（控えめにリンク）
  parentSiteName: "川口典礼 公式サイト",
  parentSiteUrl: "https://kawaguchitenrei.com/",
  // 対応エリア
  areas: ["東京都北区", "東京都板橋区", "周辺地域"],
  // OG
  ogImage: "/images/hero/og.png",
  locale: "ja_JP",
  // Google Tag Manager コンテナID（未設定なら空文字。空のときは出力しない）
  gtmId: "GTM-N4G6QFDS",
} as const;

// 価格・料金を表示する際に必ず添える注記文
export const priceNotes = [
  "表示価格は目安です。内容により費用が変わる場合があります。",
  "式場料金・火葬料金・宗教者へのお礼・返礼品・飲食費などは内容により変動します。",
  "正確な費用は個別にお見積りします。詳しくはお問い合わせください。",
] as const;

// 公式施設サイトではない旨（必要箇所で明記）
export const disclaimer =
  "城北セレモニーサポートセンターは、戸田斎場および各公共施設の公式サイトではありません。運営・施行は川口典礼です。";

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
