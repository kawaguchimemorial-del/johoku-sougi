// エリアページのデータ。北区・板橋区。

export type Area = {
  slug: string;
  name: string;
  href: string;
  lead: string;
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
    keywords: [
      "北区 葬儀",
      "北区 家族葬",
      "北区 一日葬",
      "北区 火葬式",
      "北区 直葬",
    ],
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
    keywords: [
      "板橋区 葬儀",
      "板橋区 家族葬",
      "板橋区 一日葬",
      "板橋区 火葬式",
      "板橋区 直葬",
    ],
  },
];

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);
