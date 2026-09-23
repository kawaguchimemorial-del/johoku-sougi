export type FormType =
  | "contact"
  | "estimate"
  | "customer_survey"
  | "lp_contact";

export type SendWebhookResult =
  | { ok: true }
  | { ok: false; error: string };

const TIMEOUT_MS = 15000;

export async function sendWebhook(
  formType: FormType,
  payload: Record<string, unknown>
): Promise<SendWebhookResult> {
  const url = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
  const secret = process.env.FORM_WEBHOOK_SECRET;

  if (!url || !secret) {
    console.error(`[webhook:${formType}] env not configured`);
    return { ok: false, error: "env not configured" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      body: JSON.stringify({ ...payload, formType, secret }),
    });

    if (!res.ok) {
      console.error(`[webhook:${formType}] http ${res.status}`);
      return { ok: false, error: `http ${res.status}` };
    }

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      console.error(`[webhook:${formType}] invalid json response`);
      return { ok: false, error: "invalid response" };
    }

    if (
      typeof data !== "object" ||
      data === null ||
      (data as { ok?: unknown }).ok !== true
    ) {
      const errMsg =
        typeof data === "object" && data !== null && "error" in data
          ? String((data as { error: unknown }).error)
          : "webhook returned non-ok";
      console.error(`[webhook:${formType}] ${errMsg}`);
      return { ok: false, error: errMsg };
    }

    return { ok: true };
  } catch (e: unknown) {
    const msg =
      e instanceof Error
        ? e.name === "AbortError"
          ? "timeout"
          : e.message
        : String(e);
    console.error(`[webhook:${formType}] ${msg}`);
    return { ok: false, error: msg };
  } finally {
    clearTimeout(timer);
  }
}
