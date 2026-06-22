import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckIcon,
  CircleIcon,
  Loader2Icon,
  PrinterIcon,
  SaveIcon,
  ScanSearchIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { applyCvSuggestion } from "@/actions/job";
import { ScoreRing } from "@/components/atoms/ScoreRing";
import { EducationForm } from "@/components/organisms/cv-edit/EducationForm";
import { ExperienceForm } from "@/components/organisms/cv-edit/ExperienceForm";
// Organisms from cv-edit
import { PersonalForm } from "@/components/organisms/cv-edit/PersonalForm";
import { SkillsOthersForm } from "@/components/organisms/cv-edit/SkillsOthersForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCvFormContext } from "@/hooks/useCvForm";
import { cn } from "@/lib/utils";
import { DiffViewer } from "./DiffViewer";

interface Suggestion {
  field: string;
  tab: string;
  issue: string;
  fix: string;
}

interface CvAlert {
  type: "education" | "language" | "age" | "generic";
  title: string;
  message: string;
}

interface Step3CvTailorProps {
  matchCalculated: boolean;
  loadingMatch: boolean;
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  alerts: CvAlert[];
  activeHighlight: string | null;
  setActiveHighlight: (val: string | null) => void;
  activeCvTab: string;
  setActiveCvTab: (val: string) => void;
  cvSaving: boolean;
  handleSaveCv: () => void;
  handleRunAnalysis: () => void;
  handleNext: () => void;
  cvId?: string;
}

export function Step3CvTailor({
  matchCalculated,
  loadingMatch,
  matchScore,
  matchedKeywords,
  missingKeywords,
  suggestions,
  alerts,
  activeHighlight,
  setActiveHighlight,
  activeCvTab,
  setActiveCvTab,
  cvSaving,
  handleSaveCv,
  handleRunAnalysis,
  handleNext,
  cvId,
}: Step3CvTailorProps) {
  const [applyingKey, setApplyingKey] = useState<string | null>(null);

  const {
    personal,
    setPersonal,
    experiences,
    setExperiences,
    educations,
    setEducations,
    skillsAchievements,
    setSkillsAchievements,
  } = useCvFormContext();

  const handleSelectSuggestion = (s: Suggestion) => {
    setActiveHighlight(s.field);
    setActiveCvTab(s.tab);
    toast.info(`Fokus diarahkan ke tab: ${s.tab.toUpperCase()}`);
    setTimeout(() => {
      const element = document.getElementById(s.field);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          (element as HTMLElement).focus();
        }
      }
    }, 100);
  };

  const [diffPreview, setDiffPreview] = useState<{
    suggestion: Suggestion;
    oldData: unknown;
    newData: unknown;
    rawNewObject: unknown;
  } | null>(null);

  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);

  const handleApplySuggestion = async (s: Suggestion) => {
    const key = s.field + s.fix;
    setApplyingKey(key);
    const toastId = toast.loading("Menganalisis perbaikan dengan AI...");

    try {
      let currentData: unknown = null;

      if (s.tab === "personal") {
        currentData = { text: personal.summary || "" };
      } else if (s.tab === "experience") {
        const match = s.field.match(/experience-(\d+)/);
        const idx = match ? Number.parseInt(match[1], 10) - 1 : 0;
        currentData = experiences[idx] || {
          company: "",
          location: "",
          position: "",
          duration: "",
          bullets: [],
        };
      } else if (s.tab === "education") {
        currentData = educations[0] || {
          institution: "",
          degree: "",
          duration: "",
          bullets: [],
        };
      } else if (s.tab === "skills-others") {
        currentData = skillsAchievements;
      }

      const res = await applyCvSuggestion(
        s.tab,
        s.field,
        currentData,
        s.fix,
        s.issue,
      );

      toast.dismiss(toastId);

      if (res.success && res.data) {
        setDiffPreview({
          suggestion: s,
          oldData: currentData,
          newData: res.data,
          rawNewObject: res.data,
        });
      } else {
        toast.error(res.error || "Gagal menerapkan saran perbaikan.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Terjadi kesalahan saat menerapkan saran.");
    } finally {
      setApplyingKey(null);
    }
  };

  const handleConfirmRevision = () => {
    if (!diffPreview) return;
    const { suggestion, rawNewObject } = diffPreview;

    if (suggestion.tab === "personal") {
      const data = rawNewObject as { text?: string };
      setPersonal((prev) => ({ ...prev, summary: data.text || "" }));
      toast.success("Ringkasan Profesional berhasil diperbarui!");
    } else if (suggestion.tab === "experience") {
      const match = suggestion.field.match(/experience-(\d+)/);
      const idx = match ? Number.parseInt(match[1], 10) - 1 : 0;
      setExperiences((prev) => {
        const updated = [...prev];
        if (idx >= updated.length) {
          updated.push(rawNewObject as (typeof experiences)[number]);
        } else {
          updated[idx] = rawNewObject as (typeof experiences)[number];
        }
        return updated;
      });
      toast.success("Pengalaman Kerja berhasil disesuaikan!");
    } else if (suggestion.tab === "education") {
      setEducations((prev) => {
        const updated = [...prev];
        if (updated.length === 0) {
          updated.push(rawNewObject as (typeof educations)[number]);
        } else {
          updated[0] = rawNewObject as (typeof educations)[number];
        }
        return updated;
      });
      toast.success("Pendidikan berhasil disesuaikan!");
    } else if (suggestion.tab === "skills-others") {
      setSkillsAchievements(rawNewObject as typeof skillsAchievements);
      toast.success("Keahlian & Prestasi berhasil disesuaikan!");
    }

    const key = suggestion.field + suggestion.fix;
    setAppliedSuggestions((prev) => [...prev, key]);
    setDiffPreview(null);
  };

  // If analysis is not yet triggered, show only the "Analyze & Match" button card
  if (!matchCalculated) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-12 shadow-sm text-center flex flex-col items-center justify-center gap-6 min-h-[350px]">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <ScanSearchIcon className="size-8" />
        </div>
        <div className="flex flex-col gap-1.5 max-w-md">
          <h3 className="font-heading text-xl font-bold">
            Analisis & Pencocokan CV
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sistem akan membandingkan persyaratan lowongan dengan Base CV kamu
            untuk menghitung kecocokan ATS dan memberikan saran perbaikan.
          </p>
        </div>
        <Button
          onClick={handleRunAnalysis}
          disabled={loadingMatch}
          className="rounded-xl font-semibold shadow-md px-6 py-2"
        >
          {loadingMatch ? (
            <>
              <Loader2Icon className="mr-2 size-4 animate-spin" /> Menganalisis
              CV...
            </>
          ) : (
            <>
              <ScanSearchIcon className="mr-2 size-4" /> Mulai Analisis
              Kecocokan
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
      {/* LEFT PANEL: ANALYSIS & SUGGESTIONS */}
      <div className="flex flex-col gap-6 lg:col-span-5 min-w-0">
        <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-6 shadow-sm overflow-hidden">
          <div className="flex items-center gap-5">
            <ScoreRing score={matchScore} size={84} />
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold tracking-tight">
                Skor Kecocokan
              </span>
              <span className="text-[13px] text-muted-foreground leading-relaxed">
                {matchScore >= 80
                  ? "Sangat kuat! Lakukan penyesuaian kecil di bawah untuk lolos filter ATS."
                  : matchScore >= 60
                    ? "Kecocokan sedang. Tambahkan beberapa kata kunci penting di kanan agar makin mantap."
                    : "Kecocokan rendah. Kamu butuh modifikasi CV yang signifikan sesuai kualifikasi."}
              </span>
            </div>
          </div>

          <Separator />

          {/* Keyword Analysis Tags */}
          <div className="flex flex-col gap-3">
            <span className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Analisis Kata Kunci
            </span>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-success flex items-center gap-1.5">
                ✓ Sesuai ({matchedKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-success/10 text-success font-semibold border border-success/20"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <span className="text-xs font-medium text-danger flex items-center gap-1.5">
                ✗ Belum ada ({missingKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-danger/10 text-danger font-semibold border border-danger/20"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Dealbreaker Alerts List */}
          {alerts.length > 0 && (
            <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 animate-in slide-in-from-top-3 duration-300">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <AlertTriangleIcon className="size-4 shrink-0" />
                Peringatan Dealbreaker Kualifikasi
              </div>
              <div className="flex flex-col gap-2">
                {alerts.map((al) => (
                  <div
                    key={al.title + al.message}
                    className="text-xs text-foreground/90 leading-relaxed pl-2 border-l-2 border-amber-500"
                  >
                    <strong className="font-semibold text-foreground">
                      {al.title}:
                    </strong>{" "}
                    {al.message}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal italic mt-1.5">
                * Peringatan ini mendeteksi persyaratan mutlak yang tidak
                tertera di CV kamu. Silakan sesuaikan CV jika memang kamu
                memilikinya, agar tidak gugur di filter awal.
              </p>
            </div>
          )}

          {alerts.length > 0 && <Separator />}

          {/* Suggestions List */}
          <div className="flex flex-col gap-3">
            <span className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Saran Perbaikan (klik untuk sorot)
            </span>

            <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {suggestions.map((s) => (
                // biome-ignore lint/a11y/useSemanticElements: using a div with role="button" because nesting <button> (Setuju) inside a <button> is invalid HTML.
                <div
                  key={s.field + s.fix}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectSuggestion(s)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectSuggestion(s);
                    }
                  }}
                  className={cn(
                    "cursor-pointer flex flex-col gap-2 rounded-xl border p-4 transition-all text-left w-full focus:outline-none focus:ring-2 focus:ring-primary/50",
                    activeHighlight === s.field
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border/60 bg-muted/20 hover:bg-muted/50",
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-primary font-bold">
                      Tautkan ke • {s.tab}
                    </span>
                    {activeHighlight === s.field && (
                      <span className="text-[10px] text-primary font-bold animate-pulse">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-foreground font-semibold leading-snug">
                    {s.issue}
                  </p>
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground border-t border-border/40 pt-2 mt-1">
                    <CircleIcon className="mt-1 size-2 shrink-0 text-primary fill-primary/30" />
                    <span className="italic">{s.fix}</span>
                  </div>
                  <div className="mt-2.5 flex justify-end">
                    <Button
                      size="sm"
                      variant={
                        appliedSuggestions.includes(s.field + s.fix)
                          ? "ghost"
                          : activeHighlight === s.field
                            ? "default"
                            : "outline"
                      }
                      disabled={
                        applyingKey !== null ||
                        appliedSuggestions.includes(s.field + s.fix)
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplySuggestion(s);
                      }}
                      className={cn(
                        "h-7 rounded-lg text-[11px] font-semibold px-3 py-1 shadow-sm cursor-pointer transition-all",
                        appliedSuggestions.includes(s.field + s.fix) &&
                          "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 hover:bg-green-500/10",
                      )}
                    >
                      {applyingKey === s.field + s.fix ? (
                        <>
                          <Loader2Icon className="mr-1.5 size-3 animate-spin" />
                          Menerapkan...
                        </>
                      ) : appliedSuggestions.includes(s.field + s.fix) ? (
                        <>
                          <CheckIcon className="mr-1.5 size-3" />
                          Sudah Disetujui
                        </>
                      ) : (
                        <>
                          <CheckIcon className="mr-1.5 size-3" />
                          Setuju
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: IN-PLACE CV EDITOR */}
      <div className="flex flex-col lg:col-span-7 min-w-0">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm flex flex-col gap-5 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-heading text-lg font-bold tracking-tight">
                Sesuaikan CV untuk Lowongan
              </h3>
              <p className="text-xs text-muted-foreground">
                Edit resume kamu secara interaktif. Klik saran di kiri untuk
                langsung menuju kolomnya.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {cvId && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-xl h-9 text-xs font-semibold border-border shadow-sm"
                >
                  <Link href={`/cv/${cvId}/preview`}>
                    <PrinterIcon className="mr-1.5 size-3.5" />
                    Pratinjau & PDF
                  </Link>
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleSaveCv}
                disabled={cvSaving}
                className="rounded-xl h-9 text-xs font-semibold bg-success hover:bg-success/90 text-success-foreground shadow-sm"
              >
                {cvSaving ? (
                  <Loader2Icon className="mr-1.5 size-3.5 animate-spin" />
                ) : (
                  <SaveIcon className="mr-1.5 size-3.5" />
                )}
                Simpan CV
              </Button>
            </div>
          </div>

          <Separator />

          {/* CV Editor Tabs */}
          <Tabs
            value={activeCvTab}
            onValueChange={setActiveCvTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 h-12">
              <TabsTrigger
                value="personal"
                className="rounded-lg py-2 text-xs font-medium"
              >
                Info Pribadi
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="rounded-lg py-2 text-xs font-medium"
              >
                Pengalaman
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="rounded-lg py-2 text-xs font-medium"
              >
                Pendidikan
              </TabsTrigger>
              <TabsTrigger
                value="skills-others"
                className="rounded-lg py-2 text-xs font-medium"
              >
                Keahlian & Lainnya
              </TabsTrigger>
            </TabsList>

            {/* TAB CONTENTS WITH ACCENT RING HIGHLIGHT */}
            <TabsContent
              value="personal"
              className={cn(
                "outline-none rounded-xl mt-3",
                activeHighlight === "personal-summary" &&
                  "ring-2 ring-primary ring-offset-2 border-primary",
              )}
            >
              <PersonalForm hideIsBase />
            </TabsContent>

            <TabsContent
              value="experience"
              className={cn(
                "outline-none rounded-xl mt-3",
                activeHighlight === "experience-1" &&
                  "ring-2 ring-primary ring-offset-2 border-primary",
              )}
            >
              <ExperienceForm />
            </TabsContent>

            <TabsContent
              value="education"
              className="outline-none rounded-xl mt-3"
            >
              <EducationForm />
            </TabsContent>

            <TabsContent
              value="skills-others"
              className={cn(
                "outline-none rounded-xl mt-3",
                activeHighlight === "skills-others" &&
                  "ring-2 ring-primary ring-offset-2 border-primary",
              )}
            >
              <SkillsOthersForm />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end items-center border-t border-border/40 pt-5 mt-6">
          <Button
            onClick={handleNext}
            className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground px-6 py-2 shadow-sm font-semibold animate-in zoom-in-95 duration-300"
          >
            Lanjut ke Email Lamaran <ArrowRightIcon className="ml-2 size-4" />
          </Button>
        </div>
      </div>

      {/* Dialog Preview Perubahan (GitHub-Style Diff) */}
      <Dialog
        open={diffPreview !== null}
        onOpenChange={(open) => {
          if (!open) setDiffPreview(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-6 rounded-2xl">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-lg font-bold">
              Pratinjau Perubahan CV
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tinjau revisi otomatis dari AI untuk menyelaraskan CV dengan
              persyaratan lowongan.
            </DialogDescription>
          </DialogHeader>

          {diffPreview && (
            <div className="flex flex-col gap-4 overflow-y-auto pr-1 my-3">
              <div className="flex flex-col gap-1 border border-border/40 p-3.5 rounded-xl bg-primary/5">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Saran yang Disetujui:
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {diffPreview.suggestion.issue}
                </p>
                <p className="text-xs text-muted-foreground italic mt-0.5">
                  Tindakan: {diffPreview.suggestion.fix}
                </p>
              </div>

              <DiffViewer
                tab={diffPreview.suggestion.tab}
                oldVal={diffPreview.oldData}
                newVal={diffPreview.newData}
              />
            </div>
          )}

          <DialogFooter className="gap-2 pt-2 border-t border-border/40">
            <Button
              variant="outline"
              onClick={() => setDiffPreview(null)}
              className="rounded-xl px-4 text-xs font-semibold cursor-pointer"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmRevision}
              className="rounded-xl px-5 text-xs font-semibold bg-primary hover:bg-primary/95 text-primary-foreground cursor-pointer"
            >
              Terapkan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
