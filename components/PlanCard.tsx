import Link from "next/link";
import Image from "next/image";
import type { Plan } from "@/data/plans";
import { formatPrice } from "@/data/plans";

// プランカード（カバー画像つき・比較しやすく、価格だけが主役にならないように補足を添える）。
// 表示価格は「プラン料金の目安」。式場・火葬料金などが別途かかることをカード内で明示する。
export function PlanCard({ plan, badge }: { plan: Plan; badge?: string }) {
  return (
    <Link
      href={plan.href}
      data-cta={`plan_card_${plan.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full bg-cream">
        <Image
          src={plan.image}
          alt={plan.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-navy/90 px-3 py-1 text-[11px] font-bold text-white">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl font-bold text-navy">{plan.name}</h3>
        <p className="mt-2 text-sm leading-[1.85] text-muted">{plan.summary}</p>

        <div className="mt-4 border-t border-black/5 pt-4">
          <span className="text-xs text-muted">プラン料金の目安（税込）</span>
          <p className="font-serif text-[30px] font-bold leading-tight text-navy tabular-nums">
            {plan.price.toLocaleString("ja-JP")}
            <span className="ml-0.5 text-sm font-bold">円</span>
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            式場・火葬料金、お礼・返礼品・飲食費などは別途。内容により変動します。
          </p>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="font-bold text-gold-deep">向いている方</dt>
            <dd className="text-muted">{plan.forWhom}</dd>
          </div>
          <div>
            <dt className="font-bold text-gold-deep">まず確認すること</dt>
            <dd className="text-muted">{plan.checkFirst}</dd>
          </div>
        </dl>

        <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-navy group-hover:underline">
          {plan.name}の流れと費用を見る <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

// 価格目安の単純表示用ヘルパー（必要箇所で再利用）
export { formatPrice };
