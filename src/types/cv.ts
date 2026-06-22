export interface Personal {
  name: string;
  email: string;
  phone: string;
  summary: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface Experience {
  id: string;
  company: string;
  location: string;
  position: string;
  duration: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  bullets: string[];
}

export interface SkillAchievementItem {
  id: string;
  category: string;
  year: string;
  description: string;
}

export interface CvStructuredJson {
  personal?: Partial<Personal>;
  experience?: Partial<Experience>[];
  education?: Partial<Education>[];
  skills_and_achievements?: SkillAchievementItem[];
  skills?: string[];
  achievements?: string[];
}

export interface CvData {
  id: string;
  user_id: string;
  name: string;
  is_base: boolean;
  structured_json: CvStructuredJson | null;
  created_at?: string;
  updated_at?: string;
}

export interface ParsedCvData {
  personal: Personal;
  experiences: Experience[];
  educations: Education[];
  skillsAchievements: SkillAchievementItem[];
}
