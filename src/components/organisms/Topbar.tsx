"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function Topbar({ userEmail }: { userEmail?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="font-heading text-sm font-semibold tracking-tight text-muted-foreground/80">
          mbuh-job — <span className="text-foreground">App</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        {userEmail && (
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-[11px] font-medium tracking-tight text-muted-foreground">
              {userEmail}
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-xs hover:bg-danger/10 hover:text-danger"
        >
          Keluar
        </Button>
      </div>
    </header>
  );
}
