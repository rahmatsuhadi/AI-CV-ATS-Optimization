"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createJob, extractJobDetails } from "@/actions/job";
import { Step1InputPlan } from "@/components/organisms/job-workspace/Step1InputPlan";
import { Step2PreviewExtract } from "@/components/organisms/job-workspace/Step2PreviewExtract";
import { cn } from "@/lib/utils";

export function NewJobForm() {
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState<number>(1);
  const [maxStep, setMaxStep] = useState<number>(1);

  // Step 1 states
  const [rawText, setRawText] = useState("");
  const [extracting, setExtracting] = useState(false);

  // Step 2 states (Extracted details)
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [position, setPosition] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState("");
  const [saving, setSaving] = useState(false);

  // Extract text and details using AI Server Action
  const handleAnalyzeText = async () => {
    if (!rawText.trim()) {
      toast.error("Silakan isi deskripsi pekerjaan terlebih dahulu.");
      return;
    }

    setExtracting(true);
    const toastId = toast.loading("Mengekstrak rincian lowongan...");

    try {
      const res = await extractJobDetails(rawText);
      toast.dismiss(toastId);

      if (res.success && res.data) {
        setCompanyName(res.data.company_name || "");
        setLocation(res.data.location || "");
        setPosition(res.data.position || "");
        setEmailTo(res.data.email_to || "");
        setRequirements(res.data.requirements || []);
        setSalaryRange(res.data.salary_range || "Tidak disebutkan");

        setMaxStep(2);
        setStep(2);
        toast.success("Rincian lowongan kerja berhasil diekstrak!");
      } else {
        toast.error(res.error || "Gagal mengekstrak detail lowongan.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Terjadi kesalahan saat mengekstrak data.");
    } finally {
      setExtracting(false);
    }
  };

  // Create job in Supabase & redirect to details page
  const handleSaveToSupabase = async () => {
    if (!companyName.trim() || !position.trim()) {
      toast.error("Nama Perusahaan dan Posisi tidak boleh kosong.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Menyimpan rincian pekerjaan...");

    try {
      const res = await createJob({
        company_name: companyName,
        position,
        location: location || null,
        email_to: emailTo || null,
        status: "draft",
        description: rawText,
        requirements,
        salary_range: salaryRange || null,
      });

      toast.dismiss(toastId);
      if (res.success && res.data) {
        toast.success("Pekerjaan berhasil disimpan dan mulai ditrack!");
        router.push(`/job/${res.data.id}`);
      } else {
        toast.error(res.error || "Gagal menyimpan pekerjaan.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { number: 1, label: "1: Input Lowongan" },
    { number: 2, label: "2: Pratinjau Ekstrak" },
    { number: 3, label: "3: Sesuaikan CV" },
    { number: 4, label: "4: Kirim Email" },
  ];

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

      <div className="flex flex-col gap-6">
        {/* Connected Wizard Indicator (Seamless across pages) */}
        <div className="flex flex-wrap gap-2 md:gap-4 justify-between bg-muted/30 p-2.5 rounded-2xl border border-border/60">
          {steps.map((s) => {
            const isActive = step === s.number;
            const isCompleted = s.number < step;
            const isDisabled = s.number > maxStep;

            return (
              <button
                key={s.number}
                type="button"
                onClick={() => setStep(s.number)}
                disabled={isDisabled}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs md:text-sm font-semibold transition-all border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm scale-102"
                    : isCompleted
                      ? "bg-success/15 text-success border-success/30 hover:bg-success/20"
                      : "bg-background/40 border-border/40 text-muted-foreground hover:text-foreground",
                  isDisabled && "opacity-45 cursor-not-allowed",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    isActive
                      ? "bg-primary-foreground text-primary"
                      : isCompleted
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? "✓" : s.number}
                </span>
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Steps Rendering */}
        <div className="flex-1">
          {step === 1 ? (
            <Step1InputPlan
              rawText={rawText}
              setRawText={setRawText}
              extracting={extracting}
              handleAnalyzeText={handleAnalyzeText}
            />
          ) : (
            <Step2PreviewExtract
              companyName={companyName}
              setCompanyName={setCompanyName}
              location={location}
              setLocation={setLocation}
              position={position}
              setPosition={setPosition}
              emailTo={emailTo}
              setEmailTo={setEmailTo}
              requirements={requirements}
              setRequirements={setRequirements}
              salaryRange={salaryRange}
              setSalaryRange={setSalaryRange}
              saving={saving}
              handleBack={() => setStep(1)}
              handleSave={handleSaveToSupabase}
            />
          )}
        </div>
      </div>
    </div>
  );
}
