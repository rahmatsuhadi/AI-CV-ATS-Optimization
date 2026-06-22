import type {
  CvStructuredJson,
  Education,
  Experience,
  ParsedCvData,
  Personal,
  SkillAchievementItem,
} from "@/types/cv";

/**
 * Parses cv.structured_json into a clean, predictable shape for the form editor.
 * Handles backward compatibility and default values.
 */
export function parseCvStructuredJson(
  parsed: CvStructuredJson | null | undefined,
): ParsedCvData {
  // 1. Parse Personal Info
  const personal: Personal = {
    name: parsed?.personal?.name || "",
    email: parsed?.personal?.email || "",
    phone: parsed?.personal?.phone || "",
    summary: parsed?.personal?.summary || "",
    location: parsed?.personal?.location || "",
    linkedin: parsed?.personal?.linkedin || "",
    website: parsed?.personal?.website || "",
  };

  // 2. Parse Experience
  let experiences: Experience[] = [];
  if (parsed && Array.isArray(parsed.experience)) {
    experiences = parsed.experience.map((e, i) => {
      let bulletsArr: string[] = [];
      if (Array.isArray(e.bullets)) {
        bulletsArr = e.bullets;
      } else if (typeof e.bullets === "string") {
        bulletsArr = (e.bullets as string)
          .split("\n")
          .map((b) => b.trim().replace(/^[•\-*\s]+/, ""))
          .filter(Boolean);
      }
      if (bulletsArr.length === 0) bulletsArr = [""];

      return {
        id: e.id || `${Date.now()}-exp-${i}`,
        company: e.company || "",
        location: e.location || "",
        position: e.position || "",
        duration: e.duration || "",
        bullets: bulletsArr,
      };
    });
  }

  // 3. Parse Education
  let educations: Education[] = [];
  if (parsed && Array.isArray(parsed.education)) {
    educations = parsed.education.map((e, i) => {
      let bulletsArr: string[] = [];
      if (Array.isArray(e.bullets)) {
        bulletsArr = e.bullets;
      } else if (typeof e.bullets === "string") {
        bulletsArr = (e.bullets as string)
          .split("\n")
          .map((b) => b.trim().replace(/^[•\-*\s]+/, ""))
          .filter(Boolean);
      } else {
        const legacyEdu = e as Record<string, unknown>;
        if (legacyEdu.details && typeof legacyEdu.details === "string") {
          bulletsArr = (legacyEdu.details as string)
            .split("\n")
            .map((b) => b.trim().replace(/^[•\-*\s]+/, ""))
            .filter(Boolean);
        } else if (legacyEdu.details && Array.isArray(legacyEdu.details)) {
          bulletsArr = legacyEdu.details as string[];
        }
      }
      if (bulletsArr.length === 0) bulletsArr = [""];

      return {
        id: e.id || `${Date.now()}-edu-${i}`,
        institution: e.institution || "",
        degree: e.degree || "",
        duration: e.duration || "",
        bullets: bulletsArr,
      };
    });
  }

  // 4. Parse Skills and Achievements
  let skillsAchievements: SkillAchievementItem[] = [];
  if (parsed) {
    if (Array.isArray(parsed.skills_and_achievements)) {
      skillsAchievements = parsed.skills_and_achievements.map((item, idx) => ({
        id: item.id || `${Date.now()}-sa-${idx}`,
        category: item.category || "Hard Skills",
        year: item.year || "",
        description: item.description || "",
      }));
    } else {
      // Convert from old schema
      if (Array.isArray(parsed.skills) && parsed.skills.length > 0) {
        skillsAchievements.push({
          id: `old-skills-${Date.now()}`,
          category: "Hard Skills",
          year: "",
          description: parsed.skills.join(", "),
        });
      }
      if (
        Array.isArray(parsed.achievements) &&
        parsed.achievements.length > 0
      ) {
        skillsAchievements.push({
          id: `old-achievements-${Date.now()}`,
          category: "Achievements",
          year: "",
          description: parsed.achievements.join("\n"),
        });
      }
    }
  }

  // Set defaults if empty
  if (skillsAchievements.length === 0) {
    skillsAchievements = [
      {
        id: `default-hard-${Date.now()}`,
        category: "Hard Skills",
        year: "",
        description: "",
      },
      {
        id: `default-soft-${Date.now()}`,
        category: "Soft Skills",
        year: "",
        description: "",
      },
    ];
  }

  return {
    personal,
    experiences,
    educations,
    skillsAchievements,
  };
}
