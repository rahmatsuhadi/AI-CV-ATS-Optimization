"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type JobStatus = "draft" | "applied" | "interview" | "offer" | "rejected";

interface JobRowProps {
  id?: string;
  company: string;
  position: string;
  status: JobStatus;
  appliedAt: string;
  className?: string;
}

export function JobRow({
  id = "1",
  company,
  position,
  status: initialStatus,
  appliedAt,
  className,
}: JobRowProps) {
  const [status, setStatus] = useState<JobStatus>(initialStatus);

  return (
    <div
      className={cn(
        "group flex items-center justify-between rounded-2xl border border-border/60 bg-card px-5 py-4 transition-all hover:border-border hover:shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-inner">
          {company.slice(0, 2)}
        </div>
        <div className="flex flex-col gap-0.5">
          <Link
            href={`/job/${id}`}
            className="text-[14px] font-semibold tracking-tight hover:text-primary transition-colors"
          >
            {position}
          </Link>
          <p className="font-mono text-[11px] text-muted-foreground">
            {company}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="hidden text-[11px] text-muted-foreground sm:block font-mono">
          {appliedAt}
        </p>

        <Select
          value={status}
          onValueChange={(val: JobStatus) => setStatus(val)}
        >
          <SelectTrigger className="h-8 w-[120px] rounded-lg text-xs shadow-none border-border/60 focus:ring-0 focus:ring-offset-0">
            <SelectValue>
              <StatusBadge status={status} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Link
          href={`/job/${id}`}
          className="text-muted-foreground/40 hover:text-foreground transition-colors"
        >
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </div>
  );
}
