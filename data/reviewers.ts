// 記事の監修。E-E-A-T 強化用。
//
// 方針：
//  - 葬儀分野の記事は「統括監修者（代表者・責任者／葬儀相談員）」が監修。
//  - 税務・相続・年金・遺言などの記事は監修を付けず、「専門家・公的窓口で要確認」とする
//    （社内に有資格の専門家がいないため、専門家監修は名乗らない）。
//
// ★重要：published を true にするのは、実在の監修者の氏名・監修事実が確定したときだけ。
//   プレースホルダのまま公開してはいけない（ステマ規制・景表法・Google評価の観点でNG）。
//   published: false の間は、監修表示も構造化データにも一切出ません（安全）。

export type Reviewer = {
  id: string;
  published: boolean; // 実データ確定後に true にする
  name: string; // 氏名
  title: string; // 肩書（葬儀相談員 など）
  role: string; // 役割の説明（統括監修 など）
  credentials: string[]; // 保有資格があれば（任意）
  bio: string; // 経歴・一言
  sameAs?: string[]; // 公的プロフィール等のURL（あれば）
};

// 監修者の登録簿。氏名等を実在の情報に置き換えてから published を true に。
export const reviewers: Reviewer[] = [
  {
    id: "soukatsu",
    published: false, // ← 実データ確定後に true
    name: "（氏名を入力）",
    title: "葬儀相談員",
    role: "統括監修（代表者・責任者）",
    credentials: [], // 葬祭ディレクター技能審査など、あれば記載
    bio: "川口典礼で葬儀の相談・施行に携わる責任者。（経歴・年数などを記載）",
    sameAs: [],
  },
];

// 税務・相続・年金・遺言など、専門家・公的窓口での確認が必要な記事
// （統括監修者の監修対象にしない＝監修表示を出さない）。
const expertCheckSlugs = new Set<string>([
  "inheritance-basic",
  "junkakutei",
  "souzoku-houki",
  "nenkin-tetsuzuki",
  "igon-basic",
  "account-frozen",
]);

// この記事は「専門家・公的窓口で要確認」の分野か。
export function requiresExpertCheck(slug: string): boolean {
  return expertCheckSlugs.has(slug);
}

// 記事の監修者を返す。要確認分野は監修を付けない（null）。
// 公開フラグが立っていない間も null（未確定の監修は出さない）。
export function getReviewer(input: {
  slug: string;
  reviewerId?: string;
}): Reviewer | null {
  if (requiresExpertCheck(input.slug)) return null;
  const id = input.reviewerId ?? "soukatsu";
  const r = reviewers.find((x) => x.id === id);
  return r && r.published ? r : null;
}

// 公開中の監修者（プロフィール掲載用）。
export function publishedReviewers(): Reviewer[] {
  return reviewers.filter((r) => r.published);
}
