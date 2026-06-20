import { Container } from "./Container";

// 下層ページ共通の見出しヒーロー（上品なグラデーション）。
export function PageHero({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <section className="bg-gradient-to-b from-navy to-navy-light py-14 text-white">
      <Container>
        <span className="inline-block h-0.5 w-10 bg-gold" />
        <h1 className="mt-4 text-2xl font-bold leading-relaxed sm:text-3xl">
          {title}
        </h1>
        {lead && <p className="mt-3 max-w-2xl text-white/85">{lead}</p>}
      </Container>
    </section>
  );
}
