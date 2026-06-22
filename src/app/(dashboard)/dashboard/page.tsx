import {
  BarChartIcon,
  BriefcaseIcon,
  FileTextIcon,
  SendIcon,
} from "lucide-react";
import Link from "next/link";
import { getBaseCV, getCVs } from "@/actions/cv";
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
}

export default async function DashboardPage() {
  const baseCvRes = await getBaseCV();
  const cvsRes = await getCVs();

  const baseCv = baseCvRes.success ? baseCvRes.data : null;
  const rawCvs = cvsRes.success && cvsRes.data ? cvsRes.data : [];
  const cvs = rawCvs as DashboardCv[];
  const hasBaseCv = !!baseCv;

  const MOCK_STATS = [
    {
      label: "Total CVs",
      value: cvs.length,
      icon: FileTextIcon,
      trend: cvs.length > 0 ? `+${cvs.length} total` : undefined,
    },
    {
      label: "Jobs Applied",
      value: hasBaseCv ? 12 : 0,
      icon: BriefcaseIcon,
      trend: hasBaseCv ? "+3 this week" : undefined,
    },
    {
      label: "Avg. ATS Score",
      value: hasBaseCv ? "74" : "-",
      icon: BarChartIcon,
      trend: hasBaseCv ? "+4% increase" : undefined,
    },
    {
      label: "Emails Sent",
      value: hasBaseCv ? 8 : 0,
      icon: SendIcon,
      trend: hasBaseCv ? "80% open rate" : undefined,
    },
  ];

  const formattedCvs = cvs.map((cv) => {
    // Format tanggal update secara manusiawi
    const date = new Date(cv.updated_at);
    const timeDiff = Math.abs(Date.now() - date.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const formattedDate =
      diffDays <= 1 ? "Updated recently" : `Updated ${diffDays} days ago`;

    return {
      id: cv.id,
      name: cv.name + (cv.is_base ? " (Base)" : ""),
      score: undefined, // base CV doesn't have a specific job matching score
      updatedAt: formattedDate,
    };
  });

  const MOCK_JOBS = hasBaseCv
    ? [
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
      ]
    : [];

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        title="Dashboard"
        subtitle="Workplace overview, ATS analytics, and track status."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MOCK_STATS.map((stat) => (
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
            title="My CV Profiles"
            subtitle="Manage and tailor versions"
          />
          {formattedCvs.length > 0 ? (
            <div className="flex flex-col gap-3">
              {formattedCvs.map((cv) => (
                <CvCard key={cv.id} {...cv} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
              <p className="text-sm font-medium">No CV found</p>
              <Button size="sm" variant="outline" className="mt-4" asChild>
                <Link href="/cv">Upload or Build CV</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <SectionHeader
            title="Recent Pipeline"
            subtitle="Latest tracker statuses"
          />
          {MOCK_JOBS.length > 0 ? (
            <div className="flex flex-col gap-2">
              {MOCK_JOBS.map((job) => (
                <JobRow key={job.company + job.position} {...job} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
              <p className="text-sm font-medium">No active applications</p>
              <Button size="sm" variant="outline" className="mt-4" asChild>
                <Link href="/job/new">Add Application</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
