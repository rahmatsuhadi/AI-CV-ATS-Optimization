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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/cv", label: "My CVs", icon: FileTextIcon },
  { href: "/job", label: "Job Tracker", icon: BriefcaseIcon },
  { href: "/email-templates", label: "Email Templates", icon: MailIcon },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-[240px] flex-col border-r border-border/60 bg-sidebar px-3 py-5">
      <div className="mb-8 px-3">
        <Logo />
      </div>

      <nav className="flex flex-col gap-0.5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Workspace
        </p>
        {NAV.map((item) => (
          <SidebarNavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="mt-auto">
        <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
          <p className="text-xs font-semibold text-foreground">Phase 1 — MVP</p>
          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
            Parsing & analysis enabled. Export coming soon.
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </aside>
  );
}
