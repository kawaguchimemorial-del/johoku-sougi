import Link from "next/link";
import type { Hall } from "@/data/halls";
import { siteConfig } from "@/app/config/site";

// 斎場カード（対応形式タグ・相談導線・空き確認CTAを備える）。
export function HallCard({ hall }: { hall: Hall }) {
  return (
    <div className="flex flex-col rounded-xl border border-black/5 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-navy">{hall.name}</h3>
      <p className="mt-1 text-xs text-muted">{hall.area}</p>
      <p className="mt-3 flex-1 text-sm">{hall.summary}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {hall.forms.map((f) => (
          <li
            key={f}
            className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-medium text-navy"
          >
            {f}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-muted">
        北区・板橋区からのご相談に対応します。
      </p>

      <div className="mt-4 flex flex-col gap-2 border-t border-black/5 pt-4 sm:flex-row">
        <Link
          href={hall.href}
          className="flex-1 rounded-lg border border-navy px-4 py-2.5 text-center text-sm font-bold text-navy transition hover:bg-navy/5"
        >
          詳しく見る
        </Link>
        <a
          href={siteConfig.telLink}
          className="flex-1 rounded-lg bg-gold px-4 py-2.5 text-center text-sm font-bold text-white transition hover:opacity-90"
        >
          空き確認を相談する
        </a>
      </div>
    </div>
  );
}
