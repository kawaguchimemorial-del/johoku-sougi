// JSON-LD を安全に出力するコンポーネント。
type LdData = object | null | undefined;
export function JsonLd({ data }: { data: LdData | LdData[] }) {
  // null（例：1件だけのパンくず）は出力しない
  const json = (Array.isArray(data) ? data : [data]).filter(
    (d): d is object => !!d,
  );
  return (
    <>
      {json.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
