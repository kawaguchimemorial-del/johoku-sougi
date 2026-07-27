// エリアページのデータ。北区・板橋区・足立区。

export type Area = {
  slug: string;
  name: string;
  href: string;
  lead: string;
  // メタ情報（未設定なら戸田斎場を軸にした既定文を使う）
  metaTitle?: string;
  metaDescription?: string;
  heroLead?: string;
  // 「◯◯区から利用できる斎場」セクションの本文（未設定なら戸田斎場の既定文）
  featuredNote?: string;
  intro: string[];
  // そのエリアから利用できる主な斎場（ページ上部で大きく案内する）slug
  featuredHalls: string[];
  // そのエリアで選択肢として紹介する式場 slug
  localHalls: string[];
  keywords: string[];
};

export const areas: Area[] = [
  {
    slug: "kita-ku",
    name: "北区",
    href: "/area/kita-ku/",
    lead: "北区で葬儀をご検討の方へ",
    intro: [
      "北区で葬儀をお考えの際、どの斎場を利用すればよいか迷われる方は少なくありません。",
      "北区からは火葬場併設の戸田斎場が利用しやすく、一日葬・火葬式・直葬・家族葬など、ご希望に合わせた形でお見送りいただけます。",
      "北区セレモニーホールなど、北区内の式場も選択肢としてご案内できます。まずはお電話でご相談ください。",
    ],
    featuredHalls: ["toda-saijo"],
    localHalls: ["toda-saijo", "funado-saijo", "kita-ceremony-hall"],
    keywords: ["北区 葬儀"],
  },
  {
    slug: "itabashi-ku",
    name: "板橋区",
    href: "/area/itabashi-ku/",
    lead: "板橋区で葬儀をご検討の方へ",
    intro: [
      "板橋区で葬儀をお考えの際、斎場選びや進め方に悩まれる方も多くいらっしゃいます。",
      "板橋区からは火葬場併設の戸田斎場が利用しやすく、移動の負担を抑えながら一日葬・火葬式・直葬・家族葬に対応できます。",
      "板橋区内の舟渡斎場もご利用いただけます。蓮根レインボーホールなどもあわせて選択肢としてご案内できますので、まずはお電話でご相談ください。",
    ],
    featuredHalls: ["toda-saijo", "funado-saijo"],
    localHalls: ["toda-saijo", "funado-saijo", "renkon-rainbow-hall"],
    keywords: ["板橋区 葬儀"],
  },
  {
    slug: "adachi-ku",
    name: "足立区",
    href: "/area/adachi-ku/",
    lead: "足立区で葬儀をご検討の方へ",
    metaTitle: "足立区の葬儀相談｜町屋斎場・一日葬・火葬式・家族葬",
    metaDescription:
      "足立区で葬儀をご検討の方へ。火葬場併設の町屋斎場を利用した一日葬・火葬式・直葬・家族葬のご相談を、城北セレモニーサポートセンター（運営・施行：川口典礼）が承ります。24時間365日受付。",
    heroLead:
      "町屋斎場を利用した一日葬・火葬式・直葬・家族葬のご相談を承ります。",
    featuredNote:
      "足立区からは、火葬場が併設された町屋斎場が利用しやすく、式場から火葬炉までの移動が少ないため、ご高齢の方や足元に不安のある参列者がいらっしゃる場合もご負担を抑えやすい斎場です。通夜を行わない一日葬、火葬を中心とした火葬式・直葬、ご家族中心の家族葬まで、ご希望や参列人数に合わせてお選びいただけます。",
    intro: [
      "足立区で葬儀をお考えの際、どの斎場を利用すればよいか、費用がどのくらいかかるのか、迷われる方は少なくありません。",
      "足立区からは、荒川区町屋にある火葬場併設の町屋斎場が利用しやすく、一日葬・火葬式・直葬・家族葬など、ご希望に合わせた形でお見送りいただけます。町屋駅から徒歩約5分で、電車でお越しになる参列者にも案内しやすい立地です。",
      "式場使用料や火葬料金といった施設の費用と、ご葬儀プランの費用を分けてご説明しますので、総額の見通しを立てやすくなります。まずはお電話でご相談ください。",
    ],
    featuredHalls: ["machiya-saijo"],
    localHalls: ["machiya-saijo"],
    keywords: ["足立区 葬儀", "足立区 家族葬", "足立区 一日葬", "足立区 火葬"],
  },
];

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);

// エリアページの title / description / リード文。
// 既定は戸田斎場軸（北区・板橋区）。足立区のように主斎場が異なるエリアはデータ側で上書きする。
export const areaTitle = (a: Area) =>
  a.metaTitle ?? `${a.name}の葬儀相談｜戸田斎場・一日葬・火葬式・家族葬`;

export const areaDescription = (a: Area) =>
  a.metaDescription ??
  `${a.name}で葬儀をご検討の方へ。戸田斎場を利用した一日葬・火葬式・直葬・家族葬のご相談を、城北セレモニーサポートセンター（運営・施行：川口典礼）が承ります。24時間365日受付。`;

export const areaHeroLead = (a: Area) =>
  a.heroLead ?? "戸田斎場を利用した一日葬・火葬式・直葬・家族葬のご相談を承ります。";

export const areaFeaturedNote = (a: Area) =>
  a.featuredNote ??
  `${a.name}からは、火葬場が併設された戸田斎場が利用しやすく、移動の負担を抑えながらお見送りができます。${
    a.featuredHalls.includes("funado-saijo")
      ? "あわせて、板橋区内の舟渡斎場もご利用いただけます。"
      : ""
  }通夜を行わない一日葬、火葬を中心とした火葬式・直葬、ご家族中心の家族葬など、ご希望や参列人数に合わせて、斎場・形式をお選びいただけます。`;
