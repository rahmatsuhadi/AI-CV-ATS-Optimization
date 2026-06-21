import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  className,
  action,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-bold tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[13px] text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
