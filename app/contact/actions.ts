"use server";

import { sendWebhook } from "@/lib/forms/sendWebhook";
import { assessBot, assessSpam, shouldDiscard } from "@/lib/forms/antispam";
import { siteConfig } from "@/app/config/site";
import {
  inquiryTypes,
  planOptions,
  hallOptions,
  areaOptions,
  contactOptions,
  labelOf,
} from "./options";

const SUCCESS_MESSAGE = `内容を確認のうえ、担当者よりご連絡します。お急ぎの場合は ${siteConfig.tel}（24時間365日）までお電話ください。`;

export type ContactFormState = {
  ok?: boolean;
  // bot 確定で破棄した送信（画面は完了表示だが、コンバージョン計測はしない）
  discarded?: boolean;
  errors?: Record<string, string>;
  message?: string;
  // 差し戻し時に入力を復元するための値（React 19 の form action は送信後に入力をリセットするため）
  values?: Record<string, string>;
  attempt?: number;
  // 計測用（個人情報は含めない）
  lead?: { inquiryType: string; plan: string; hall: string; area: string; preferredContact: string };
} | null;

const FIELDS = [
  "inquiryType",
  "plan",
  "hall",
  "area",
  "name",
  "phone",
  "email",
  "preferredContact",
  "preferredTime",
  "message",
] as const;

// 各項目の最大文字数（長文スパム・誤貼り付け対策）
const MAX_LEN: Record<string, number> = {
  name: 60,
  phone: 30,
  email: 120,
  preferredTime: 100,
  message: 2000,
};

const str = (v: FormDataEntryValue | null) => (v ? String(v).trim() : "");

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
  // 記号だけの入力を弾くため、数字が 9 桁以上あることも確認する
  const digits = value.replace(/[^0-9０-９]/g, "");
  return /^[0-9０-９\-－ー+()\s]{7,}$/.test(value) && digits.length >= 9;
}

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const errors: Record<string, string> = {};
  const values = Object.fromEntries(FIELDS.map((f) => [f, str(formData.get(f))]));
  for (const [field, max] of Object.entries(MAX_LEN)) {
    if (values[field].length > max) errors[field] = `${max}文字以内でご入力ください`;
  }

  const inquiryType = str(formData.get("inquiryType"));
  const name = str(formData.get("name"));
  const phone = str(formData.get("phone"));
  const email = str(formData.get("email"));
  const preferredContact = str(formData.get("preferredContact"));

  if (!inquiryType) errors.inquiryType = "ご相談の内容を選んでください";
  if (!name) errors.name = "お名前を入力してください";
  if (!preferredContact) errors.preferredContact = "ご希望の連絡方法を選んでください";
  if (!phone && !email) {
    errors.phone = "電話番号またはメールアドレスのどちらかをご入力ください";
  }
  if (phone && !isPhone(phone)) errors.phone = "電話番号の形式をご確認ください";
  if (email && !isEmail(email)) errors.email = "メールアドレスの形式をご確認ください";
  if (preferredContact === "phone" && !phone) {
    errors.phone = "お電話でのご連絡をご希望の場合は電話番号をご入力ください";
  }
  if (preferredContact === "email" && !email) {
    errors.email = "メールでのご連絡をご希望の場合はメールアドレスをご入力ください";
  }
  if (!formData.get("consent")) {
    errors.consent = "プライバシーポリシーへのご同意が必要です";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, message: "入力内容をご確認ください。", values, attempt: Date.now() };
  }

  const body = str(formData.get("message"));
  const plan = labelOf(planOptions, str(formData.get("plan")));
  const hall = labelOf(hallOptions, str(formData.get("hall")));
  const area = labelOf(areaOptions, str(formData.get("area")));
  const typeLabel = labelOf(inquiryTypes, inquiryType);

  const bot = assessBot(formData);
  const spam = assessSpam({
    name,
    preferredTime: formData.get("preferredTime"),
    message: body,
  });
  // bot 確定（ランダム文字列）のみ破棄。ご遺族の問い合わせを落とさないため他はフラグ付けのみ。
  if (shouldDiscard(spam)) {
    console.warn("[contact] discarded: gibberish");
    return { ok: true, discarded: true, message: SUCCESS_MESSAGE };
  }

  // 本体サイトと同じ GAS に送る。受け側の列に無い項目も失われないよう、本文にもまとめて記載する。
  const message = [
    `【${siteConfig.name}（johoku-sougi.jp）からのご相談】`,
    `ご相談の内容：${typeLabel}`,
    `ご希望の形式：${plan || "未選択"}`,
    `ご希望の斎場：${hall || "未選択"}`,
    `お住まいの地域：${area || "未選択"}`,
    "",
    body || "（ご相談内容の記入なし）",
  ].join("\n");

  const result = await sendWebhook("contact", {
    name,
    nameKana: "",
    phone,
    email,
    purpose: `【城北】${typeLabel}`,
    preferredContact: labelOf(contactOptions, preferredContact),
    preferredTime: str(formData.get("preferredTime")),
    message,
    site: "johoku-sougi",
    inquiryType: typeLabel,
    plan,
    hall,
    area,
    submittedAt: new Date().toISOString(),
    ...bot,
    ...spam,
  });

  if (!result.ok) {
    return {
      errors: { _form: "送信に失敗しました" },
      message: "申し訳ありません。送信できませんでした。お手数ですが、お電話でご相談ください（24時間365日）。",
      values,
      attempt: Date.now(),
    };
  }

  return {
    ok: true,
    message: SUCCESS_MESSAGE,
    lead: {
      inquiryType,
      plan: values.plan,
      hall: values.hall,
      area: values.area,
      preferredContact,
    },
  };
}
