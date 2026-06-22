import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateCV } from "@/actions/cv";
import type { ParsedCvData } from "@/types/cv";
import { useCvForm } from "./useCvForm";

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
  const [saving, setSaving] = useState(false);

  // Initialize the shared CV form state hook
  const cvForm = useCvForm({
    initialName,
    initialIsBase,
    initialPersonal: initialData.personal,
    initialExperiences: initialData.experiences,
    initialEducations: initialData.educations,
    initialSkillsAchievements: initialData.skillsAchievements,
  });

  // SAVE HANDLER
  const handleSave = async () => {
    setSaving(true);
    toast.info("Sedang menyimpan CV...");
    try {
      // Bersihkan list bullets kosong sebelum disimpan
      const formattedExperience = cvForm.experiences.map((exp) => ({
        ...exp,
        bullets: exp.bullets.map((b) => b.trim()).filter((b) => b.length > 0),
      }));

      const formattedEducation = cvForm.educations.map((edu) => ({
        ...edu,
        bullets: edu.bullets.map((b) => b.trim()).filter((b) => b.length > 0),
      }));

      // Build the final JSON
      const finalCvData = {
        personal: cvForm.personal,
        experience: formattedExperience,
        education: formattedEducation,
        skills_and_achievements: cvForm.skillsAchievements.filter(
          (item) => item.category.trim() || item.description.trim(),
        ),
      };

      const res = await updateCV(id, cvForm.name, finalCvData, cvForm.isBase);
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
    saving,
    handleSave,
    ...cvForm,
  };
}
