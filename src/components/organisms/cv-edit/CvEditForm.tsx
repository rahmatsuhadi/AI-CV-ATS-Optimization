"use client";

import { ArrowLeftIcon, Loader2Icon, SaveIcon } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCvEditForm } from "@/hooks/useCvEditForm";
import { CvFormProvider } from "@/hooks/useCvForm";
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
  const cvFormState = useCvEditForm({
    id,
    initialName,
    initialIsBase,
    initialData,
  });

  const { tab, setTab, saving, handleSave, name } = cvFormState;

  return (
    <CvFormProvider value={cvFormState}>
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 h-12">
            <TabsTrigger value="personal">Info Pribadi</TabsTrigger>
            <TabsTrigger value="experience">Pengalaman</TabsTrigger>
            <TabsTrigger value="education">Pendidikan</TabsTrigger>
            <TabsTrigger value="skills-others">Keahlian & Lainnya</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <PersonalForm />
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <ExperienceForm />
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <EducationForm />
          </TabsContent>

          <TabsContent value="skills-others" className="mt-6">
            <SkillsOthersForm />
          </TabsContent>
        </Tabs>
      </div>
    </CvFormProvider>
  );
}
