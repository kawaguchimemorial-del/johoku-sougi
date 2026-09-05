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

// 実クエリに基づく主要キーワード（スナップショット＝直近28日 2026-08-05〜09-02）。
export const keywordRanks: KeywordRank[] = [
  // 一日葬（最優先。1ページ目にもっとも近い軸）
  { keyword: "北区 一日葬", targetPath: "/plan/one-day-funeral/", position: 17.0, impressions: 135, clicks: 0, updated: "2026-09-06", note: "最大流入KW・10位以内を狙う" },
  { keyword: "板橋区 一日葬", targetPath: "/plan/one-day-funeral/", position: 17.6, impressions: 124, clicks: 0, updated: "2026-09-06" },
  { keyword: "板橋 一日葬", targetPath: "/plan/one-day-funeral/", position: 14.6, impressions: 32, clicks: 0, updated: "2026-09-06" },
  // 火葬式・直葬（表示は多いが順位が遠い。担当ページを厚くした）
  { keyword: "板橋区 直葬", targetPath: "/plan/direct-funeral/", position: 42.2, impressions: 172, clicks: 0, updated: "2026-09-06" },
  { keyword: "北区 直葬", targetPath: "/plan/direct-funeral/", position: 45.9, impressions: 167, clicks: 0, updated: "2026-09-06", note: "エリアページとのカニバリを解消中" },
  { keyword: "板橋 直葬", targetPath: "/plan/direct-funeral/", position: 40.4, impressions: 32, clicks: 0, updated: "2026-09-06" },
  { keyword: "北区 火葬", targetPath: "/plan/direct-funeral/", position: 39.0, impressions: 110, clicks: 0, updated: "2026-09-06" },
  { keyword: "板橋 火葬", targetPath: "/plan/direct-funeral/", position: 68.4, impressions: 26, clicks: 0, updated: "2026-09-06" },
  { keyword: "板橋区 火葬式", targetPath: "/plan/direct-funeral/", position: 43.7, impressions: 12, clicks: 0, updated: "2026-09-06" },
  // 家族葬
  { keyword: "北区 家族葬", targetPath: "/plan/family-funeral/", position: 56.7, impressions: 112, clicks: 0, updated: "2026-09-06" },
  { keyword: "家族葬 北区", targetPath: "/plan/family-funeral/", position: 49.9, impressions: 64, clicks: 0, updated: "2026-09-06" },
  { keyword: "板橋区 家族葬", targetPath: "/plan/family-funeral/", position: 71.1, impressions: 59, clicks: 0, updated: "2026-09-06" },
  // 北区エリア軸（葬儀・葬式・通夜・告別式・斎場・火葬場）
  { keyword: "北区 葬儀", targetPath: "/area/kita-ku/", position: 57.2, impressions: 96, clicks: 0, updated: "2026-09-06", note: "地域主要KW" },
  { keyword: "北区 通夜", targetPath: "/area/kita-ku/", position: 43.0, impressions: 116, clicks: 0, updated: "2026-09-06" },
  { keyword: "北区 告別式", targetPath: "/area/kita-ku/", position: 35.3, impressions: 89, clicks: 0, updated: "2026-09-06" },
  { keyword: "北区 自由葬", targetPath: "/area/kita-ku/", position: 37.6, impressions: 101, clicks: 0, updated: "2026-09-06", note: "自由葬の専用ページは作らず、形式の選び方で触れる" },
  { keyword: "北区 火葬場", targetPath: "/area/kita-ku/", position: 48.7, impressions: 44, clicks: 0, updated: "2026-09-06" },
  { keyword: "葬式 北区", targetPath: "/area/kita-ku/", position: 51.1, impressions: 43, clicks: 0, updated: "2026-09-06" },
  { keyword: "北区 斎場", targetPath: "/area/kita-ku/", position: 49.9, impressions: 39, clicks: 0, updated: "2026-09-06" },
  { keyword: "北区 葬式", targetPath: "/area/kita-ku/", position: 44.9, impressions: 34, clicks: 0, updated: "2026-09-06" },
  { keyword: "北区 密葬", targetPath: "/area/kita-ku/", position: 42.2, impressions: 17, clicks: 0, updated: "2026-09-06", note: "「密葬」の語は火葬式ページで説明" },
  // 板橋区エリア軸
  { keyword: "板橋区 葬儀 相談", targetPath: "/area/itabashi-ku/", position: 65.6, impressions: 27, clicks: 0, updated: "2026-09-06" },
  { keyword: "板橋 斎場", targetPath: "/area/itabashi-ku/", position: 70.1, impressions: 8, clicks: 0, updated: "2026-09-06" },
  // 区民葬・市民葬（コラムが受けている。市民葬の語を追加）
  { keyword: "板橋区 市民葬", targetPath: "/column/kumin-sou/", position: 37.1, impressions: 146, clicks: 0, updated: "2026-09-06", note: "需要大。板橋区の区民葬儀を明記" },
  { keyword: "北区 市民葬", targetPath: "/column/kumin-sou/", position: 47.4, impressions: 36, clicks: 0, updated: "2026-09-06" },
  { keyword: "板橋 区民葬", targetPath: "/column/kumin-sou/", position: 79.4, impressions: 23, clicks: 0, updated: "2026-09-06" },
  // 斎場軸（低露出＝伸びしろ。次フェーズで強化）
  { keyword: "お別れホール蓮根", targetPath: "/hall/renkon-rainbow-hall/", position: 48.3, impressions: 33, clicks: 0, updated: "2026-09-06", note: "蓮根レインボーホールの別名で検索されている" },
  { keyword: "舟渡斎場", targetPath: "/hall/funado-saijo/", position: 60.3, impressions: 18, clicks: 0, updated: "2026-09-06" },
  { keyword: "町屋斎場", targetPath: "/hall/machiya-saijo/", note: "新規ページ・計測開始前" },
  { keyword: "町屋斎場 料金", targetPath: "/hall/machiya-saijo/", note: "施設料金セクションで対応" },
  // 指名（ブランド）・足立区
  { keyword: "城北葬祭", targetPath: "/", position: 20.3, impressions: 46, clicks: 0, updated: "2026-09-06", note: "社名に近い指名検索" },
  { keyword: "川口典礼", targetPath: "/company/", position: 19.0, impressions: 9, clicks: 0, updated: "2026-09-06", note: "運営元の指名検索" },
  { keyword: "足立区 葬儀", targetPath: "/area/adachi-ku/", note: "新規ページ・計測開始前" },
  { keyword: "足立区 家族葬", targetPath: "/area/adachi-ku/", note: "新規ページ・計測開始前" },
  { keyword: "足立区 一日葬", targetPath: "/plan/one-day-funeral/", note: "新規エリア・計測開始前" },
];
