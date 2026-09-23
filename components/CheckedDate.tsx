import { contentCheckedAt } from "@/app/config/site";

// 掲載内容の最終確認日（料金・斎場情報・制度は変わるため、いつ時点の情報かを示す）
export function CheckedDate({ className = "" }: { className?: string }) {
  const [y, m, d] = contentCheckedAt.split("-").map(Number);
  return (
    <p className={`text-xs text-muted ${className}`}>
      掲載内容の最終確認日：
      <time dateTime={contentCheckedAt}>
        {y}年{m}月{d}日
      </time>
      （料金・施設情報・制度は変更される場合があります）
    </p>
  );
}
