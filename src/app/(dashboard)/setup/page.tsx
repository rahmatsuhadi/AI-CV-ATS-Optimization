"use client";

import {
  ArrowRightIcon,
  Loader2Icon,
  PlusIcon,
  UploadIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCV, parsePdfToCv } from "@/actions/cv";
import { Logo } from "@/components/atoms/Logo";
import { Button } from "@/components/ui/button";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Parse PDF using local LLM server
      const res = await parsePdfToCv(formData);

      if (res.error || !res.data) {
        setError(res.error || "Gagal mengurai CV.");
        setLoading(false);
        return;
      }

      // 2. Save structured JSON to Supabase as base CV
      const cleanFileName = file.name.replace(/\.[^/.]+$/, ""); // hapus ekstensi
      const saveRes = await createCV(cleanFileName, res.data, true); // true = set as base

      if (saveRes.success && saveRes.data) {
        router.push(`/cv/${saveRes.data.id}/edit`);
      } else {
        setError(saveRes.error || "Gagal menyimpan CV hasil analisis.");
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("cv_onboard_skip", "true");
    router.push("/dashboard");
  };

  const handleBuildScratch = async () => {
    setLoading(true);
    setError(null);
    try {
      const defaultJson = {
        personal: { name: "", email: "", phone: "", summary: "" },
        skills: [],
        experience: [],
      };
      const res = await createCV("Base CV", defaultJson, true); // true = set as base
      if (res.success && res.data) {
        router.push(`/cv/${res.data.id}/edit`);
      } else {
        setError(res.error || "Gagal membuat CV baru.");
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-12">
        <Logo />
      </div>

      <div className="flex max-w-2xl flex-col items-center gap-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Let&apos;s build your Base CV
        </h1>
        <p className="text-muted-foreground">
          To unlock AI tailoring and match analysis, we need a baseline CV to
          work from. You can upload your existing resume, or build one from
          scratch.
        </p>

        {error && (
          <div className="w-full rounded-xl bg-danger/15 p-3 text-xs text-danger font-medium text-left">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/60 bg-card p-12 w-full">
            <Loader2Icon className="size-10 animate-spin text-primary" />
            <p className="font-heading font-medium text-sm">
              Extracting & Parsing CV...
            </p>
            <p className="text-xs text-muted-foreground">
              AI is structuring your details, please wait.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="group flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <UploadIcon className="size-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-heading font-semibold">
                  Upload PDF CV
                </span>
                <span className="text-xs text-muted-foreground">
                  We&apos;ll parse it into structured data
                </span>
              </div>
            </label>

            <button
              type="button"
              onClick={handleBuildScratch}
              className="group flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <PlusIcon className="size-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-heading font-semibold">
                  Build from Scratch
                </span>
                <span className="text-xs text-muted-foreground">
                  Use our guided forms
                </span>
              </div>
            </button>
          </div>
        )}

        <Button
          variant="ghost"
          className="mt-8 text-muted-foreground hover:text-foreground"
          onClick={handleSkip}
          disabled={loading}
        >
          Skip for now (Features will be limited)
          <ArrowRightIcon className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}
