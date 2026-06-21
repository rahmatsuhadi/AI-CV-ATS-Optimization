"use client";

import { Loader2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Topbar } from "@/components/organisms/Topbar";
import { useAuth } from "@/hooks/use-auth";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      !loading &&
      !user &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/register")
    ) {
      router.push("/login");
    } else if (
      !loading &&
      user &&
      !user.hasBaseCv &&
      !user.onboardingSkipped &&
      !pathname.startsWith("/setup")
    ) {
      router.push("/setup");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <Loader2Icon className="size-8 animate-spin text-primary" />
        <p className="font-mono text-sm text-muted-foreground animate-pulse">
          Initializing workspace...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (pathname.startsWith("/setup")) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-[240px]">
        <Topbar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
