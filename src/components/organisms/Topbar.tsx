"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="font-heading text-sm font-semibold tracking-tight text-muted-foreground/80">
          mbuh-job — <span className="text-foreground">App</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1">
            <span className="size-1.5 rounded-full bg-success" />
            <span className="font-mono text-[11px] font-medium tracking-tight text-muted-foreground">
              {user.email}
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-xs hover:bg-danger/10 hover:text-danger"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
