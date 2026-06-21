import { SparklesIcon } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
        <SparklesIcon className="size-5 animate-pulse" />
      </div>
      <span className="font-heading text-lg font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
        CV Optimizer AI
      </span>
    </div>
  );
}
