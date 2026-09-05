import type { Faq } from "@/data/faqs";

// ページ内のよくあるご質問。FAQPage 構造化データと同じ内容を全文表示する
// （折りたたまず表示し、AI検索・スニペットから読み取れるようにする）。
export function FaqBlock({
  items,
  title = "よくあるご質問",
}: {
  items: Faq[];
  title?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="border-l-4 border-gold pl-3 text-xl font-bold text-navy sm:text-2xl">
        {title}
      </h2>
      <dl className="mt-4 space-y-4">
        {items.map((f) => (
          <div
            key={f.question}
            className="rounded-xl border border-black/5 bg-white p-5 shadow-sm"
          >
            <dt className="font-bold text-navy">Q. {f.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted">
              A. {f.answer}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
