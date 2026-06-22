import { cn } from "@/lib/utils";

type StatusBadgeVariant =
  | "draft"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

const variantStyles: Record<StatusBadgeVariant, string> = {
  draft: "border-muted-foreground/20 bg-muted text-muted-foreground",
  applied: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  interview: "border-warning/20 bg-warning/10 text-yellow-500",
  offer: "border-success/20 bg-success/10 text-emerald-400",
  rejected: "border-danger/20 bg-danger/10 text-red-400",
};

const dotColors: Record<StatusBadgeVariant, string> = {
  draft: "bg-muted-foreground",
  applied: "bg-blue-400",
  interview: "bg-yellow-500",
  offer: "bg-emerald-400",
  rejected: "bg-red-400",
};

const labels: Record<StatusBadgeVariant, string> = {
  draft: "Draf",
  applied: "Melamar",
  interview: "Wawancara",
  offer: "Penawaran",
  rejected: "Ditolak",
};

interface StatusBadgeProps {
  status: StatusBadgeVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        variantStyles[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotColors[status])} />
      {labels[status]}
    </span>
  );
}
