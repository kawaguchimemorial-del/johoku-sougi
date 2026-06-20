// 葬儀プランのデータ。価格は紙チラシの税込目安。必ず注記とともに表示すること。

export type Plan = {
  slug: string;
  name: string;
  shortName: string;
  href: string;
  price: number; // 税込目安（円）
  summary: string;
  scale: string; // 規模の目安
  // イメージ画像（public 配下の絶対パス）
  image: string;
  imageAlt: string;
  // 比較しやすくするための補足（価格だけが主役にならないように）
  forWhom: string; // どんな方に向いているか
  checkFirst: string; // まず確認すべきこと
  availableAt: string; // どの斎場で相談できるか
  description: string[];
  features: string[];
  keywords: string[];
};

export const plans: Plan[] = [
  {
    slug: "one-day-funeral",
    name: "一日葬",
    shortName: "一日葬",
    href: "/plan/one-day-funeral/",
    price: 496000,
    summary: "通夜を行わず、一日でお見送りする形式です。",
    scale: "5〜30名程度のご相談が多い形式です。",
    image: "/images/plan/one-day-funeral.png",
    imageAlt: "一日葬・家族葬の祭壇イメージ",
    forWhom:
      "ご高齢のご家族や、遠方・少人数で負担を抑えたい方に向いています。",
    checkFirst: "ご希望の日程・参列人数・宗教者の有無をご確認ください。",
    availableAt: "戸田斎場ほか、北区・板橋区の式場でご相談いただけます。",
    description: [
      "一日葬は、通夜を省略し、告別式と火葬を一日で行うお見送りの形です。",
      "ご高齢のご家族や遠方からの参列が難しい場合など、ご負担をできるだけ抑えたいときに選ばれています。",
      "城北セレモニーサポートセンターでは、戸田斎場での一日葬のご相談に対応しています。",
    ],
    features: [
      "通夜を行わず一日でお見送り",
      "戸田斎場での施行に対応",
      "ご親族中心の落ち着いたお別れ",
    ],
    keywords: ["北区 一日葬", "板橋区 一日葬", "戸田斎場 一日葬"],
  },
  {
    slug: "direct-funeral",
    name: "火葬式・直葬",
    shortName: "火葬式・直葬",
    href: "/plan/direct-funeral/",
    price: 189000,
    summary: "通夜・告別式を行わず、火葬を中心にお見送りする形式です。",
    scale: "ごく身近な方のみで見送りたい場合に選ばれています。",
    image: "/images/plan/direct-funeral.png",
    imageAlt: "火葬式・直葬のイメージ",
    forWhom:
      "限られた人数で静かに、できるだけシンプルに見送りたい方に向いています。",
    checkFirst: "ご安置先と、お別れの時間をどう持つかをご確認ください。",
    availableAt: "火葬場併設の戸田斎場ほか、北区・板橋区の式場でご相談いただけます。",
    description: [
      "火葬式・直葬は、通夜や告別式を行わず、火葬を中心にお見送りする形です。",
      "宗教儀礼を簡素にしたい、限られた人数で静かに見送りたいといったご希望に対応します。",
      "火葬場が併設された戸田斎場であれば、移動の負担を抑えやすいのも特徴です。",
    ],
    features: [
      "通夜・告別式を行わない簡素な形",
      "火葬場併設の戸田斎場で移動負担を抑えやすい",
      "ご安置・搬送のご相談も可能",
    ],
    keywords: [
      "北区 火葬式",
      "板橋区 火葬式",
      "北区 直葬",
      "板橋区 直葬",
      "戸田斎場 火葬式",
      "戸田斎場 直葬",
    ],
  },
  {
    slug: "family-funeral",
    name: "家族葬",
    shortName: "家族葬",
    href: "/plan/family-funeral/",
    price: 628000,
    summary: "ご家族・ご親族を中心に、ゆっくりとお見送りする形式です。",
    scale: "ご家族・近しい方を中心にお別れの時間を大切にしたい方に。",
    image: "/images/plan/family-funeral.png",
    imageAlt: "家族葬の祭壇イメージ",
    forWhom:
      "周囲に気をつかいすぎず、故人との時間を大切にしたい方に向いています。",
    checkFirst: "参列いただく範囲と、通夜・告別式を行うかをご確認ください。",
    availableAt:
      "戸田斎場・舟渡斎場・北区セレモニーホール・蓮根レインボーホールなどでご相談いただけます。",
    description: [
      "家族葬は、ご家族や近しい方を中心に、通夜・告別式を行いゆっくりとお別れする形です。",
      "周囲に気をつかいすぎず、故人との時間を大切にしたい方に選ばれています。",
      "戸田斎場のほか、北区・板橋区周辺の式場も選択肢としてご案内できます。",
    ],
    features: [
      "ご家族・ご親族中心のお見送り",
      "戸田斎場やその他式場から選択可能",
      "通夜・告別式を行うゆとりある形",
    ],
    keywords: ["北区 家族葬", "板橋区 家族葬", "戸田斎場 家族葬"],
  },
];

export const getPlan = (slug: string) => plans.find((p) => p.slug === slug);

export const formatPrice = (price: number) =>
  `${price.toLocaleString("ja-JP")}円（税込）`;
