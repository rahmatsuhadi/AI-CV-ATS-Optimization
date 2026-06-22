import { useState } from "react";
import { toast } from "sonner";
import { getBaseCV, updateCV } from "@/actions/cv";
import type { JobData } from "@/actions/job";
import { analyzeCvMatch, updateJob } from "@/actions/job";
import { parseCvStructuredJson } from "@/services/cv-parser";
import type { CvData, ParsedCvData } from "@/types/cv";
import { useCvForm } from "./useCvForm";

export interface Suggestion {
  field: string;
  tab: string;
  issue: string;
  fix: string;
}

export interface CvAlert {
  type: "education" | "language" | "age" | "generic";
  title: string;
  message: string;
}

export function useCvTailor(
  initialJob?: JobData,
  onAnalysisComplete?: () => void,
) {
  // Backward compatibility helper for suggestions and alerts stored in JSONB
  const getInitialSuggestions = (): Suggestion[] => {
    const raw = initialJob?.ai_suggestions;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw as Suggestion[];
    return (raw as { suggestions?: Suggestion[] }).suggestions || [];
  };

  const getInitialAlerts = (): CvAlert[] => {
    const raw = initialJob?.ai_suggestions;
    if (!raw || Array.isArray(raw)) return [];
    return (raw as { alerts?: CvAlert[] }).alerts || [];
  };

  // Step 3 States
  const [matchCalculated, setMatchCalculated] = useState(
    initialJob?.ats_score !== undefined &&
      initialJob?.ats_score !== null &&
      initialJob?.ats_score > 0,
  );
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [matchScore, setMatchScore] = useState(initialJob?.ats_score || 0);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>(
    initialJob?.matched_keywords || [],
  );
  const [missingKeywords, setMissingKeywords] = useState<string[]>(
    initialJob?.missing_keywords || [],
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>(
    getInitialSuggestions(),
  );
  const [alerts, setAlerts] = useState<CvAlert[]>(getInitialAlerts());
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [activeCvTab, setActiveCvTab] = useState("personal");

  // CV editing shared form state
  const cvForm = useCvForm({
    initialName: "",
    initialIsBase: true,
  });

  const [baseCv, setBaseCv] = useState<CvData | null>(null);
  const [cvSaving, setCvSaving] = useState(false);

  // Run match analysis & load CV via AI
  const handleRunAnalysis = async () => {
    setLoadingMatch(true);
    const toastId = toast.loading(
      "Menghubungkan Base CV & menghitung kecocokan via AI...",
    );

    try {
      const res = await getBaseCV();
      if (res.success && res.data) {
        const cv = res.data;
        setBaseCv(cv);
        cvForm.setName(cv.name || "Base CV");
        cvForm.setIsBase(cv.is_base || false);

        const parsedData = parseCvStructuredJson(cv.structured_json);
        cvForm.setPersonal(parsedData.personal);
        cvForm.setExperiences(parsedData.experiences);
        cvForm.setEducations(parsedData.educations);
        cvForm.setSkillsAchievements(parsedData.skillsAchievements);

        // Panggil Server Action AI untuk membandingkan CV & Lowongan
        const matchRes = await analyzeCvMatch(
          initialJob?.company_name || "",
          initialJob?.position || "",
          initialJob?.description || "",
          initialJob?.requirements || [],
          parsedData,
        );

        toast.dismiss(toastId);

        if (matchRes.success && matchRes.data) {
          const score = matchRes.data.matchScore ?? 0;
          const matched = matchRes.data.matchedKeywords ?? [];
          const missing = matchRes.data.missingKeywords ?? [];
          const suggList = matchRes.data.suggestions ?? [];
          const alertList = matchRes.data.alerts ?? [];

          setMatchScore(score);
          setMatchedKeywords(matched);
          setMissingKeywords(missing);
          setSuggestions(suggList);
          setAlerts(alertList);
          setMatchCalculated(true);
          onAnalysisComplete?.();

          // Simpan hasil analisis AI ke database secara permanen
          if (initialJob?.id) {
            await updateJob(initialJob.id, {
              ats_score: score,
              matched_keywords: matched,
              missing_keywords: missing,
              ai_suggestions: {
                suggestions: suggList,
                alerts: alertList,
              },
            });
          }

          toast.success("Analisis kecocokan AI selesai dihitung!");
        } else {
          toast.error(
            matchRes.error || "Gagal melakukan analisis pencocokan AI.",
          );
        }
      } else {
        toast.dismiss(toastId);
        toast.error(
          "Gagal mengambil Base CV. Pastikan kamu sudah membuat Base CV di CV Editor.",
        );
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Gagal melakukan analisis pencocokan AI.");
    } finally {
      setLoadingMatch(false);
    }
  };

  // Save modified CV and recalculate
  const handleSaveCv = async () => {
    if (!baseCv) return;
    setCvSaving(true);
    const toastId = toast.loading("Sedang menyimpan perubahan CV...");

    try {
      const formattedExperience = cvForm.experiences.map((exp) => ({
        ...exp,
        bullets: exp.bullets.map((b) => b.trim()).filter((b) => b.length > 0),
      }));

      const formattedEducation = cvForm.educations.map((edu) => ({
        ...edu,
        bullets: edu.bullets.map((b) => b.trim()).filter((b) => b.length > 0),
      }));

      const finalCvData = {
        personal: cvForm.personal,
        experience: formattedExperience,
        education: formattedEducation,
        skills_and_achievements: cvForm.skillsAchievements.filter(
          (item) => item.category.trim() || item.description.trim(),
        ),
      };

      const res = await updateCV(
        baseCv.id,
        cvForm.name,
        finalCvData,
        cvForm.isBase,
      );
      toast.dismiss(toastId);

      if (res.success) {
        toast.success("CV berhasil diselaraskan dan disimpan ke database!");

        // Re-calculate matching with ParsedCvData layout using AI
        const matchingInput: ParsedCvData = {
          personal: cvForm.personal,
          experiences: formattedExperience,
          educations: formattedEducation,
          skillsAchievements: cvForm.skillsAchievements.filter(
            (item) => item.category.trim() || item.description.trim(),
          ),
        };

        const matchRes = await analyzeCvMatch(
          initialJob?.company_name || "",
          initialJob?.position || "",
          initialJob?.description || "",
          initialJob?.requirements || [],
          matchingInput,
        );
        if (matchRes.success && matchRes.data) {
          const score = matchRes.data.matchScore ?? 0;
          const matched = matchRes.data.matchedKeywords ?? [];
          const missing = matchRes.data.missingKeywords ?? [];
          const suggList = matchRes.data.suggestions ?? [];
          const alertList = matchRes.data.alerts ?? [];

          setMatchScore(score);
          setMatchedKeywords(matched);
          setMissingKeywords(missing);
          setSuggestions(suggList);
          setAlerts(alertList);

          // Update data analisis teranyar ke database
          if (initialJob?.id) {
            await updateJob(initialJob.id, {
              ats_score: score,
              matched_keywords: matched,
              missing_keywords: missing,
              ai_suggestions: {
                suggestions: suggList,
                alerts: alertList,
              },
            });
          }
        }
      } else {
        toast.error(res.error || "Gagal menyimpan CV.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Gagal menyelaraskan CV.");
    } finally {
      setCvSaving(false);
    }
  };

  return {
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
    cvName: cvForm.name,
    setCvName: cvForm.setName,
    cvIsBase: cvForm.isBase,
    setCvIsBase: cvForm.setIsBase,
    ...cvForm,
  };
}
