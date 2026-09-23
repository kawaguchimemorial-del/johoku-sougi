import { voices, voicesSourceNote, type Voice } from "@/data/voices";

// お客様の声（実在のアンケート原文の抜粋）。
export function VoiceList({ items = voices.slice(0, 3) }: { items?: Voice[] }) {
  return (
    <div>
      <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
        {items.map((v) => (
          <li
            key={v.id}
            className="relative w-[82%] shrink-0 snap-start rounded-2xl border border-gold/20 bg-white p-6 shadow-sm sm:w-auto"
          >
            <span
              aria-hidden
              className="absolute right-5 top-2 font-serif text-6xl leading-none text-gold/30"
            >
              ”
            </span>
            <p className="text-sm tracking-widest text-gold-deep" aria-label={`5段階中${v.rating}`}>
              {"★".repeat(v.rating)}
              <span className="text-black/15">{"★".repeat(5 - v.rating)}</span>
            </p>
            <p className="mt-2 font-serif text-[17px] font-bold leading-relaxed text-navy">
              {v.title}
            </p>
            <p className="mt-3 text-sm leading-[1.9] text-ink/85">{v.comment}</p>
            <p className="mt-4 border-t border-black/5 pt-3 text-xs text-muted">
              {v.plan}｜{v.date.replace("-", "年")}月のアンケートより
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-muted">※ {voicesSourceNote}個人の感想です。</p>
    </div>
  );
}
