import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { JobData } from "@/actions/job";
import { createJob, extractJobDetails } from "@/actions/job";
import { useCvTailor } from "./useCvTailor";
import { useEmailGenerator } from "./useEmailGenerator";

export function useJobWorkspace(initialJob?: JobData) {
  const router = useRouter();

  // Wizard state: start at Step 3 for existing job (since steps 1 & 2 are done), otherwise Step 1 for new job
  const [step, setStep] = useState<number>(initialJob ? 3 : 1);
  const [maxStep, setMaxStep] = useState<number>(
    initialJob
      ? initialJob.ats_score !== undefined &&
        initialJob.ats_score !== null &&
        initialJob.ats_score > 0
        ? 4
        : 3
      : 1,
  );

  // Job states (editable for new jobs, read-only/loaded for existing ones)
  const [rawText, setRawText] = useState(initialJob?.description || "");
  const [companyName, setCompanyName] = useState(
    initialJob?.company_name || "",
  );
  const [location, setLocation] = useState(initialJob?.location || "");
  const [position, setPosition] = useState(initialJob?.position || "");
  const [emailTo, setEmailTo] = useState(initialJob?.email_to || "");
  const [requirements, setRequirements] = useState<string[]>(
    initialJob?.requirements || [],
  );
  const [salaryRange, setSalaryRange] = useState(
    initialJob?.salary_range || "",
  );

  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Action: Extract text using AI Server Action
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

  // Action: Create job in Supabase and redirect to job detail page
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

  // Compose CV Tailor & Match Hook
  const cvTailor = useCvTailor(initialJob, () => setMaxStep(4));

  // Compose Email Generator Hook
  const emailGen = useEmailGenerator(
    companyName,
    position,
    emailTo,
    cvTailor.personal,
  );

  return {
    step,
    setStep,
    maxStep,
    setMaxStep,
    rawText,
    setRawText,
    companyName,
    setCompanyName,
    location,
    setLocation,
    position,
    setPosition,
    emailTo,
    setEmailTo,
    requirements,
    setRequirements,
    salaryRange,
    setSalaryRange,
    extracting,
    saving,
    handleAnalyzeText,
    handleSaveToSupabase,
    ...cvTailor,
    ...emailGen,
  };
}

export type { CvAlert, Suggestion } from "./useCvTailor";
