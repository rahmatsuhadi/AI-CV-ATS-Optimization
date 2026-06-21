import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-8 backdrop-blur-xl">
        <Logo />
        <nav className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-xs" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" className="text-xs" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 py-10 text-center">
        <p className="font-mono text-[11px] text-muted-foreground tracking-wider">
          {new Date().getFullYear()} CV Optimizer AI — built for modern job
          seekers
        </p>
      </footer>
    </div>
  );
}
