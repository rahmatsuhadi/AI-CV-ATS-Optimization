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
}

export function CvCard({
  id = "1",
  name,
  score,
  updatedAt,
  className,
}: CvCardProps) {
  return (
    <div
      className={cn(
        "group flex flex-col justify-between gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:border-border hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <p className="font-heading text-[15px] font-semibold tracking-tight">
            {name}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            {updatedAt}
          </p>
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
            Edit Builder
          </Link>
        </Button>
      </div>
    </div>
  );
}
