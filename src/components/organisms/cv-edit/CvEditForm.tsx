"use client";

import { ArrowLeftIcon, Loader2Icon, SaveIcon } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCvEditForm } from "@/hooks/useCvEditForm";
import type { ParsedCvData } from "@/types/cv";
import { EducationForm } from "./EducationForm";
import { ExperienceForm } from "./ExperienceForm";
import { PersonalForm } from "./PersonalForm";
import { SkillsOthersForm } from "./SkillsOthersForm";

interface CvEditFormProps {
  id: string;
  initialName: string;
  initialIsBase: boolean;
  initialData: ParsedCvData;
}

export function CvEditForm({
  id,
  initialName,
  initialIsBase,
  initialData,
}: CvEditFormProps) {
  const {
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
  } = useCvEditForm({
    id,
    initialName,
    initialIsBase,
    initialData,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cv">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <SectionHeader
          title={`Edit CV: ${name}`}
          subtitle="Editor CV berbasis form. Tinjau hasil ekstraksi di bawah."
          action={
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : (
                <SaveIcon className="mr-2 size-4" />
              )}
              Simpan Perubahan
            </Button>
          }
        />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-1">
          <TabsTrigger value="personal" className="py-2.5">
            Info Pribadi
          </TabsTrigger>
          <TabsTrigger value="experience" className="py-2.5">
            Pengalaman
          </TabsTrigger>
          <TabsTrigger value="education" className="py-2.5">
            Pendidikan
          </TabsTrigger>
          <TabsTrigger value="skills-others" className="py-2.5">
            Keahlian & Lainnya
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PersonalForm
            personal={personal}
            setPersonal={setPersonal}
            name={name}
            setName={setName}
            isBase={isBase}
            setIsBase={setIsBase}
          />
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
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

        <TabsContent value="education" className="mt-6">
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

        <TabsContent value="skills-others" className="mt-6">
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
  );
}
