import Image from "next/image";
import { ColumnIllust } from "./ColumnIllust";

// 画像があれば next/image で表示し、無ければインラインSVGにフォールバックする。
// これにより、画像を用意できた記事から順に差し替えられ、未用意の記事も崩れない。
export function ColumnVisual({
  src,
  illust,
  alt,
  className = "",
  sizes,
  priority = false,
}: {
  src?: string | null;
  illust: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
          className="object-cover"
          priority={priority}
        />
      </div>
    );
  }
  return <ColumnIllust name={illust} className={className} />;
}
