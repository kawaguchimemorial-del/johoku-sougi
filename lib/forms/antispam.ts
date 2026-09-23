// フォームの迷惑送信対策（contact / estimate 共通）。
// 方針（CLAUDE.md §8 ご遺族への配慮を最優先）:
// - bot 対策：ハニーポット項目 ＋ 送信時間トラップ。実ユーザーには完全に無害。
// - 営業/勧誘（人間の手送り）対策：文面ヒューリスティクスで「ブロックせずフラグ付け」。
//   ご遺族の本物の問い合わせを取りこぼさないため、自動破棄はしない（Webhook には送り、フラグだけ付ける）。
// - 例外として「bot 確定」と言い切れる signal（ハニーポット混入・ランダム文字列投稿）だけは
//   Webhook に送らず破棄する（shouldDiscard）。日本語話者の実入力が該当しない条件に絞る。

// 自動入力（autofill）に拾われにくいフィールド名にする。
// （"company"/"url" 等の autofill トークンを避ける。誤検知＝誤フラグの低減）
export const HONEYPOT_FIELD = "contact_reference";
export const ELAPSED_FIELD = "elapsedSec";

// JS で計測した滞在秒数がこれ未満なら「速すぎる送信」としてフラグする。
const MIN_ELAPSED_SEC = 3;

export type BotAssessment = { botFlagged: boolean; botReasons: string[] };

// bot らしさを評価する。
// 【重要】判定しても送信は絶対に破棄しない。必ず Webhook へ届けたうえで
// フラグだけ付ける（ご遺族の本物の問い合わせを失わないため／§8）。
// 仕分け（通知の出し分け・別シート移動など）は GAS / スプレッドシート側で行う。
export function assessBot(formData: FormData): BotAssessment {
  const reasons: string[] = [];

  const honeypot = formData.get(HONEYPOT_FIELD);
  if (honeypot && String(honeypot).trim() !== "") reasons.push("honeypot");

  const rawElapsed = formData.get(ELAPSED_FIELD);
  if (rawElapsed !== null && String(rawElapsed).trim() !== "") {
    const sec = Number(rawElapsed);
    if (Number.isFinite(sec) && sec < MIN_ELAPSED_SEC) {
      reasons.push(`too-fast:${sec}`);
    }
  }

  return { botFlagged: reasons.length > 0, botReasons: reasons };
}

const SALES_KEYWORDS = [
  "seo",
  "被リンク",
  "集客",
  "上位表示",
  "アクセス数",
  "外注",
  "格安",
  "広告運用",
  "マーケティング",
  "制作いたします",
  "ホームページ制作",
  "副業",
  "投資",
  "出会い",
  "暗号資産",
  "仮想通貨",
  "backlink",
  "ranking",
  "guest post",
  "crypto",
  "casino",
  "viagra",
];

// 「ランダム英字列」判定。bot が名前・本文に入れる VTaMrmJbGTvdQncrMPXd のような
// 無意味文字列を検出する。誤検知を避けるため、次を **すべて** 満たす場合だけ真とする:
//   1. 8文字以上の連続した英字のみ（数字・記号・空白・日本語を含まない）
//   2. 母音比率が 35% 未満（自然言語の英単語・ローマ字は通常 35% 以上）
//   3. 先頭以外に大文字が2つ以上（人が書く語・氏名は先頭のみ大文字）
// 日本語話者の氏名・フリガナ・本文はこの条件に該当しない。
export function looksRandomToken(value: string): boolean {
  const token = value.trim();
  if (token.length < 8) return false;
  if (!/^[A-Za-z]+$/.test(token)) return false;

  const vowels = token.match(/[aeiouAEIOU]/g)?.length ?? 0;
  if (vowels / token.length >= 0.35) return false;

  const internalUpper = token.slice(1).match(/[A-Z]/g)?.length ?? 0;
  return internalUpper >= 2;
}

// 文字列中に含まれるランダム英字列トークンの数を数える。
function countRandomTokens(value: string): number {
  return value
    .split(/[\s　]+/)
    .filter((token) => looksRandomToken(token)).length;
}

export type SpamAssessment = {
  spamScore: number;
  spamFlagged: boolean;
  spamReasons: string[];
  gibberishHits: number;
};

// 営業/勧誘らしさを採点する。ブロックはしない（フラグのみ）。
export function assessSpam(input: {
  name?: FormDataEntryValue | null;
  nameKana?: FormDataEntryValue | null;
  message?: FormDataEntryValue | null;
  preferredTime?: FormDataEntryValue | null;
}): SpamAssessment {
  const name = String(input.name ?? "");
  const nameKana = String(input.nameKana ?? "");
  const preferredTime = String(input.preferredTime ?? "");
  const message = String(input.message ?? "");
  const haystack = `${name} ${message}`.toLowerCase();

  let score = 0;
  const reasons: string[] = [];

  const urlMatches = message.match(/https?:\/\/|www\./gi) ?? [];
  if (urlMatches.length > 0) {
    score += Math.min(urlMatches.length, 2) + 1;
    reasons.push(`url:${urlMatches.length}`);
  }

  let keywordHits = 0;
  for (const keyword of SALES_KEYWORDS) {
    if (haystack.includes(keyword)) keywordHits += 1;
  }
  if (keywordHits > 0) {
    score += keywordHits;
    reasons.push(`keyword:${keywordHits}`);
  }

  const hasJapanese = /[ぁ-んァ-ン一-龥]/.test(message);
  if (!hasJapanese && message.length > 20) {
    score += 2;
    reasons.push("no-japanese");
  }

  if (/\[url=|\[link=|<a\s/i.test(message)) {
    score += 2;
    reasons.push("link-markup");
  }

  const gibberishHits =
    countRandomTokens(name) +
    countRandomTokens(nameKana) +
    countRandomTokens(preferredTime) +
    countRandomTokens(message);
  if (gibberishHits > 0) {
    score += gibberishHits * 3;
    reasons.push(`gibberish:${gibberishHits}`);
  }

  return {
    spamScore: score,
    spamFlagged: score >= 2,
    spamReasons: reasons,
    gibberishHits,
  };
}

// Webhook に送らず破棄してよいか（＝メール通知を止めてよいか）を判定する。
// bot 確定と言い切れる signal に限定する。人間の営業メール・判断に迷う内容は
// 破棄せず、フラグ付きで必ず届ける（§8 ご遺族への配慮を最優先）。
// 【重要】ハニーポット・滞在時間はここでは使わない。2026-06-07 の障害
// （ブラウザ自動入力がハニーポットを埋め、実ユーザーの送信が握り潰された）を踏まえ、
// これらは従来どおりフラグ付けのみに留める。破棄はランダム文字列に限定する。
export function shouldDiscard(spam: SpamAssessment): boolean {
  return spam.gibberishHits > 0;
}
