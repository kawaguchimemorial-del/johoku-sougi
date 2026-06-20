import Link from "next/link";
import type { Plan } from "@/data/plans";
import { formatPrice } from "@/data/plans";

// プランカード（比較しやすく、価格だけが主役にならないように補足を添える）。
export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Link
      href={plan.href}
      className="group flex flex-col rounded-xl border border-black/5 bg-white p-6 shadow-sm transition hover:border-gold/40 hover:shadow-md"
    >
      <h3 className="text-lg font-bold text-navy">{plan.name}</h3>
      <p className="mt-2 text-sm text-muted">{plan.summary}</p>

      <div className="mt-4 border-t border-black/5 pt-4">
        <span className="text-xs text-muted">目安（税込）</span>
        <p className="text-2xl font-bold text-navy">
          {plan.price.toLocaleString("ja-JP")}
          <span className="ml-0.5 text-sm font-bold">円</span>
        </p>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="font-bold text-gold">向いている方</dt>
          <dd className="text-muted">{plan.forWhom}</dd>
        </div>
        <div>
          <dt className="font-bold text-gold">まず確認すること</dt>
          <dd className="text-muted">{plan.checkFirst}</dd>
        </div>
      </dl>

      <span className="mt-5 inline-block text-sm font-bold text-gold group-hover:underline">
        {plan.name}について相談する →
      </span>
    </Link>
  );
}

// 価格目安の単純表示用ヘルパー（必要箇所で再利用）
export { formatPrice };
