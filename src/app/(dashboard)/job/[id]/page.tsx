"use client";

import {
  ArrowLeftIcon,
  AtSignIcon,
  BriefcaseIcon,
  BuildingIcon,
  CircleIcon,
  DownloadIcon,
  MailIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ScoreRing } from "@/components/atoms/ScoreRing";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type JobStatus = "draft" | "applied" | "interview" | "offer" | "rejected";

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

interface JobData {
  id: string;
  companyName: string;
  position: string;
  emailTo: string;
  status: JobStatus;
  appliedAt: string;
  description: string;
}

const MOCK_RESULT = {
  match_score: 82,
  missing_keywords: ["Docker", "Kubernetes"],
  matched_keywords: ["React", "TypeScript", "Node.js"],
  suggestions: [
    {
      field: "experience-1",
      issue: "Kurang ATS keyword CI/CD pipeline",
      fix: "Tambahkan: 'Implemented CI/CD pipelines using GitHub Actions.'",
    },
    {
      field: "skills",
      issue: "Tidak ada Docker",
      fix: "Tambahkan Docker ke list Skills",
    },
  ],
};

export default function JobWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Core Data
  const [job, setJob] = useState<JobData | null>(null);

  // Editor State
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [personal, setPersonal] = useState({
    name: "John Doe",
    email: "john@example.com",
    summary:
      "Experienced Software Engineer with a passion for web development and AI.",
  });
  const [skills, setSkills] = useState("React, Node.js, TypeScript");
  const [exp1, setExp1] = useState(
    "Led development of core features. Mentored junior devs.",
  );

  // Email Gen State
  const [generating, setGenerating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState(82);
  const [emailGenerated, setEmailGenerated] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: "",
    body: "",
    templateId: "none",
  });

  const handleReanalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setScore(94); // simulating score bump
      setAnalyzing(false);
    }, 1500);
  };

  useEffect(() => {
    // Load job data from local storage
    const storedJobs = JSON.parse(
      localStorage.getItem("cv_optimizer_jobs") || "[]",
    );
    const storedTemplates = JSON.parse(
      localStorage.getItem("cv_email_templates") || "[]",
    );
    setTemplates(storedTemplates);

    const foundJob = storedJobs.find((j: JobData) => j.id === id);
    if (foundJob) {
      setJob(foundJob);
      setEmailForm((prev) => ({
        ...prev,
        to: foundJob.emailTo || "hr@company.com",
        subject: `Application for ${foundJob.position} - John Doe`,
      }));
    } else {
      // Fallback
      setJob({
        id: id || "1",
        companyName: "Extracted Company",
        position: "Extracted Position",
        emailTo: "hr@extracted.com",
        status: "applied",
        appliedAt: "Just now",
        description: "Raw posting text will appear here...",
      });
    }
  }, [id]);

  const handleGenerateEmail = () => {
    setGenerating(true);
    setTimeout(() => {
      // Logic for Email Template Selection
      const fallbackBody = `Dear Hiring Manager,\n\nI am writing to express my interest in the ${job?.position} position at ${job?.companyName}. Based on the job description, my background in React and scalable frontend architecture aligns well with your team's needs.\n\nI have attached my tailored CV for your review.\n\nBest regards,\nJohn Doe`;

      let finalBody = fallbackBody;
      const tId = emailForm.templateId;
      if (tId !== "none") {
        const storedTemplates = JSON.parse(
          localStorage.getItem("cv_email_templates") || "[]",
        );
        const found = storedTemplates.find((t: EmailTemplate) => t.id === tId);
        if (found) {
          finalBody = found.body
            .replace(/\[Company\]/g, job?.companyName || "your company")
            .replace(/\[Position\]/g, job?.position || "the open role")
            .replace(/\[Name\]/g, personal.name || "John Doe");
        }
      }

      setEmailForm((prev) => ({
        ...prev,
        body: finalBody,
      }));
      setEmailGenerated(true);
      setGenerating(false);
    }, 1500);
  };

  const handleStatusChange = (newStatus: JobStatus) => {
    if (!job) return;
    const updated = { ...job, status: newStatus };
    setJob(updated);

    const storedJobs = JSON.parse(
      localStorage.getItem("cv_optimizer_jobs") || "[]",
    );
    const updatedJobs = storedJobs.map((j: JobData) =>
      j.id === job.id ? updated : j,
    );
    localStorage.setItem("cv_optimizer_jobs", JSON.stringify(updatedJobs));
  };

  if (!job)
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading workspace...
      </div>
    );

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      {/* HEADER ROW */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/job">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <SectionHeader
          title={job.position}
          subtitle={`Extracted from job posting • Added: ${job.appliedAt}`}
        />
        <div className="ml-auto">
          <Select value={job.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px] rounded-xl font-medium shadow-none border-border/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT PANEL: ANALYSIS & EXTRACTED DATA */}
        <div className="flex flex-col gap-6 overflow-y-auto lg:col-span-5 pb-8 pr-2">
          {/* Metadata Card */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Extracted Details
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm">
                <BuildingIcon className="size-4 text-primary" />
                <span className="font-medium">{job.companyName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <BriefcaseIcon className="size-4 text-primary" />
                <span className="font-medium">{job.position}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <AtSignIcon className="size-4 text-primary" />
                <span className="font-medium">{job.emailTo}</span>
              </div>
            </div>
          </div>

          {/* Match Score Card */}
          <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <ScoreRing score={score} size={84} />
                <div className="flex flex-col">
                  <span className="font-heading text-xl font-bold tracking-tight">
                    Match Score
                  </span>
                  <span className="text-[13px] text-muted-foreground leading-relaxed">
                    Strong candidate. Follow AI suggestions to pass the ATS
                    filter.
                  </span>
                </div>
              </div>
              <Button
                onClick={handleReanalyze}
                disabled={analyzing}
                size="sm"
                variant="outline"
                className="h-8 text-xs shrink-0 rounded-lg"
              >
                <SparklesIcon
                  className={cn("mr-1.5 size-3", analyzing && "animate-spin")}
                />
                {analyzing ? "Analyzing..." : "Re-analyze"}
              </Button>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
              <span className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Actionable Suggestions
              </span>
              {MOCK_RESULT.suggestions.map((s) => (
                <button
                  type="button"
                  key={s.field}
                  onMouseEnter={() => setActiveHighlight(s.field)}
                  onMouseLeave={() => setActiveHighlight(null)}
                  className={cn(
                    "cursor-pointer flex flex-col gap-2 rounded-xl border p-4 transition-colors text-left w-full",
                    activeHighlight === s.field
                      ? "border-primary bg-primary/5"
                      : "border-border/60 bg-muted/20 hover:bg-muted/50",
                  )}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Edit • {s.field}
                  </span>
                  <p className="text-[13px] text-foreground font-medium">
                    {s.issue}
                  </p>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CircleIcon className="mt-1 size-2.5 shrink-0 text-primary" />
                    <span>{s.fix}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: TABBED WORKSPACE (Editor & Email) */}
        <div className="flex flex-col overflow-y-auto lg:col-span-7 pb-8 pr-2">
          <Tabs defaultValue="editor" className="w-full flex flex-col gap-4">
            <TabsList className="w-full h-12 p-1 bg-muted/30 border border-border/60 rounded-xl grid grid-cols-2">
              <TabsTrigger
                value="editor"
                className="rounded-lg text-[13px] font-medium h-full"
              >
                Tailor CV Form
              </TabsTrigger>
              <TabsTrigger
                value="email"
                className="rounded-lg text-[13px] font-medium h-full"
              >
                Email Application
              </TabsTrigger>
            </TabsList>

            {/* TAB: CV EDITOR */}
            <TabsContent
              value="editor"
              className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-6 shadow-sm mt-0 outline-none"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading text-lg font-bold tracking-tight">
                  Smart Resume Builder
                </h3>
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-lg text-xs h-8"
                >
                  Download PDF
                </Button>
              </div>

              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Full Name
                    </Label>
                    <Input
                      value={personal.name}
                      onChange={(e) =>
                        setPersonal({ ...personal, name: e.target.value })
                      }
                      className="rounded-xl shadow-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      value={personal.email}
                      onChange={(e) =>
                        setPersonal({ ...personal, email: e.target.value })
                      }
                      className="rounded-xl shadow-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Summary
                  </Label>
                  <Textarea
                    rows={3}
                    value={personal.summary}
                    onChange={(e) =>
                      setPersonal({ ...personal, summary: e.target.value })
                    }
                    className={cn(
                      "rounded-xl shadow-none transition-all",
                      activeHighlight === "summary" &&
                        "ring-2 ring-primary ring-offset-1",
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Skills
                  </Label>
                  <Textarea
                    rows={2}
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className={cn(
                      "rounded-xl shadow-none transition-all",
                      activeHighlight === "skills" &&
                        "ring-2 ring-primary ring-offset-1",
                    )}
                  />
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/10 p-4">
                  <p className="font-heading text-[13px] font-semibold">
                    Experience 1: Frontend Dev @ Tech Corp
                  </p>
                  <Textarea
                    rows={4}
                    value={exp1}
                    onChange={(e) => setExp1(e.target.value)}
                    className={cn(
                      "rounded-xl shadow-none transition-all",
                      activeHighlight === "experience-1" &&
                        "ring-2 ring-primary ring-offset-1 border-primary",
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB: EMAIL GENERATOR */}
            <TabsContent
              value="email"
              className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-6 shadow-sm mt-0 outline-none"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-heading text-lg font-bold tracking-tight">
                      AI Email Generator
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Based on job description and CV
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateEmail}
                    disabled={generating}
                    className="rounded-xl h-9 text-xs shadow-md"
                  >
                    <SparklesIcon className="mr-2 size-3.5" />
                    {generating ? "Generating..." : "Generate Draft"}
                  </Button>
                </div>

                <div className="flex items-center gap-3 w-full bg-muted/20 p-2 rounded-xl border border-border/60">
                  <Label className="text-xs font-semibold px-2 shrink-0">
                    Template:
                  </Label>
                  <Select
                    value={emailForm.templateId}
                    onValueChange={(v) =>
                      setEmailForm({ ...emailForm, templateId: v })
                    }
                  >
                    <SelectTrigger className="h-8 shadow-none border-transparent bg-transparent hover:bg-muted/40 transition-colors">
                      <SelectValue placeholder="Standard Application" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">AI Default</SelectItem>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {emailGenerated ? (
                <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      To
                    </Label>
                    <Input
                      value={emailForm.to}
                      onChange={(e) =>
                        setEmailForm({ ...emailForm, to: e.target.value })
                      }
                      className="rounded-xl shadow-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Subject
                    </Label>
                    <Input
                      value={emailForm.subject}
                      onChange={(e) =>
                        setEmailForm({ ...emailForm, subject: e.target.value })
                      }
                      className="rounded-xl shadow-none font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Message
                    </Label>
                    <Textarea
                      rows={10}
                      value={emailForm.body}
                      onChange={(e) =>
                        setEmailForm({ ...emailForm, body: e.target.value })
                      }
                      className="rounded-xl shadow-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-3 mt-1">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <DownloadIcon className="size-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">
                          Tailored_CV_{job.companyName.replace(/\s+/g, "_")}.pdf
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Ready to attach • 1.2 MB
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full rounded-xl bg-success text-success-foreground hover:bg-success/90 h-10 mt-2">
                    <MailIcon className="mr-2 size-4" />
                    Copy All & Open Email Client
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[350px] border border-dashed border-border/80 rounded-xl bg-muted/10 text-center px-8">
                  <MailIcon className="size-10 text-muted-foreground/50 mb-4" />
                  <p className="font-heading text-sm font-semibold">
                    No Email Draft Generated
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
                    Click the generate button above to create a tailored
                    application email.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
