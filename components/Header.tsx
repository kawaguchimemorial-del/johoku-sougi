import Link from "next/link";
import { siteConfig } from "@/app/config/site";
import { Container } from "./Container";

const navItems = [
  { label: "戸田斎場", href: "/hall/toda-saijo/" },
  { label: "一日葬", href: "/plan/one-day-funeral/" },
  { label: "火葬式・直葬", href: "/plan/direct-funeral/" },
  { label: "家族葬", href: "/plan/family-funeral/" },
  { label: "北区", href: "/area/kita-ku/" },
  { label: "板橋区", href: "/area/itabashi-ku/" },
  { label: "斎場一覧", href: "/hall/" },
  { label: "よくある質問", href: "/faq/" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/30 bg-navy text-white">
      <Container>
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="leading-tight">
            <span className="block text-xs text-gold-light">
              北区・板橋区の葬儀相談窓口
            </span>
            <span className="block text-base font-bold tracking-wide sm:text-lg">
              {siteConfig.name}
            </span>
            <span className="block text-[11px] text-white/70">
              運営・施行：{siteConfig.operator}
            </span>
          </Link>
          <a
            href={siteConfig.telLink}
            className="hidden flex-col items-end sm:flex"
          >
            <span className="text-xl font-bold tracking-wider text-gold-light">
              {siteConfig.tel}
            </span>
            <span className="text-[11px] text-white/70">
              {siteConfig.telNote}
            </span>
          </a>
        </div>
      </Container>
      <nav className="border-t border-white/10 bg-navy-dark">
        <Container>
          <ul className="flex gap-x-4 gap-y-1 overflow-x-auto whitespace-nowrap py-2 text-sm text-white/90">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gold-light">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
