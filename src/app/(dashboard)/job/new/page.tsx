"use client";

import { ArrowLeftIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    setLoading(true);

    // AI extraction simulation logic
    let companyName = "Unknown Company";
    let position = "Software Engineer";
    let emailTo = "hr@company.com";

    // Simple heuristic parser for demo
    const lowerText = rawText.toLowerCase();
    if (lowerText.includes("tokopedia")) companyName = "Tokopedia";
    else if (lowerText.includes("gojek")) companyName = "Gojek";
    else if (lowerText.includes("shopee")) companyName = "Shopee";
    else if (lowerText.includes("traveloka")) companyName = "Traveloka";

    if (lowerText.includes("frontend")) position = "Frontend Developer";
    else if (lowerText.includes("backend")) position = "Backend Developer";
    else if (
      lowerText.includes("fullstack") ||
      lowerText.includes("full stack")
    )
      position = "Full Stack Engineer";

    const emailMatch = rawText.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    );
    if (emailMatch) {
      emailTo = emailMatch[0];
    }

    const existingJobs = JSON.parse(
      localStorage.getItem("cv_optimizer_jobs") || "[]",
    );
    const newJob = {
      id: Date.now().toString(),
      companyName,
      position,
      emailTo,
      description: rawText,
      status: "applied",
      appliedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    localStorage.setItem(
      "cv_optimizer_jobs",
      JSON.stringify([newJob, ...existingJobs]),
    );

    setTimeout(() => {
      setLoading(false);
      router.push(`/job/${newJob.id}`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/job">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <SectionHeader
          title="Analyze New Job Posting"
          subtitle="Paste job details from LinkedIn, Instagram, or message portals."
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="rawText"
            className="text-sm font-semibold tracking-tight"
          >
            Job Posting Raw Text
          </label>
          <p className="text-xs text-muted-foreground">
            Just copy and paste the entire job post. AI will extract company
            name, position, emails, and analyze match score against your CV.
          </p>
          <Textarea
            id="rawText"
            rows={12}
            placeholder="Paste LinkedIn post, job description, or HR message text here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="rounded-xl mt-2 font-sans text-sm focus:ring-1 focus:ring-primary/40 focus:border-primary/40"
            required
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-border/60 pt-4 mt-2">
          <Button variant="outline" className="rounded-xl" asChild>
            <Link href="/job">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={loading || !rawText.trim()}
            className="rounded-xl"
          >
            <SparklesIcon className="mr-2 size-4" />
            {loading ? "Analyzing & Comparing..." : "Analyze & Match CV"}
          </Button>
        </div>
      </form>
    </div>
  );
}
