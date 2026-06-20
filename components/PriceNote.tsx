import { priceNotes } from "@/app/config/site";

// 価格表示の近くに必ず添える注記。
export function PriceNote() {
  return (
    <ul className="mt-4 space-y-1 rounded-md bg-cream p-4 text-xs leading-relaxed text-muted">
      {priceNotes.map((n) => (
        <li key={n} className="flex gap-1.5">
          <span aria-hidden>※</span>
          <span>{n}</span>
        </li>
      ))}
    </ul>
  );
}
