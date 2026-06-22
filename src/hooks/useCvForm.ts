import { createContext, useContext, useState } from "react";
import type {
  Education,
  Experience,
  Personal,
  SkillAchievementItem,
} from "@/types/cv";

interface UseCvFormProps {
  initialName?: string;
  initialIsBase?: boolean;
  initialPersonal?: Personal;
  initialExperiences?: Experience[];
  initialEducations?: Education[];
  initialSkillsAchievements?: SkillAchievementItem[];
}

export function useCvForm(props: UseCvFormProps = {}) {
  // Document metadata state
  const [name, setName] = useState(props.initialName || "Untitled CV");
  const [isBase, setIsBase] = useState(props.initialIsBase || false);

  // Form State
  const [personal, setPersonal] = useState<Personal>(
    props.initialPersonal || {
      name: "",
      email: "",
      phone: "",
      summary: "",
      location: "",
      linkedin: "",
      website: "",
    },
  );
  const [experiences, setExperiences] = useState<Experience[]>(
    props.initialExperiences || [],
  );
  const [educations, setEducations] = useState<Education[]>(
    props.initialEducations || [],
  );
  const [skillsAchievements, setSkillsAchievements] = useState<
    SkillAchievementItem[]
  >(props.initialSkillsAchievements || []);

  // Accordion/Expand item state (for skills achievements tab)
  const [expandedItems, setExpandedItems] = useState<string[]>(
    props.initialSkillsAchievements
      ? props.initialSkillsAchievements.map((item) => item.id)
      : [],
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

  return {
    name,
    setName,
    isBase,
    setIsBase,
    personal,
    setPersonal,
    experiences,
    setExperiences,
    addExperience,
    updateExperience,
    removeExperience,
    addExperienceBullet,
    updateExperienceBullet,
    removeExperienceBullet,
    educations,
    setEducations,
    addEducation,
    updateEducation,
    removeEducation,
    addEducationBullet,
    updateEducationBullet,
    removeEducationBullet,
    skillsAchievements,
    setSkillsAchievements,
    addSkillAchievement,
    updateSkillAchievement,
    removeSkillAchievement,
    expandedItems,
    setExpandedItems,
    toggleExpandItem,
  };
}

export type CvFormContextType = ReturnType<typeof useCvForm>;

const CvFormContext = createContext<CvFormContextType | null>(null);

export function useCvFormContext() {
  const context = useContext(CvFormContext);
  if (!context) {
    throw new Error("useCvFormContext must be used within a CvFormProvider");
  }
  return context;
}

export const CvFormProvider = CvFormContext.Provider;
