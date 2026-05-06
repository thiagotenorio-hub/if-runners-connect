import Link from "next/link";
import { AppIcon } from "@/components/AppIcon";

const navItems = [
  { href: "/inscricao", label: "Inscricao" },
  { href: "/agenda", label: "Agenda" },
  { href: "/atividades", label: "Atividades" },
  { href: "/pontuacao", label: "Pontuacao" },
  { href: "/rankings", label: "Rankings" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/login", label: "Login" },
  { href: "/admin", label: "Admin" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-graphite/95 text-white shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded bg-leaf text-graphite shadow-sm">
            <AppIcon className="h-6 w-6" name="run" />
          </span>
          <span>
            <strong className="block text-base font-black leading-tight text-white">
              IF RUNNERS
            </strong>
            <span className="text-xs font-bold uppercase tracking-wide text-sun">
              Connect 2026
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-white/75 transition hover:bg-leaf hover:text-graphite"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
