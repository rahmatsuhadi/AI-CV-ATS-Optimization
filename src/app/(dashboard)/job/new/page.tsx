import { JobWorkspace } from "@/components/organisms/job-workspace/JobWorkspace";

export default async function NewJobPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-border/40 pb-4">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Job Workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola plan pekerjaan, analisis kualifikasi, sesuaikan lamaran dengan
          CV, dan generate email pengantar.
        </p>
      </div>

      <JobWorkspace />
    </div>
  );
}
