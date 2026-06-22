"use client";

import { Edit3Icon } from "lucide-react";
import Link from "next/link";
import { ScoreRing } from "@/components/atoms/ScoreRing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CvCardProps {
  id?: string;
  name: string;
  score?: number;
  updatedAt: string;
  className?: string;
  companyName?: string;
  position?: string;
}

export function CvCard({
  id = "1",
  name,
  score,
  updatedAt,
  className,
  companyName,
  position,
}: CvCardProps) {
  return (
    <div
      className={cn(
        "group flex flex-col justify-between gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:border-border hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 w-full">
          <p className="font-heading text-[15px] font-semibold tracking-tight">
            {name}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            {updatedAt}
          </p>
          {position && companyName && (
            <div className="mt-2 flex flex-wrap items-center gap-1 rounded-lg bg-primary/5 px-2 py-0.5 text-[11px] border border-primary/10 w-fit text-primary-foreground/90 font-medium">
              <span className="text-muted-foreground">Kustom:</span>
              <span className="font-semibold text-primary">{position}</span>
              <span className="text-muted-foreground">@</span>
              <span className="font-semibold text-primary">{companyName}</span>
            </div>
          )}
        </div>
        {score !== undefined && <ScoreRing score={score} size={42} />}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-medium w-full"
          asChild
        >
          <Link href={`/cv/${id}/edit`}>
            <Edit3Icon className="mr-1.5 size-3" />
            Ubah CV
          </Link>
        </Button>
      </div>
    </div>
  );
}
