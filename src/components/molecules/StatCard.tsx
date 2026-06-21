import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
  trend?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  className,
  trend,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "card-shine flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <div className="flex size-7 items-center justify-center rounded-md bg-muted">
          <Icon className="size-3.5 text-foreground" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="font-heading text-3xl font-bold tracking-tight">
          {value}
        </p>
        {trend && (
          <span className="text-[11px] font-medium text-success">{trend}</span>
        )}
      </div>
    </div>
  );
}
