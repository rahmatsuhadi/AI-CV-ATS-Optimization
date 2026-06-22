import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateCV } from "@/actions/cv";
import type {
  Education,
  Experience,
  ParsedCvData,
  Personal,
  SkillAchievementItem,
} from "@/types/cv";

interface UseCvEditFormProps {
  id: string;
  initialName: string;
  initialIsBase: boolean;
  initialData: ParsedCvData;
}

export function useCvEditForm({
  id,
  initialName,
  initialIsBase,
  initialData,
}: UseCvEditFormProps) {
  const router = useRouter();

  // Tab State
  const [tab, setTab] = useState("personal");

  // Document metadata state
  const [name, setName] = useState(initialName || "Untitled CV");
  const [isBase, setIsBase] = useState(initialIsBase || false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [personal, setPersonal] = useState<Personal>(initialData.personal);
  const [experiences, setExperiences] = useState<Experience[]>(
    initialData.experiences,
  );
  const [educations, setEducations] = useState<Education[]>(
    initialData.educations,
  );
  const [skillsAchievements, setSkillsAchievements] = useState<
    SkillAchievementItem[]
  >(initialData.skillsAchievements);

  // Accordion/Expand item state (for skills achievements tab)
  const [expandedItems, setExpandedItems] = useState<string[]>(
    initialData.skillsAchievements.map((item) => item.id),
  );

  // EXPERIENCE ACTIONS
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

  // EDUCATION ACTIONS
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

  // SKILLS & ACHIEVEMENTS ACTIONS
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

  // SAVE HANDLER
  const handleSave = async () => {
    setSaving(true);
    toast.info("Sedang menyimpan CV...");
    try {
      // Bersihkan list bullets kosong sebelum disimpan
      const formattedExperience = experiences.map((exp) => ({
        ...exp,
        bullets: exp.bullets.map((b) => b.trim()).filter((b) => b.length > 0),
      }));

      const formattedEducation = educations.map((edu) => ({
        ...edu,
        bullets: edu.bullets.map((b) => b.trim()).filter((b) => b.length > 0),
      }));

      // Build the final JSON
      const finalCvData = {
        personal,
        experience: formattedExperience,
        education: formattedEducation,
        skills_and_achievements: skillsAchievements.filter(
          (item) => item.category.trim() || item.description.trim(),
        ),
      };

      const res = await updateCV(id, name, finalCvData, isBase);
      if (res.success) {
        toast.success("CV berhasil disimpan ke database!");
        router.push("/cv");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menyimpan CV.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menyimpan CV.");
    } finally {
      setSaving(false);
    }
  };

  return {
    tab,
    setTab,
    name,
    setName,
    isBase,
    setIsBase,
    saving,
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
    handleSave,
  };
}
