import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  className?: string;
}

export function ScoreRing({ score, size = 64, className }: ScoreRingProps) {
  const strokeWidth = size > 60 ? 4 : 3;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  const color =
    score >= 80
      ? "stroke-success"
      : score >= 60
        ? "stroke-warning"
        : "stroke-danger";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center font-mono font-bold",
        className,
      )}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 drop-shadow-sm"
        aria-label="Score ring"
      >
        <title>Score: {score}</title>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-muted/50 fill-none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={cn(color, "transition-all duration-1000 ease-out")}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute tracking-tighter"
        style={{ fontSize: Math.max(10, size / 3.5) }}
      >
        {score}
      </span>
    </div>
  );
}
