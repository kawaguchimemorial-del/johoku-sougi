"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ColumnVisual } from "./ColumnVisual";
import { columnImage, type Column, type ColumnCategory } from "@/data/columns";

type Props = {
  columns: Column[];
  categories: ColumnCategory[];
  keywords: { keyword: string; count: number }[];
};

// 顧客が知りたいワード（カテゴリ／キーワード）でボタン絞り込みできる一覧。
export function ColumnExplorer({ columns, categories, keywords }: Props) {
  const [category, setCategory] = useState<string>("all");
  const [keyword, setKeyword] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.slug, c.name]));
    return (slug: string) => map.get(slug) ?? "コラム";
  }, [categories]);

  const illustOf = useMemo(() => {
    const map = new Map(categories.map((c) => [c.slug, c.illust]));
    return (slug: string) => map.get(slug) ?? "flow";
  }, [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return columns.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (keyword && !c.keywords.includes(keyword)) return false;
      if (q) {
        const hay = `${c.title} ${c.description} ${c.keywords.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [columns, category, keyword, query]);

  const reset = () => {
    setCategory("all");
    setKeyword("");
    setQuery("");
  };

  const hasFilter = category !== "all" || keyword !== "" || query !== "";

  return (
    <div>
      {/* 検索ボックス */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-navy">
          知りたいことで探す
        </label>
        <div className="mt-2 flex gap-2">
          <input
            type="search"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例：費用、一日葬、香典、戸田斎場 …"
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-gold"
          />
          {hasFilter && (
            <button
              type="button"
              onClick={reset}
              className="shrink-0 rounded-lg border border-black/10 px-4 py-3 text-sm font-bold text-muted hover:text-navy"
            >
              クリア
            </button>
          )}
        </div>
      </div>

      {/* カテゴリ（テーマ）ボタン */}
      <div>
        <p className="text-sm font-bold text-navy">テーマで選ぶ</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <FilterChip
            active={category === "all"}
            onClick={() => setCategory("all")}
          >
            すべて
          </FilterChip>
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              active={category === c.slug}
              onClick={() => setCategory(c.slug)}
            >
              {c.name}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* キーワードボタン */}
      <div className="mt-5">
        <p className="text-sm font-bold text-navy">よく見られるキーワード</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {keywords.map((k) => (
            <FilterChip
              key={k.keyword}
              active={keyword === k.keyword}
              gold
              onClick={() =>
                setKeyword((prev) => (prev === k.keyword ? "" : k.keyword))
              }
            >
              #{k.keyword}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* 結果件数 */}
      <p className="mt-7 text-sm text-muted" aria-live="polite">
        {filtered.length} 件の記事
        {hasFilter && (
          <button
            type="button"
            onClick={reset}
            className="ml-2 text-gold hover:underline"
          >
            条件をリセット
          </button>
        )}
      </p>

      {/* 記事グリッド */}
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-black/15 bg-white p-10 text-center text-muted">
          該当する記事が見つかりませんでした。条件を変えてお試しください。
          <br />
          お急ぎの方は、お電話で直接ご相談ください。
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/column/${c.slug}/`}
              className="group flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative h-36 w-full">
                <ColumnVisual
                  src={columnImage(c)}
                  illust={illustOf(c.category)}
                  alt={c.title}
                  className="h-full w-full"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="absolute left-3 top-3 z-10 rounded-full bg-navy/90 px-3 py-1 text-[11px] font-bold text-white">
                  {categoryName(c.category)}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-bold leading-snug text-navy group-hover:text-navy-light">
                  {c.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                  {c.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                  <span>約{c.readMin}分で読めます</span>
                  <span className="text-gold">続きを読む →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  gold = false,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  gold?: boolean;
  onClick: () => void;
}) {
  const base =
    "rounded-full border px-4 py-2 text-sm font-bold transition whitespace-nowrap";
  const on = gold
    ? "border-gold bg-gold text-white"
    : "border-navy bg-navy text-white";
  const off =
    "border-black/10 bg-white text-navy hover:border-gold hover:text-gold";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${base} ${active ? on : off}`}
    >
      {children}
    </button>
  );
}
