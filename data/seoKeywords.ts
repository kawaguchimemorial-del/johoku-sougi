// 主要キーワードの順位記録表（手入力）。
// Search Console の「検索パフォーマンス」で見た平均掲載順位などを、ここに書き写して管理する。
// position（平均掲載順位）と updated（記録日）を更新していけば、裏ページで一覧・推移を確認できる。
// ※ このファイルを編集→commit するだけで反映される（DB不要）。

export type KeywordRank = {
  keyword: string; // 対象キーワード
  targetPath: string; // このKWで上位を狙う主ページ
  position?: number; // Search Console 平均掲載順位（手入力）
  impressions?: number; // 表示回数（任意）
  clicks?: number; // クリック数（任意）
  updated?: string; // 記録日 "YYYY-MM-DD"
  note?: string; // メモ
};

// 主要キーワード。実データ（halls/plans/areas）の keywords を起点に主要なものを抜粋。
// 値（position 等）は Search Console を見ながら手で埋めていく。
export const keywordRanks: KeywordRank[] = [
  // エリア軸
  { keyword: "北区 葬儀", targetPath: "/area/kita-ku/", note: "主要KW・地域軸" },
  { keyword: "板橋区 葬儀", targetPath: "/area/itabashi-ku/", note: "主要KW・地域軸" },
  { keyword: "北区 家族葬", targetPath: "/area/kita-ku/" },
  { keyword: "板橋区 家族葬", targetPath: "/area/itabashi-ku/" },
  // 斎場軸
  { keyword: "戸田斎場 葬儀", targetPath: "/hall/toda-saijo/", note: "最重要ページ" },
  { keyword: "戸田斎場 家族葬", targetPath: "/hall/toda-saijo/" },
  { keyword: "舟渡斎場", targetPath: "/hall/funado-saijo/" },
  { keyword: "北区セレモニーホール", targetPath: "/hall/kita-ceremony-hall/" },
  { keyword: "蓮根レインボーホール", targetPath: "/hall/renkon-rainbow-hall/" },
  // プラン軸
  { keyword: "北区 一日葬", targetPath: "/plan/one-day-funeral/" },
  { keyword: "戸田斎場 一日葬", targetPath: "/plan/one-day-funeral/" },
  { keyword: "北区 火葬式", targetPath: "/plan/direct-funeral/" },
  { keyword: "板橋区 直葬", targetPath: "/plan/direct-funeral/" },
  { keyword: "戸田斎場 家族葬", targetPath: "/plan/family-funeral/", note: "斎場ページと狙いが重複（カニバリ注意）" },
];
