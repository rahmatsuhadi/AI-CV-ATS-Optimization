"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function SidebarNavItem({
  href,
  label,
  icon: Icon,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
        active
          ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
      )}
      <Icon
        className={cn(
          "size-4 transition-colors",
          active
            ? "text-primary"
            : "text-muted-foreground/60 group-hover:text-foreground",
        )}
      />
      {label}
    </Link>
  );
}
