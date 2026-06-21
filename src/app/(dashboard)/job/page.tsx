import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { JobRow } from "@/components/molecules/JobRow";
import { Button } from "@/components/ui/button";

const MOCK_JOBS = [
  {
    id: "1",
    company: "Tokopedia",
    position: "Senior Frontend Engineer",
    status: "interview" as const,
    appliedAt: "Jun 15, 2025",
  },
  {
    id: "2",
    company: "Gojek",
    position: "Software Engineer",
    status: "applied" as const,
    appliedAt: "Jun 12, 2025",
  },
  {
    id: "3",
    company: "Traveloka",
    position: "Full Stack Developer",
    status: "rejected" as const,
    appliedAt: "Jun 8, 2025",
  },
  {
    id: "4",
    company: "Shopee",
    position: "React Developer",
    status: "offer" as const,
    appliedAt: "Jun 3, 2025",
  },
  {
    id: "5",
    company: "Bukalapak",
    position: "Frontend Engineer",
    status: "draft" as const,
    appliedAt: "Jun 1, 2025",
  },
];

const statuses = [
  "draft",
  "applied",
  "interview",
  "offer",
  "rejected",
] as const;

export default function JobPage() {
  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        title="Job Tracker"
        subtitle="Manage your application pipeline and follow-ups."
        action={
          <Button size="sm" className="rounded-xl shadow-md" asChild>
            <Link href="/job/new">
              <PlusIcon className="mr-2 size-4" />
              Add Application
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2 rounded-2xl border border-border/60 bg-muted/20 p-2">
          <span className="flex items-center px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Filter:
          </span>
          {statuses.map((s) => (
            <div
              key={s}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <StatusBadge status={s} className="px-3 py-1" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_JOBS.map((job) => (
            <JobRow key={job.company + job.position} {...job} />
          ))}
        </div>
      </div>
    </div>
  );
}
