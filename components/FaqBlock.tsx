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
      <h2 className="relative pt-4 before:absolute before:left-0 before:top-0 before:h-px before:w-8 before:bg-gold-deep font-serif text-[22px] font-bold leading-snug text-navy sm:text-[28px]">
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
