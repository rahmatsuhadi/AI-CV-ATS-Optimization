"use client";

import type { JobData } from "@/actions/job";
import { CvFormProvider } from "@/hooks/useCvForm";
import { useJobWorkspace } from "@/hooks/useJobWorkspace";
import { cn } from "@/lib/utils";
import { Step1InputPlan } from "./Step1InputPlan";
import { Step2PreviewExtract } from "./Step2PreviewExtract";
import { Step3CvTailor } from "./Step3CvTailor";
import { Step4EmailGen } from "./Step4EmailGen";

interface JobWorkspaceProps {
  initialJob?: JobData;
}

export function JobWorkspace({ initialJob }: JobWorkspaceProps) {
  const workspaceState = useJobWorkspace(initialJob);

  const {
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
  } = workspaceState;

  const steps = [
    { number: 1, label: "1: Input Lowongan" },
    { number: 2, label: "2: Pratinjau Ekstrak" },
    { number: 3, label: "3: Sesuaikan CV" },
    { number: 4, label: "4: Kirim Email" },
  ];

  return (
    <CvFormProvider value={workspaceState}>
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
                    "flex size-5 md:size-6 items-center justify-center rounded-full text-[10px] md:text-xs border transition-all",
                    isActive
                      ? "bg-primary-foreground text-primary border-primary-foreground"
                      : isCompleted
                        ? "bg-success text-success-foreground border-success"
                        : "border-muted-foreground/30 text-muted-foreground",
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
          {step === 1 && (
            <Step1InputPlan
              rawText={rawText}
              setRawText={setRawText}
              extracting={extracting}
              handleAnalyzeText={handleAnalyzeText}
              readOnly={!!initialJob}
            />
          )}

          {step === 2 && (
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
              salaryRange={salaryRange || "Tidak disebutkan"}
              setSalaryRange={setSalaryRange}
              saving={saving}
              handleBack={() => setStep(1)}
              handleSave={handleSaveToSupabase}
              readOnly={!!initialJob}
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
    </CvFormProvider>
  );
}
