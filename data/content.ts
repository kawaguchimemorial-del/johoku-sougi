// プランページ・エリアページ本文で共通に使うセクション型。
// columns.ts の ColumnTable / ColumnSection と同じ形（本文はデータ側に持ち、page.tsx は描画のみ）。

export type ContentTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
  note?: string; // 表の下に添える注記（価格なら目安・税込・変動など）
};

// セクション末尾に並べる内部リンク。
// アンカーには狙うキーワードと同じ語を入れる（例:「北区の一日葬について」）。
export type ContentLink = {
  label: string;
  href: string;
};

export type ContentSection = {
  heading: string; // H2
  paragraphs: string[];
  list?: string[];
  table?: ContentTable;
  links?: ContentLink[];
};
