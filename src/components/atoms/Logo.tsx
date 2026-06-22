import { BriefcaseIcon } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <BriefcaseIcon className="size-5" />
      </div>
      <span className="font-heading text-lg font-bold tracking-tight text-foreground">
        mbuh-job
      </span>
    </div>
  );
}
