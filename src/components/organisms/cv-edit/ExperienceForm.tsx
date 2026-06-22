import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Experience } from "@/types/cv";

interface ExperienceFormProps {
  experiences: Experience[];
  addExperience: () => void;
  updateExperience: (index: number, fields: Partial<Experience>) => void;
  removeExperience: (index: number) => void;
  addExperienceBullet: (expIndex: number) => void;
  updateExperienceBullet: (
    expIndex: number,
    bulletIndex: number,
    value: string,
  ) => void;
  removeExperienceBullet: (expIndex: number, bulletIndex: number) => void;
}

export function ExperienceForm({
  experiences,
  addExperience,
  updateExperience,
  removeExperience,
  addExperienceBullet,
  updateExperienceBullet,
  removeExperienceBullet,
}: ExperienceFormProps) {
  return (
    <div className="mt-6 flex flex-col gap-6">
      {experiences.map((exp, index) => (
        <div
          key={exp.id}
          className="flex flex-col gap-4 rounded-xl border bg-card p-6 relative"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 hover:bg-danger/10 hover:text-danger text-muted-foreground"
            onClick={() => removeExperience(index)}
          >
            <Trash2Icon className="size-4" />
          </Button>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <Label>Perusahaan</Label>
              <Input
                value={exp.company}
                onChange={(e) =>
                  updateExperience(index, { company: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Lokasi</Label>
              <Input
                value={exp.location}
                placeholder="e.g. Subang, Jawa Barat"
                onChange={(e) =>
                  updateExperience(index, { location: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Posisi / Jabatan</Label>
              <Input
                value={exp.position}
                onChange={(e) =>
                  updateExperience(index, { position: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Durasi</Label>
              <Input
                value={exp.duration}
                placeholder="e.g. Jan 2019 - Apr 2019"
                onChange={(e) =>
                  updateExperience(index, { duration: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-semibold text-primary">
              Tanggung Jawab & Pencapaian (Poin-poin)
            </Label>
            <div className="flex flex-col gap-2">
              {exp.bullets.map((bullet, bulletIdx) => (
                <div
                  key={`${exp.id}-bullet-${bulletIdx}`}
                  className="flex gap-2 items-center"
                >
                  <span className="text-primary font-bold text-sm select-none">
                    •
                  </span>
                  <Textarea
                    rows={2}
                    value={bullet}
                    placeholder="e.g. Developed high-performance RESTful APIs..."
                    onChange={(e) =>
                      updateExperienceBullet(index, bulletIdx, e.target.value)
                    }
                    className="flex-1 min-h-[60px]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperienceBullet(index, bulletIdx)}
                    className="hover:bg-danger/10 hover:text-danger text-muted-foreground size-8 animate-in fade-in"
                    disabled={exp.bullets.length <= 1}
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
              onClick={() => addExperienceBullet(index)}
              className="mt-1.5 self-start"
            >
              <PlusIcon className="mr-1.5 size-3.5" />
              Tambah Poin
            </Button>
          </div>
        </div>
      ))}
      {experiences.length === 0 && (
        <span className="text-sm text-muted-foreground text-center mb-4">
          Belum ada data pengalaman.
        </span>
      )}
      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={addExperience}
      >
        <PlusIcon className="mr-2 size-4" />
        Tambah Pengalaman
      </Button>
    </div>
  );
}
