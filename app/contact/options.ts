// 相談フォームの選択肢（フォーム表示と送信処理で共有）。
export type Option = { value: string; label: string };

export const inquiryTypes: Option[] = [
  { value: "urgent", label: "急いで相談したい（ご逝去・危篤など）" },
  { value: "estimate", label: "費用・見積りを知りたい" },
  { value: "hall", label: "斎場の空き・利用について" },
  { value: "preconsult", label: "事前相談（まだ先のこと）" },
  { value: "other", label: "その他" },
];

export const planOptions: Option[] = [
  { value: "one-day", label: "一日葬" },
  { value: "direct", label: "火葬式・直葬" },
  { value: "family", label: "家族葬" },
  { value: "undecided", label: "まだ決めていない" },
];

export const hallOptions: Option[] = [
  { value: "toda", label: "戸田斎場" },
  { value: "funado", label: "舟渡斎場" },
  { value: "kita", label: "北区セレモニーホール" },
  { value: "renkon", label: "蓮根レインボーホール" },
  { value: "machiya", label: "町屋斎場" },
  { value: "undecided", label: "未定・相談したい" },
];

export const areaOptions: Option[] = [
  { value: "kita", label: "北区" },
  { value: "itabashi", label: "板橋区" },
  { value: "adachi", label: "足立区" },
  { value: "other", label: "その他の地域" },
];

export const contactOptions: Option[] = [
  { value: "phone", label: "電話" },
  { value: "email", label: "メール" },
];

export function labelOf(options: Option[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? "";
}

// ページ slug → フォームの選択肢の値（下層ページからフォームへ遷移するときの事前選択用）
export const planFormValue: Record<string, string> = {
  "one-day-funeral": "one-day",
  "direct-funeral": "direct",
  "family-funeral": "family",
};

export const hallFormValue: Record<string, string> = {
  "toda-saijo": "toda",
  "funado-saijo": "funado",
  "kita-ceremony-hall": "kita",
  "renkon-rainbow-hall": "renkon",
  "machiya-saijo": "machiya",
};
