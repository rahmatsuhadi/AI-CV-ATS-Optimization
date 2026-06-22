import { useState } from "react";
import { toast } from "sonner";
import { getBaseCV, updateCV } from "@/actions/cv";
import { analyzeCvMatch, updateJob } from "@/actions/job";
import { parseCvStructuredJson } from "@/services/cv-parser";
import type { JobData } from "@/actions/job";
import type { CvAlert } from "@/hooks/useJobWorkspace";
import type {
  CvData,
  Education,
  Experience,
  Personal,
  SkillAchievementItem,
  ParsedCvData,
} from "@/types/cv";

export interface Suggestion {
  field: string;
  tab: string;
  issue: string;
  fix: string;
}

export function useStep3CvTailor(
  initialJob: JobData,
  onAnalysisComplete?: () => void,
) {
  // Backward compatibility helper for suggestions and alerts stored in JSONB
  const getInitialSuggestions = (): Suggestion[] => {
    const raw = initialJob.ai_suggestions;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw as Suggestion[];
    return (raw as any).suggestions || [];
  };

  const getInitialAlerts = (): CvAlert[] => {
    const raw = initialJob.ai_suggestions;
    if (!raw || Array.isArray(raw)) return [];
    return (raw as any).alerts || [];
  };

  // Step 3 States
  const [matchCalculated, setMatchCalculated] = useState(
    initialJob.ats_score !== undefined &&
      initialJob.ats_score !== null &&
      initialJob.ats_score > 0,
  );
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [matchScore, setMatchScore] = useState(initialJob.ats_score || 0);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>(
    initialJob.matched_keywords || [],
  );
  const [missingKeywords, setMissingKeywords] = useState<string[]>(
    initialJob.missing_keywords || [],
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>(
    getInitialSuggestions(),
  );
  const [alerts, setAlerts] = useState<CvAlert[]>(getInitialAlerts());
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [activeCvTab, setActiveCvTab] = useState("personal");

  // CV editing states
  const [baseCv, setBaseCv] = useState<CvData | null>(null);
  const [cvName, setCvName] = useState("");
  const [cvIsBase, setCvIsBase] = useState(true);
  const [personal, setPersonal] = useState<Personal>({
    name: "",
    email: "",
    phone: "",
    summary: "",
    location: "",
    linkedin: "",
    website: "",
  });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skillsAchievements, setSkillsAchievements] = useState<
    SkillAchievementItem[]
  >([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
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
        setCvName(cv.name || "Base CV");
        setCvIsBase(cv.is_base || false);

        const parsedData = parseCvStructuredJson(cv.structured_json);
        setPersonal(parsedData.personal);
        setExperiences(parsedData.experiences);
        setEducations(parsedData.educations);
        setSkillsAchievements(parsedData.skillsAchievements);

        // Panggil Server Action AI untuk membandingkan CV & Lowongan
        const matchRes = await analyzeCvMatch(
          initialJob.company_name || "",
          initialJob.position || "",
          initialJob.description || "",
          initialJob.requirements || [],
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
          await updateJob(initialJob.id, {
            ats_score: score,
            matched_keywords: matched,
            missing_keywords: missing,
            ai_suggestions: {
              suggestions: suggList,
              alerts: alertList,
            },
          });

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

  // CV Actions
  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        company: "",
        location: "",
        position: "",
        duration: "",
        bullets: [""],
      },
    ]);
  };

  const updateExperience = (index: number, fields: Partial<Experience>) => {
    setExperiences((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...fields };
      return updated;
    });
  };

  const removeExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const addExperienceBullet = (expIndex: number) => {
    setExperiences((prev) => {
      const updated = [...prev];
      updated[expIndex] = {
        ...updated[expIndex],
        bullets: [...updated[expIndex].bullets, ""],
      };
      return updated;
    });
  };

  const updateExperienceBullet = (
    expIndex: number,
    bulletIndex: number,
    value: string,
  ) => {
    setExperiences((prev) => {
      const updated = [...prev];
      const newBullets = [...updated[expIndex].bullets];
      newBullets[bulletIndex] = value;
      updated[expIndex] = {
        ...updated[expIndex],
        bullets: newBullets,
      };
      return updated;
    });
  };

  const removeExperienceBullet = (expIndex: number, bulletIndex: number) => {
    setExperiences((prev) => {
      const updated = [...prev];
      updated[expIndex] = {
        ...updated[expIndex],
        bullets: updated[expIndex].bullets.filter((_, i) => i !== bulletIndex),
      };
      return updated;
    });
  };

  const addEducation = () => {
    setEducations((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        institution: "",
        degree: "",
        duration: "",
        bullets: [""],
      },
    ]);
  };

  const updateEducation = (index: number, fields: Partial<Education>) => {
    setEducations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...fields };
      return updated;
    });
  };

  const removeEducation = (index: number) => {
    setEducations((prev) => prev.filter((_, i) => i !== index));
  };

  const addEducationBullet = (eduIndex: number) => {
    setEducations((prev) => {
      const updated = [...prev];
      updated[eduIndex] = {
        ...updated[eduIndex],
        bullets: [...updated[eduIndex].bullets, ""],
      };
      return updated;
    });
  };

  const updateEducationBullet = (
    eduIndex: number,
    bulletIndex: number,
    value: string,
  ) => {
    setEducations((prev) => {
      const updated = [...prev];
      const newBullets = [...updated[eduIndex].bullets];
      newBullets[bulletIndex] = value;
      updated[eduIndex] = {
        ...updated[eduIndex],
        bullets: newBullets,
      };
      return updated;
    });
  };

  const removeEducationBullet = (eduIndex: number, bulletIndex: number) => {
    setEducations((prev) => {
      const updated = [...prev];
      updated[eduIndex] = {
        ...updated[eduIndex],
        bullets: updated[eduIndex].bullets.filter((_, i) => i !== bulletIndex),
      };
      return updated;
    });
  };

  const addSkillAchievement = () => {
    const newId = Date.now().toString();
    setSkillsAchievements((prev) => [
      ...prev,
      {
        id: newId,
        category: "Hard Skills",
        year: "",
        description: "",
      },
    ]);
    setExpandedItems((prev) => [...prev, newId]);
  };

  const updateSkillAchievement = (
    index: number,
    fields: Partial<SkillAchievementItem>,
  ) => {
    setSkillsAchievements((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...fields };
      return updated;
    });
  };

  const removeSkillAchievement = (index: number) => {
    setSkillsAchievements((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleExpandItem = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((item) => item !== itemId)
        : [...prev, itemId],
    );
  };

  // Save modified CV and recalculate
  const handleSaveCv = async () => {
    if (!baseCv) return;
    setCvSaving(true);
    const toastId = toast.loading("Sedang menyimpan perubahan CV...");

    try {
      const formattedExperience = experiences.map((exp) => ({
        ...exp,
        bullets: exp.bullets.map((b) => b.trim()).filter((b) => b.length > 0),
      }));

      const formattedEducation = educations.map((edu) => ({
        ...edu,
        bullets: edu.bullets.map((b) => b.trim()).filter((b) => b.length > 0),
      }));

      const finalCvData = {
        personal,
        experience: formattedExperience,
        education: formattedEducation,
        skills_and_achievements: skillsAchievements.filter(
          (item) => item.category.trim() || item.description.trim(),
        ),
      };

      const res = await updateCV(baseCv.id, cvName, finalCvData, cvIsBase);
      toast.dismiss(toastId);

      if (res.success) {
        toast.success("CV berhasil diselaraskan dan disimpan ke database!");

        // Re-calculate matching with ParsedCvData layout using AI
        const matchingInput: ParsedCvData = {
          personal,
          experiences: formattedExperience,
          educations: formattedEducation,
          skillsAchievements: skillsAchievements.filter(
            (item) => item.category.trim() || item.description.trim(),
          ),
        };

        const matchRes = await analyzeCvMatch(
          initialJob.company_name || "",
          initialJob.position || "",
          initialJob.description || "",
          initialJob.requirements || [],
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
  };
}
