// GTM（dataLayer）へのイベント送信。GA4 側のコンバージョン計測に使う。
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function pushEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, page_path: window.location.pathname, ...params });
}

// フォーム送信完了（GA4 推奨イベント名 generate_lead）
export function pushGenerateLead(formType: string) {
  pushEvent("generate_lead", { form_type: formType });
}
