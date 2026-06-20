// 斎場（式場）のデータ。詳細ページがあるものは hasDetail: true。
// 公式施設サイトを装わないため、利用条件や式場料金は断定しない。

export type Hall = {
  slug: string;
  name: string;
  href: string;
  hasDetail: boolean;
  area: string;
  summary: string;
  description: string[];
  points: string[];
  keywords?: string[];
};

export const halls: Hall[] = [
  {
    slug: "toda-saijo",
    name: "戸田斎場",
    href: "/hall/toda-saijo/",
    hasDetail: true,
    area: "埼玉県戸田市（北区・板橋区からアクセス良好）",
    summary:
      "火葬場が併設された斎場。北区・板橋区から多くの方が利用されています。",
    description: [
      "戸田斎場は火葬場が併設された斎場で、北区・板橋区からのアクセスも良く、多くの方に利用されています。",
      "式場から火葬炉までの移動が少なく、ご高齢の方やご親族のご負担を抑えやすいのが特徴です。",
      "一日葬・火葬式・直葬・家族葬など、さまざまな形式のご相談に対応しています。",
    ],
    points: [
      "火葬場併設で移動の負担を抑えやすい",
      "一日葬・火葬式・直葬・家族葬に対応",
      "空き状況の確認もお電話でご相談いただけます",
    ],
    keywords: [
      "戸田斎場 葬儀",
      "戸田斎場 一日葬",
      "戸田斎場 火葬式",
      "戸田斎場 家族葬",
      "戸田斎場 直葬",
    ],
  },
  {
    slug: "funado-saijo",
    name: "舟渡斎場",
    href: "/hall/",
    hasDetail: false,
    area: "東京都板橋区",
    summary: "板橋区の式場。家族葬などのご相談に対応できます。",
    description: [
      "舟渡斎場は板橋区にある式場で、家族葬を中心としたお見送りのご相談に対応できます。",
    ],
    points: ["板橋区での葬儀の選択肢", "家族葬のご相談に対応"],
  },
  {
    slug: "kita-ceremony-hall",
    name: "北区セレモニーホール",
    href: "/hall/",
    hasDetail: false,
    area: "東京都北区",
    summary: "北区の式場。北区での葬儀をご検討の方の選択肢の一つです。",
    description: [
      "北区セレモニーホールは北区にある式場で、北区での葬儀をご検討の方の選択肢の一つとしてご案内できます。",
    ],
    points: ["北区での葬儀の選択肢", "ご家族中心のお見送りに"],
  },
  {
    slug: "renkon-rainbow-hall",
    name: "蓮根レインボーホール",
    href: "/hall/",
    hasDetail: false,
    area: "東京都板橋区",
    summary: "板橋区の式場。家族葬などのご相談に対応できます。",
    description: [
      "蓮根レインボーホールは板橋区にある式場で、家族葬などのお見送りのご相談に対応できます。",
    ],
    points: ["板橋区での葬儀の選択肢", "家族葬のご相談に対応"],
  },
];

export const getHall = (slug: string) => halls.find((h) => h.slug === slug);
