import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CircleIcon,
  Loader2Icon,
  SaveIcon,
  ScanSearchIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ScoreRing } from "@/components/atoms/ScoreRing";
import { EducationForm } from "@/components/organisms/cv-edit/EducationForm";
import { ExperienceForm } from "@/components/organisms/cv-edit/ExperienceForm";
// Organisms from cv-edit
import { PersonalForm } from "@/components/organisms/cv-edit/PersonalForm";
import { SkillsOthersForm } from "@/components/organisms/cv-edit/SkillsOthersForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Types
import type {
  Education,
  Experience,
  Personal,
  SkillAchievementItem,
} from "@/types/cv";

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
  cvName: string;
  setCvName: (val: string) => void;
  cvIsBase: boolean;
  setCvIsBase: (val: boolean) => void;
  personal: Personal;
  setPersonal: React.Dispatch<React.SetStateAction<Personal>>;
  experiences: Experience[];
  addExperience: () => void;
  updateExperience: (index: number, fields: Partial<Experience>) => void;
  removeExperience: (index: number) => void;
  addExperienceBullet: (expIndex: number) => void;
  updateExperienceBullet: (
    expIndex: number,
    bulletIndex: number,
    value: string,
  ) => void;
  removeExperienceBullet: (expIndex: number, bulletIndex: number) => void;
  educations: Education[];
  addEducation: () => void;
  updateEducation: (index: number, fields: Partial<Education>) => void;
  removeEducation: (index: number) => void;
  addEducationBullet: (eduIndex: number) => void;
  updateEducationBullet: (
    eduIndex: number,
    bulletIndex: number,
    value: string,
  ) => void;
  removeEducationBullet: (eduIndex: number, bulletIndex: number) => void;
  skillsAchievements: SkillAchievementItem[];
  addSkillAchievement: () => void;
  updateSkillAchievement: (
    index: number,
    fields: Partial<SkillAchievementItem>,
  ) => void;
  removeSkillAchievement: (index: number) => void;
  expandedItems: string[];
  toggleExpandItem: (id: string) => void;
  cvSaving: boolean;
  handleSaveCv: () => void;
  handleRunAnalysis: () => void;
  handleNext: () => void;
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
  cvName,
  setCvName,
  cvIsBase,
  setCvIsBase,
  personal,
  setPersonal,
  experiences,
  addExperience,
  updateExperience,
  removeExperience,
  addExperienceBullet,
  updateExperienceBullet,
  removeExperienceBullet,
  educations,
  addEducation,
  updateEducation,
  removeEducation,
  addEducationBullet,
  updateEducationBullet,
  removeEducationBullet,
  skillsAchievements,
  addSkillAchievement,
  updateSkillAchievement,
  removeSkillAchievement,
  expandedItems,
  toggleExpandItem,
  cvSaving,
  handleSaveCv,
  handleRunAnalysis,
  handleNext,
}: Step3CvTailorProps) {
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
                <button
                  type="button"
                  key={s.field + s.fix}
                  onClick={() => {
                    setActiveHighlight(s.field);
                    setActiveCvTab(s.tab);
                    toast.info(
                      `Fokus diarahkan ke tab: ${s.tab.toUpperCase()}`,
                    );
                  }}
                  className={cn(
                    "cursor-pointer flex flex-col gap-2 rounded-xl border p-4 transition-all text-left w-full",
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
                </button>
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

          <Separator />

          {/* CV Editor Tabs */}
          <Tabs
            value={activeCvTab}
            onValueChange={setActiveCvTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/40 rounded-xl border border-border/60">
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
              <PersonalForm
                personal={personal}
                setPersonal={setPersonal}
                name={cvName}
                setName={setCvName}
                isBase={cvIsBase}
                setIsBase={setCvIsBase}
              />
            </TabsContent>

            <TabsContent
              value="experience"
              className={cn(
                "outline-none rounded-xl mt-3",
                activeHighlight === "experience-1" &&
                  "ring-2 ring-primary ring-offset-2 border-primary",
              )}
            >
              <ExperienceForm
                experiences={experiences}
                addExperience={addExperience}
                updateExperience={updateExperience}
                removeExperience={removeExperience}
                addExperienceBullet={addExperienceBullet}
                updateExperienceBullet={updateExperienceBullet}
                removeExperienceBullet={removeExperienceBullet}
              />
            </TabsContent>

            <TabsContent
              value="education"
              className="outline-none rounded-xl mt-3"
            >
              <EducationForm
                educations={educations}
                addEducation={addEducation}
                updateEducation={updateEducation}
                removeEducation={removeEducation}
                addEducationBullet={addEducationBullet}
                updateEducationBullet={updateEducationBullet}
                removeEducationBullet={removeEducationBullet}
              />
            </TabsContent>

            <TabsContent
              value="skills-others"
              className={cn(
                "outline-none rounded-xl mt-3",
                activeHighlight === "skills-others" &&
                  "ring-2 ring-primary ring-offset-2 border-primary",
              )}
            >
              <SkillsOthersForm
                skillsAchievements={skillsAchievements}
                addSkillAchievement={addSkillAchievement}
                updateSkillAchievement={updateSkillAchievement}
                removeSkillAchievement={removeSkillAchievement}
                expandedItems={expandedItems}
                toggleExpandItem={toggleExpandItem}
              />
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
    </div>
  );
}
