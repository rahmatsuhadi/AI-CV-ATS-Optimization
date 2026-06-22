import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CvFormContextType } from "@/hooks/useCvForm";
import { useCvFormContext } from "@/hooks/useCvForm";
import { cn } from "@/lib/utils";

interface ExtendedCvFormContext {
  activeHighlight?: string | null;
}

export function EducationForm() {
  const {
    educations,
    addEducation,
    updateEducation,
    removeEducation,
    addEducationBullet,
    updateEducationBullet,
    removeEducationBullet,
    activeHighlight,
  } = useCvFormContext() as CvFormContextType & ExtendedCvFormContext;

  return (
    <div id="education" className="mt-6 flex flex-col gap-6">
      {educations.map((edu, index) => (
        <div
          key={edu.id}
          className={cn(
            "flex flex-col gap-4 rounded-xl border bg-card p-6 relative transition-all",
            activeHighlight === "education" &&
              "ring-2 ring-primary ring-offset-2 border-primary",
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 hover:bg-danger/10 hover:text-danger text-muted-foreground"
            onClick={() => removeEducation(index)}
          >
            <Trash2Icon className="size-4" />
          </Button>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Institusi / Universitas</Label>
              <Input
                value={edu.institution}
                placeholder="e.g. Universitas AMIKOM Yogyakarta"
                onChange={(e) =>
                  updateEducation(index, { institution: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Gelar / Jurusan</Label>
              <Input
                value={edu.degree}
                placeholder="e.g. D3 Teknik Informatika"
                onChange={(e) =>
                  updateEducation(index, { degree: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Durasi</Label>
              <Input
                value={edu.duration}
                placeholder="e.g. Sep 2023 - Feb 2026"
                onChange={(e) =>
                  updateEducation(index, { duration: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-semibold text-primary">
              Detail Akademik / Sub-poin
            </Label>
            <div className="flex flex-col gap-2">
              {edu.bullets.map((bullet, bulletIdx) => (
                <div
                  key={`${edu.id}-bullet-${bulletIdx}`}
                  className="flex gap-2 items-center"
                >
                  <span className="text-primary font-bold text-sm select-none">
                    •
                  </span>
                  <Textarea
                    rows={2}
                    value={bullet}
                    placeholder="e.g. Completed a final project involving the development of a web-based information system."
                    onChange={(e) =>
                      updateEducationBullet(index, bulletIdx, e.target.value)
                    }
                    className="flex-1 min-h-[60px]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEducationBullet(index, bulletIdx)}
                    className="hover:bg-danger/10 hover:text-danger text-muted-foreground size-8 animate-in fade-in"
                    disabled={edu.bullets.length <= 1}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addEducationBullet(index)}
              className="mt-1.5 self-start"
            >
              <PlusIcon className="mr-1.5 size-3.5" />
              Tambah Poin
            </Button>
          </div>
        </div>
      ))}
      {educations.length === 0 && (
        <span className="text-sm text-muted-foreground text-center mb-4">
          Belum ada data pendidikan.
        </span>
      )}
      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={addEducation}
      >
        <PlusIcon className="mr-2 size-4" />
        Tambah Pendidikan
      </Button>
    </div>
  );
}
