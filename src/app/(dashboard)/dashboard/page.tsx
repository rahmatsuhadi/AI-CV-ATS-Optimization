import {
  BarChartIcon,
  BriefcaseIcon,
  FileTextIcon,
  SendIcon,
} from "lucide-react";
import Link from "next/link";
import { getBaseCV, getCVs } from "@/actions/cv";
import { getJobs } from "@/actions/job";
import { getEmailTemplates } from "@/actions/email-template";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { CvCard } from "@/components/molecules/CvCard";
import { JobRow } from "@/components/molecules/JobRow";
import { StatCard } from "@/components/molecules/StatCard";
import { Button } from "@/components/ui/button";

interface DashboardCv {
  id: string;
  name: string;
  is_base: boolean;
  updated_at: string;
  jobs?: {
    company_name: string;
    position: string;
  } | null;
}

export default async function DashboardPage() {
  const baseCvRes = await getBaseCV();
  const cvsRes = await getCVs();
  const jobsRes = await getJobs();
  const templatesRes = await getEmailTemplates();

  const baseCv = baseCvRes.success ? baseCvRes.data : null;
  const rawCvs = cvsRes.success && cvsRes.data ? cvsRes.data : [];
  const cvs = rawCvs as DashboardCv[];
  const jobs = jobsRes.success && jobsRes.data ? jobsRes.data : [];
  const templates = templatesRes.success && templatesRes.data ? templatesRes.data : [];
  const hasBaseCv = !!baseCv;

  // Real data calculations
  const totalCvs = cvs.length;
  const appliedJobsCount = jobs.filter((j) => j.status !== "draft").length;
  
  const jobsWithScore = jobs.filter(
    (j) => typeof j.ats_score === "number" && j.ats_score > 0
  );
  const avgAtsScore = jobsWithScore.length > 0
    ? Math.round(jobsWithScore.reduce((acc, curr) => acc + (curr.ats_score || 0), 0) / jobsWithScore.length)
    : null;

  const STATS_DATA = [
    {
      label: "Total CV",
      value: totalCvs,
      icon: FileTextIcon,
      trend: totalCvs > 0 ? `+${totalCvs} total` : "Belum ada CV",
    },
    {
      label: "Lamaran Terkirim",
      value: appliedJobsCount,
      icon: BriefcaseIcon,
      trend: jobs.length > 0 ? `${jobs.length} total lowongan` : "Belum ada lamaran",
    },
    {
      label: "Rata-rata Skor ATS",
      value: avgAtsScore !== null ? `${avgAtsScore}%` : "-",
      icon: BarChartIcon,
      trend: jobsWithScore.length > 0 ? `dari ${jobsWithScore.length} analisis` : "Belum ada analisis",
    },
    {
      label: "Templat Email",
      value: templates.length,
      icon: SendIcon,
      trend: templates.length > 0 ? `${templates.length} siap dipakai` : "Belum ada templat",
    },
  ];

  const formattedCvs = cvs.map((cv) => {
    // Format tanggal update secara manusiawi
    const date = new Date(cv.updated_at);
    const timeDiff = Math.abs(Date.now() - date.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const formattedDate =
      diffDays <= 1
        ? "Baru saja diperbarui"
        : `Diperbarui ${diffDays} hari lalu`;

    const jobInfo = Array.isArray(cv.jobs) ? cv.jobs[0] : cv.jobs;
    const companyName = jobInfo?.company_name;
    const position = jobInfo?.position;

    return {
      id: cv.id,
      name: cv.name + (cv.is_base ? " (Base)" : ""),
      score: undefined, // base CV doesn't have a specific job matching score
      updatedAt: formattedDate,
      companyName,
      position,
    };
  });

  const formattedJobs = jobs.map((job) => {
    const date = job.applied_at || job.created_at || new Date().toISOString();
    const formattedDate = new Date(date).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      id: job.id,
      company: job.company_name,
      position: job.position,
      status: job.status,
      appliedAt: formattedDate,
      atsScore: job.ats_score,
    };
  });

  const recentJobs = formattedJobs.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        title="Dasbor"
        subtitle="Ringkasan workspace, analitik ATS, dan status lamaran."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS_DATA.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <SectionHeader
            title="CV Saya"
            subtitle="Kelola dan sesuaikan versi CV"
          />
          {formattedCvs.length > 0 ? (
            <div className="flex flex-col gap-3">
              {formattedCvs.map((cv) => (
                <CvCard key={cv.id} {...cv} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
              <p className="text-sm font-medium">Belum ada CV</p>
              <Button size="sm" variant="outline" className="mt-4" asChild>
                <Link href="/cv">Upload atau Buat CV</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <SectionHeader
            title="Pipeline Terkini"
            subtitle="Status lamaran terbaru"
          />
          {recentJobs.length > 0 ? (
            <div className="flex flex-col gap-2">
              {recentJobs.map((job) => (
                <JobRow key={job.id} {...job} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
              <p className="text-sm font-medium">Belum ada lamaran aktif</p>
              <Button size="sm" variant="outline" className="mt-4" asChild>
                <Link href="/job/new">Tambah Lamaran</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
