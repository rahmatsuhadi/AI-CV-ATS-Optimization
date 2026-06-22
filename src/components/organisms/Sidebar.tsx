"use client";

import {
  BriefcaseIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  MailIcon,
} from "lucide-react";
import { Logo } from "@/components/atoms/Logo";
import { SidebarNavItem } from "@/components/molecules/SidebarNavItem";

const NAV = [
  { href: "/dashboard", label: "Dasbor", icon: LayoutDashboardIcon },
  { href: "/cv", label: "CV Saya", icon: FileTextIcon },
  { href: "/job", label: "Pelacak Lamaran", icon: BriefcaseIcon },
  { href: "/email-templates", label: "Template Email", icon: MailIcon },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-[240px] flex-col border-r border-border/60 bg-sidebar px-3 py-5">
      <div className="mb-8 px-3">
        <Logo />
      </div>

      <nav className="flex flex-col gap-0.5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Navigasi
        </p>
        {NAV.map((item) => (
          <SidebarNavItem key={item.href} {...item} />
        ))}
      </nav>


    </aside>
  );
}
