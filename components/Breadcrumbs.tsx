import Link from "next/link";
import { Container } from "./Container";

export type Crumb = { name: string; path: string };

// パンくず（表示用）。構造化データは別途 breadcrumbLd を使用。
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="パンくずリスト" className="border-b border-black/5 bg-cream">
      <Container>
        <ol className="flex flex-wrap gap-x-1 py-1 text-xs text-muted">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1">
                {last ? (
                  <span className="inline-flex min-h-8 items-center text-ink">{item.name}</span>
                ) : (
                  <Link href={item.path} className="inline-flex min-h-8 items-center hover:text-navy">
                    {item.name}
                  </Link>
                )}
                {!last && <span aria-hidden>›</span>}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
