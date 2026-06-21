"use client";

import {
  BarChartIcon,
  BriefcaseIcon,
  FileTextIcon,
  SendIcon,
} from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { CvCard } from "@/components/molecules/CvCard";
import { JobRow } from "@/components/molecules/JobRow";
import { StatCard } from "@/components/molecules/StatCard";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const hasBaseCv = true; // Temporary mock until we fetch DB state in Server Component

  const MOCK_STATS = [
    {
      label: "Total CVs",
      value: hasBaseCv ? 2 : 0,
      icon: FileTextIcon,
      trend: hasBaseCv ? "+1 this week" : undefined,
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

  const MOCK_CVS = hasBaseCv
    ? [
        {
          id: "1",
          name: "Software Engineer (General)",
          score: undefined,
          updatedAt: "Updated 2 days ago",
        },
        {
          id: "2",
          name: "Backend Developer Profile",
          score: undefined,
          updatedAt: "Updated 1 week ago",
        },
      ]
    : [];

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
          {MOCK_CVS.length > 0 ? (
            <div className="flex flex-col gap-3">
              {MOCK_CVS.map((cv) => (
                <CvCard key={cv.name} {...cv} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
              <p className="text-sm font-medium">No CV found</p>
              <Button size="sm" variant="outline" className="mt-4" asChild>
                <Link href="/cv">Upload Base CV</Link>
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
