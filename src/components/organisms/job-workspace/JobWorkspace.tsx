"use client";

import type { JobData } from "@/actions/job";
import { useJobWorkspace } from "@/hooks/useJobWorkspace";
import { cn } from "@/lib/utils";
import { Step1InputPlan } from "./Step1InputPlan";
import { Step2PreviewExtract } from "./Step2PreviewExtract";
import { Step3CvTailor } from "./Step3CvTailor";
import { Step4EmailGen } from "./Step4EmailGen";

interface JobWorkspaceProps {
  initialJob: JobData;
}

export function JobWorkspace({ initialJob }: JobWorkspaceProps) {
  const {
    step,
    setStep,
    maxStep,
    setMaxStep,
    rawText,
    companyName,
    location,
    position,
    emailTo,
    requirements,
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
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    emailForm,
    setEmailForm,
    emailGenerated,
    handleRunAnalysis,
    handleSaveCv,
    handleGenerateEmailDraft,
    handleSendEmail,
  } = useJobWorkspace(initialJob);

  const steps = [
    { number: 1, label: "1: Input Plan" },
    { number: 2, label: "2: Preview Extract" },
    { number: 3, label: "3: CV Tailor & Match" },
    { number: 4, label: "4: Email Application" },
  ];

  return (
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
        {step === 1 && <Step1InputPlan rawText={rawText} readOnly={true} />}

        {step === 2 && (
          <Step2PreviewExtract
            companyName={companyName}
            location={location}
            position={position}
            emailTo={emailTo}
            requirements={requirements}
            salaryRange={initialJob.salary_range || "Tidak disebutkan"}
            readOnly={true}
          />
        )}

        {step === 3 && (
          <Step3CvTailor
            matchCalculated={matchCalculated}
            loadingMatch={loadingMatch}
            matchScore={matchScore}
            matchedKeywords={matchedKeywords}
            missingKeywords={missingKeywords}
            suggestions={suggestions}
            alerts={alerts}
            activeHighlight={activeHighlight}
            setActiveHighlight={setActiveHighlight}
            activeCvTab={activeCvTab}
            setActiveCvTab={setActiveCvTab}
            cvName={cvName}
            setCvName={setCvName}
            cvIsBase={cvIsBase}
            setCvIsBase={setCvIsBase}
            personal={personal}
            setPersonal={setPersonal}
            experiences={experiences}
            addExperience={addExperience}
            updateExperience={updateExperience}
            removeExperience={removeExperience}
            addExperienceBullet={addExperienceBullet}
            updateExperienceBullet={updateExperienceBullet}
            removeExperienceBullet={removeExperienceBullet}
            educations={educations}
            addEducation={addEducation}
            updateEducation={updateEducation}
            removeEducation={removeEducation}
            addEducationBullet={addEducationBullet}
            updateEducationBullet={updateEducationBullet}
            removeEducationBullet={removeEducationBullet}
            skillsAchievements={skillsAchievements}
            addSkillAchievement={addSkillAchievement}
            updateSkillAchievement={updateSkillAchievement}
            removeSkillAchievement={removeSkillAchievement}
            expandedItems={expandedItems}
            toggleExpandItem={toggleExpandItem}
            cvSaving={cvSaving}
            handleSaveCv={handleSaveCv}
            handleRunAnalysis={handleRunAnalysis}
            handleNext={() => {
              setMaxStep(4);
              setStep(4);
              handleGenerateEmailDraft();
            }}
          />
        )}

        {step === 4 && (
          <Step4EmailGen
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            setSelectedTemplateId={setSelectedTemplateId}
            emailForm={emailForm}
            setEmailForm={setEmailForm}
            emailGenerated={emailGenerated}
            companyName={companyName}
            handleGenerateEmail={handleGenerateEmailDraft}
            handleSendEmail={handleSendEmail}
            handleBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
}
