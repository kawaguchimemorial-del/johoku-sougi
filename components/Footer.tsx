import Link from "next/link";
import { siteConfig, disclaimer } from "@/app/config/site";
import { Container } from "./Container";

const footerLinks = [
  { label: "トップ", href: "/" },
  { label: "戸田斎場", href: "/hall/toda-saijo/" },
  { label: "斎場一覧", href: "/hall/" },
  { label: "一日葬", href: "/plan/one-day-funeral/" },
  { label: "火葬式・直葬", href: "/plan/direct-funeral/" },
  { label: "家族葬", href: "/plan/family-funeral/" },
  { label: "北区", href: "/area/kita-ku/" },
  { label: "板橋区", href: "/area/itabashi-ku/" },
  { label: "よくある質問", href: "/faq/" },
  { label: "ご相談・お見積り", href: "/contact/" },
  { label: "運営者情報", href: "/company/" },
  { label: "プライバシーポリシー", href: "/privacy/" },
];

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white/80">
      <Container className="py-12">
        <div className="text-lg font-bold text-white">{siteConfig.name}</div>
        <p className="mt-1 text-sm">
          運営・施行：{siteConfig.operator}　／　対応エリア：
          {siteConfig.areas.join("・")}
        </p>
        <p className="mt-4">
          <a
            href={siteConfig.telLink}
            className="text-2xl font-bold tracking-wider text-gold-light"
          >
            {siteConfig.tel}
          </a>
          <span className="ml-2 text-sm text-white/70">
            {siteConfig.telNote}
          </span>
        </p>

        <nav className="mt-8 border-t border-white/10 pt-6">
          <ul className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/60">
          <p>{disclaimer}</p>
          <p className="mt-2">
            運営・施行：{siteConfig.operator}（
            <a
              href={siteConfig.parentSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gold-light"
            >
              {siteConfig.parentSiteName}
            </a>
            ）
          </p>
          <p className="mt-4">
            © {siteConfig.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
