// 主要キーワードの順位記録表。
// Search Console で「実際に検索されているクエリ」を選び、狙うページに割り当てている。
// position / impressions / updated は直近のSC実測スナップショット（フォールバック用）。
// 裏ページ /seo-x7k2q では、SC接続時は実測（緑）を自動優先し、未接続時はこの値を表示する。
// ※ 突合は空白正規化（半角/全角スペース除去）で行うため、keyword はSCの表記のままでよい。
//   数字を最新化したいときは、このファイルの position/impressions/updated を書き換えて commit するだけ。

export type KeywordRank = {
  keyword: string; // 対象キーワード（Search Console の実クエリ表記に合わせる）
  targetPath: string; // このKWで上位を狙う主ページ
  position?: number; // Search Console 平均掲載順位（スナップショット）
  impressions?: number; // 表示回数（任意）
  clicks?: number; // クリック数（任意）
  updated?: string; // 記録日 "YYYY-MM-DD"
  note?: string; // メモ
};

// 実クエリに基づく主要キーワード（スナップショット＝直近28日 2026-06-09〜07-07）。
export const keywordRanks: KeywordRank[] = [
  // 一日葬（最も表示が多い軸）
  { keyword: "北区 一日葬", targetPath: "/plan/one-day-funeral/", position: 30.1, impressions: 153, clicks: 0, updated: "2026-07-10", note: "最大流入KW" },
  { keyword: "板橋区 一日葬", targetPath: "/plan/one-day-funeral/", position: 42.6, impressions: 78, clicks: 0, updated: "2026-07-10" },
  { keyword: "板橋 一日葬", targetPath: "/plan/one-day-funeral/", position: 44.9, impressions: 17, clicks: 0, updated: "2026-07-10" },
  // 北区エリア軸（葬儀・葬式・通夜）
  { keyword: "北区 葬儀", targetPath: "/area/kita-ku/", position: 56.0, impressions: 57, clicks: 0, updated: "2026-07-10", note: "地域主要KW" },
  { keyword: "葬式 北区", targetPath: "/area/kita-ku/", position: 47.4, impressions: 23, clicks: 0, updated: "2026-07-10" },
  { keyword: "葬儀 北区", targetPath: "/area/kita-ku/", position: 55.1, impressions: 18, clicks: 0, updated: "2026-07-10" },
  { keyword: "北区 通夜", targetPath: "/area/kita-ku/", position: 42.5, impressions: 16, clicks: 0, updated: "2026-07-10" },
  // 直葬・火葬
  { keyword: "北区 直葬", targetPath: "/plan/direct-funeral/", position: 64.1, impressions: 45, clicks: 0, updated: "2026-07-10" },
  { keyword: "板橋区 直葬", targetPath: "/plan/direct-funeral/", position: 62.5, impressions: 35, clicks: 0, updated: "2026-07-10" },
  { keyword: "板橋 直葬", targetPath: "/plan/direct-funeral/", position: 55.6, impressions: 15, clicks: 0, updated: "2026-07-10" },
  { keyword: "板橋 火葬", targetPath: "/plan/direct-funeral/", position: 77.7, impressions: 15, clicks: 0, updated: "2026-07-10" },
  // 家族葬
  { keyword: "北区 家族葬", targetPath: "/plan/family-funeral/", position: 60.5, impressions: 35, clicks: 0, updated: "2026-07-10" },
  { keyword: "家族葬 北区", targetPath: "/plan/family-funeral/", position: 57.1, impressions: 26, clicks: 0, updated: "2026-07-10" },
  { keyword: "板橋区 家族葬", targetPath: "/plan/family-funeral/", position: 77.1, impressions: 9, clicks: 0, updated: "2026-07-10" },
  // 板橋エリア軸・区民葬
  { keyword: "板橋区 葬儀 相談", targetPath: "/area/itabashi-ku/", position: 80.2, impressions: 39, clicks: 0, updated: "2026-07-10" },
  { keyword: "板橋 区民葬", targetPath: "/area/itabashi-ku/", position: 62.9, impressions: 13, clicks: 0, updated: "2026-07-10", note: "コラム /column/kumin-sou/ も関連" },
  // 指名（ブランド）
  { keyword: "川口典礼", targetPath: "/", position: 24.9, impressions: 30, clicks: 0, updated: "2026-07-10", note: "運営元の指名検索・最上位帯" },
  // 斎場軸（実際は施設名の単体・別表記で検索されている。低露出=伸びしろ）
  { keyword: "戸田 斎場", targetPath: "/hall/toda-saijo/", position: 69.0, impressions: 2, clicks: 0, updated: "2026-07-10", note: "「戸田斎場 葬儀」ではなく「戸田 斎場」で検索されている" },
  { keyword: "舟渡斎場", targetPath: "/hall/funado-saijo/", position: 80.3, impressions: 3, clicks: 0, updated: "2026-07-10" },
  { keyword: "北区セレモニーホール", targetPath: "/hall/kita-ceremony-hall/", position: 82.0, impressions: 3, clicks: 0, updated: "2026-07-10" },
  { keyword: "蓮根レインボーホール", targetPath: "/hall/renkon-rainbow-hall/", position: 83.0, impressions: 3, clicks: 0, updated: "2026-07-10", note: "実クエリは「蓮根 レインボー ホール」。空白正規化で突合" },
  { keyword: "北区 斎場", targetPath: "/hall/", position: 67.5, impressions: 2, clicks: 0, updated: "2026-07-10" },
];
