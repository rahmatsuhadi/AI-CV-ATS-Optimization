import { notFound } from "next/navigation";
import { getJobById } from "@/actions/job";
import { JobWorkspace } from "@/components/organisms/job-workspace/JobWorkspace";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  try {
    const res = await getJobById(id);

    if (!res.success || !res.data) {
      return notFound();
    }

    const job = res.data;

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 border-b border-border/40 pb-4">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Job Workspace
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola plan pekerjaan, analisis kualifikasi, sesuaikan lamaran
            dengan CV, dan generate email pengantar.
          </p>
        </div>

        <JobWorkspace initialJob={job} />
      </div>
    );
  } catch (error) {
    console.error("Error loading job in SSR:", error);
    return (
      <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
        <p className="text-sm font-semibold text-danger">
          Gagal memuat detail pekerjaan dari Supabase. Silakan coba beberapa
          saat lagi.
        </p>
      </div>
    );
  }
}
