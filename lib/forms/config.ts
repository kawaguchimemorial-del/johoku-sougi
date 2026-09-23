// フォーム送信先（Google Apps Script Webhook）が設定済みかどうか。
// 川口典礼本体サイトと同じ GAS に送る。未設定の環境ではフォームを出さず電話案内のみにする
// （「送信できないフォーム」を公開しないため）。ビルド時に評価される。
export const formEnabled = Boolean(
  process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL && process.env.FORM_WEBHOOK_SECRET
);
