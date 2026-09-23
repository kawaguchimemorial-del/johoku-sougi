"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { siteConfig } from "@/app/config/site";
import { PhoneIcon } from "@/components/PhoneIcon";
import { pushEvent, pushGenerateLead } from "@/lib/analytics";
import { SpamGuardFields } from "@/components/forms/SpamGuardFields";
import { submitContact, type ContactFormState } from "./actions";
import {
  inquiryTypes,
  planOptions,
  hallOptions,
  areaOptions,
  contactOptions,
  type Option,
} from "./options";

const inputBase =
  "block h-12 w-full rounded-lg border bg-white px-4 text-base text-ink transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold-light";

const errId = (name: string) => `${name}-error`;

function FieldError({ name, message }: { name: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={errId(name)} className="mt-2 text-sm font-bold text-red-800">
      {message}
    </p>
  );
}

function Badge({ required }: { required?: boolean }) {
  return required ? (
    <span className="ml-2 rounded bg-navy px-1.5 py-0.5 align-middle text-[11px] font-bold text-white">
      必須
    </span>
  ) : (
    <span className="ml-2 align-middle text-xs font-normal text-muted">任意</span>
  );
}

function ChoiceGroup({
  name,
  legend,
  options,
  required,
  error,
  defaultValue,
  cols = "sm:grid-cols-2",
  onChange,
}: {
  name: string;
  legend: string;
  options: Option[];
  required?: boolean;
  error?: string;
  defaultValue?: string;
  cols?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <fieldset aria-describedby={error ? errId(name) : undefined}>
      <legend className="text-sm font-bold text-navy">
        {legend}
        <Badge required={required} />
      </legend>
      <div className={`mt-3 grid gap-2 ${cols}`}>
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-lg border border-black/15 bg-white px-3 py-2.5 text-[14px] leading-snug sm:px-4 sm:text-[15px] transition has-[:checked]:border-navy has-[:checked]:bg-navy/5 has-[:checked]:font-bold has-[:checked]:text-navy has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-light"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              defaultChecked={defaultValue === o.value}
              className="h-4 w-4 shrink-0 accent-[#1b2a4a]"
              onChange={() => onChange?.(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
      <FieldError name={name} message={error} />
    </fieldset>
  );
}

// プランページ等からの導線（/contact/?plan=one-day）で、形式を選択済みにする。
const noopSubscribe = () => () => {};

function parseQuery(search: string): Record<string, string> {
  const q = new URLSearchParams(search);
  const out: Record<string, string> = {};
  for (const [key, opts] of [
    ["plan", planOptions],
    ["hall", hallOptions],
    ["area", areaOptions],
    ["inquiryType", inquiryTypes],
  ] as const) {
    const v = q.get(key === "inquiryType" ? "type" : key);
    if (v && opts.some((o) => o.value === v)) out[key] = v;
  }
  return out;
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactFormState, FormData>(
    submitContact,
    null
  );
  // クエリはサーバー描画では空、ブラウザでは location.search（静的生成を保つため useSearchParams は使わない）
  const search = useSyncExternalStore(
    noopSubscribe,
    () => window.location.search,
    () => ""
  );
  const preset = useMemo(() => parseQuery(search), [search]);
  const [type, setType] = useState("");
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const values = state?.values ?? preset;
  const errors = state?.errors ?? {};
  // 直近のクリックを優先し、なければ差し戻し値→クエリの順
  const currentType = type || state?.values?.inquiryType || preset.inquiryType || "";

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      if (!state.discarded) {
        pushGenerateLead("johoku_contact");
        pushEvent("form_complete", { ...(state.lead ?? {}) });
      }
      document.getElementById("contact-form")?.scrollIntoView({ block: "start" });
      return;
    }
    const fields = Object.keys(state.errors ?? {});
    if (fields.includes("_form")) {
      pushEvent("form_submit_error", { reason: "webhook" });
    } else if (fields.length > 0) {
      pushEvent("form_validation_error", { error_fields: fields.join(",") });
    }
    // 最初のエラー項目へフォーカス（エラー要約は aria-live で読み上げ）
    const first = fields.find((f) => f !== "_form");
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
    }
  }, [state]);

  if (state?.ok) {
    return (
      <div
        id="contact-form"
        className="min-h-[320px] scroll-mt-28 rounded-2xl border-2 border-gold/60 bg-white p-8 text-center shadow-sm"
        role="status"
      >
        <p className="text-sm font-bold tracking-widest text-gold-deep">送信完了</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-navy">ご相談を受け付けました</h2>
        <p className="mt-4 leading-relaxed text-muted">{state.message}</p>
        <a
          href={siteConfig.telLink}
          data-cta-location="form_success"
          className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-gold-deep px-6 font-bold text-white"
        >
          お急ぎの方はお電話 {siteConfig.tel}
        </a>
      </div>
    );
  }

  const onFirstInput = () => {
    if (started.current) return;
    started.current = true;
    pushEvent("form_start", { form_type: "johoku_contact" });
  };

  return (
    <form
      id="contact-form"
      ref={formRef}
      // 差し戻しのたびに作り直し、defaultValue/defaultChecked で入力を復元する
      key={`${state?.attempt ?? 0}-${Object.keys(preset).join()}`}
      action={formAction}
      noValidate
      onInput={onFirstInput}
      className="relative scroll-mt-28 space-y-8 rounded-2xl border border-black/5 bg-white p-5 shadow-md sm:p-9"
    >
      <SpamGuardFields />

      <div aria-live="polite">
        {state?.message && Object.keys(errors).length > 0 && (
          <div className="rounded-lg border border-red-800/40 bg-red-50 px-5 py-4 text-sm font-bold text-red-900">
            {state.message}
            {errors._form && (
              <a
                href={siteConfig.telLink}
                data-cta-location="form_error"
                className="mt-3 flex min-h-12 items-center justify-center rounded-lg bg-gold-deep px-5 text-base text-white"
              >
                <PhoneIcon className="mr-2 h-5 w-5" />{siteConfig.tel}（24時間365日）
              </a>
            )}
          </div>
        )}
      </div>

      <ChoiceGroup
        name="inquiryType"
        legend="ご相談の内容"
        options={inquiryTypes}
        required
        error={errors.inquiryType}
        defaultValue={values.inquiryType}
        cols="sm:grid-cols-1"
        onChange={setType}
      />

      {currentType === "urgent" && (
        <div className="rounded-xl bg-navy p-5 text-white" data-cta-location="form_urgent">
          <p className="font-bold">お急ぎの場合は、お電話がいちばん早く確実です。</p>
          <p className="mt-1 text-sm text-white/85">
            病院・施設からのお迎えは、24時間365日お電話で受け付けています。
          </p>
          <a
            href={siteConfig.telLink}
            className="mt-3 inline-flex min-h-12 items-center rounded-lg bg-gold-deep px-5 text-lg font-bold tracking-wider text-white"
          >
            <PhoneIcon className="mr-2 h-5 w-5" />
            {siteConfig.tel}
          </a>
        </div>
      )}

      <details
        className="group rounded-xl border border-black/10 bg-cream/60 p-4 sm:p-5"
        open={Boolean(values.plan || values.hall || values.area)}
      >
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-bold text-navy">
          <span>
            形式・斎場・地域も伝える
            <span className="ml-2 text-xs font-normal text-muted">任意・わかる範囲で</span>
          </span>
          <span aria-hidden className="text-gold-deep transition group-open:rotate-45">＋</span>
        </summary>
        <div className="mt-4 space-y-7">
        <ChoiceGroup name="plan" legend="ご希望の形式" options={planOptions} defaultValue={values.plan} cols="grid-cols-2" />
        <ChoiceGroup name="hall" legend="ご希望の斎場" options={hallOptions} defaultValue={values.hall} cols="grid-cols-2" />
        <ChoiceGroup
          name="area"
          legend="お住まいの地域（故人様・ご家族）"
          options={areaOptions}
          defaultValue={values.area}
          cols="grid-cols-2 sm:grid-cols-4"
        />
        </div>
      </details>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-bold text-navy">
            お名前
            <Badge required />
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={60}
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? errId("name") : undefined}
            className={`mt-2 ${inputBase} ${errors.name ? "border-red-800" : "border-black/20"}`}
          />
          <FieldError name="name" message={errors.name} />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-bold text-navy">
            電話番号
            <span className="ml-2 text-xs font-normal text-muted">電話・メールのどちらか</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={30}
            placeholder="例：090-1234-5678"
            defaultValue={values.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? errId("phone") : undefined}
            className={`mt-2 ${inputBase} ${errors.phone ? "border-red-800" : "border-black/20"}`}
          />
          <FieldError name="phone" message={errors.phone} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="text-sm font-bold text-navy">
            メールアドレス
            <span className="ml-2 text-xs font-normal text-muted">電話・メールのどちらか</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={120}
            placeholder="例：yamada@example.com"
            defaultValue={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errId("email") : undefined}
            className={`mt-2 ${inputBase} ${errors.email ? "border-red-800" : "border-black/20"}`}
          />
          <FieldError name="email" message={errors.email} />
        </div>
      </div>

      <ChoiceGroup
        name="preferredContact"
        legend="ご希望の連絡方法"
        options={contactOptions}
        required
        error={errors.preferredContact}
        defaultValue={values.preferredContact}
        cols="grid-cols-2"
      />

      <div>
        <label htmlFor="preferredTime" className="text-sm font-bold text-navy">
          ご連絡のつきやすい時間帯
          <Badge />
        </label>
        <input
          id="preferredTime"
          name="preferredTime"
          type="text"
          maxLength={100}
          placeholder="例：平日の夕方、いつでも可 など"
          defaultValue={values.preferredTime}
          className={`mt-2 ${inputBase} border-black/20`}
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-bold text-navy">
          ご相談内容・ご質問
          <Badge />
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={2000}
          defaultValue={values.message}
          placeholder="例：母が入院中で、もしものときの流れと費用の目安を知りたい。参列は家族10名ほどの予定。"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? errId("message") : undefined}
          className={`mt-2 block w-full resize-y rounded-lg border bg-white px-4 py-3 text-base text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold-light ${
            errors.message ? "border-red-800" : "border-black/20"
          }`}
        />
        <FieldError name="message" message={errors.message} />
      </div>

      <div className="rounded-lg bg-cream p-5">
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            name="consent"
            value="agreed"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? errId("consent") : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#1b2a4a]"
          />
          <span>
            <a href="/privacy/" className="font-bold text-navy underline">
              プライバシーポリシー
            </a>
            に同意して送信します。
            <Badge required />
          </span>
        </label>
        <FieldError name="consent" message={errors.consent} />
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-14 w-full items-center justify-center rounded-lg bg-gold-deep px-8 text-lg font-bold text-white shadow-md transition hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[340px]"
        >
          {pending ? "送信中…" : "無料で相談する（送信）"}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          ご相談・お見積りは無料です。ご相談だけで終わっても費用はかかりません。
          <br />
          お急ぎの方はフォームではなくお電話（{siteConfig.tel}・24時間365日）をご利用ください。
        </p>
      </div>
    </form>
  );
}
