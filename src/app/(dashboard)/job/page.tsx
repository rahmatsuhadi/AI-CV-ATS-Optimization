import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getJobs } from "@/actions/job";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { JobRow } from "@/components/molecules/JobRow";
import { Button } from "@/components/ui/button";

const statuses = [
  "draft",
  "applied",
  "interview",
  "offer",
  "rejected",
] as const;

export default async function JobPage() {
  const res = await getJobs();
  const jobs = res.success && res.data ? res.data : [];

  // Helper untuk memformat tanggal database ke format lokal yang manis
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        title="Job Tracker"
        subtitle="Kelola pipeline lamaran kerja dan tindak lanjut (CRM Karir)."
        action={
          <Button
            size="sm"
            className="rounded-xl shadow-md font-semibold bg-primary hover:bg-primary/95 text-primary-foreground"
            asChild
          >
            <Link href="/job/new">
              <PlusIcon className="mr-2 size-4" />
              Add Application
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-6">
        {/* Status filters */}
        <div className="flex flex-wrap gap-2 rounded-2xl border border-border/60 bg-muted/20 p-2">
          <span className="flex items-center px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Pipeline:
          </span>
          {statuses.map((s) => (
            <div
              key={s}
              className="opacity-90 hover:opacity-100 transition-opacity cursor-default"
            >
              <StatusBadge status={s} className="px-3 py-1 font-semibold" />
            </div>
          ))}
        </div>

        {/* Jobs list */}
        <div className="flex flex-col gap-3">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobRow
                key={job.id}
                id={job.id}
                company={job.company_name}
                position={job.position}
                status={job.status}
                appliedAt={formatDate(
                  job.applied_at || (job as any).created_at,
                )}
              />
            ))
          ) : (
            <div className="text-center p-16 border border-dashed border-border/80 rounded-2xl bg-muted/5 flex flex-col gap-4 items-center justify-center min-h-[220px]">
              <div className="flex flex-col gap-1.5 max-w-sm">
                <p className="text-sm font-semibold text-foreground">
                  Belum ada lamaran pekerjaan
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ekstrak informasi lowongan kerja pertamamu dan track
                  kualifikasinya bersama AI di sini.
                </p>
              </div>
              <Button
                size="sm"
                className="rounded-xl font-semibold mt-2 bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm"
                asChild
              >
                <Link href="/job/new">
                  <PlusIcon className="mr-1.5 size-4" /> Tambah Lamaran Baru
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
