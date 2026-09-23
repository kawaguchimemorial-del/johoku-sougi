// セクション見出し（明朝＋金の短線）。品格を出しつつ、読みやすさを優先する。
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  as: Tag = "h2",
  invert = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  as?: "h2" | "h3";
  invert?: boolean;
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <p
          className={`flex items-center gap-3 text-xs font-bold tracking-[0.2em] ${
            invert ? "text-gold-light" : "text-gold-deep"
          } ${center ? "justify-center" : ""}`}
        >
          <span aria-hidden className="h-px w-8 bg-current" />
          {eyebrow}
        </p>
      )}
      <Tag
        className={`mt-3 font-serif text-[26px] font-bold leading-[1.45] tracking-[0.03em] sm:text-[32px] ${
          invert ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </Tag>
      {lead && (
        <p
          className={`mt-4 text-[15px] leading-[1.9] ${
            invert ? "text-white/80" : "text-muted"
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
