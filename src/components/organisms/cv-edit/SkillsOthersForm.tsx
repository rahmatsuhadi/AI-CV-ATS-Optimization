import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SkillAchievementItem } from "@/types/cv";

interface SkillsOthersFormProps {
  skillsAchievements: SkillAchievementItem[];
  addSkillAchievement: () => void;
  updateSkillAchievement: (
    index: number,
    fields: Partial<SkillAchievementItem>,
  ) => void;
  removeSkillAchievement: (index: number) => void;
  expandedItems: string[];
  toggleExpandItem: (id: string) => void;
}

export function SkillsOthersForm({
  skillsAchievements,
  addSkillAchievement,
  updateSkillAchievement,
  removeSkillAchievement,
}: SkillsOthersFormProps) {
  // Standard categories list
  const categories = [
    "Hard Skills",
    "Soft Skills",
    "Achievements",
    "Projects",
    "Modules Taken",
    "Webinars Attended",
    "Interest",
  ];

  return (
    <div className="mt-6 flex flex-col gap-6">
      {skillsAchievements.map((item, index) => {
        // Check if current category is custom
        const isCustomCategory =
          item.category && !categories.includes(item.category);

        return (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-xl border bg-card p-6 relative animate-in fade-in duration-200"
          >
            {/* Delete Button top right */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 hover:bg-danger/10 hover:text-danger text-muted-foreground"
              onClick={() => removeSkillAchievement(index)}
              disabled={skillsAchievements.length <= 1}
            >
              <Trash2Icon className="size-4" />
            </Button>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
              {/* Kategori Select */}
              <div className="flex flex-col gap-1.5">
                <Label className="font-semibold text-sm">
                  Kategori / Proyek / Aktivitas
                </Label>
                <select
                  value={
                    isCustomCategory || item.category === ""
                      ? "Custom"
                      : item.category
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "Custom") {
                      updateSkillAchievement(index, {
                        category: "",
                      });
                    } else {
                      updateSkillAchievement(index, {
                        category: val,
                      });
                    }
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-foreground bg-background"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Custom">+ Tulis Kategori Kustom</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Tuliskan nama/judul jika mengindikasikan proyek/kegiatan.
                </p>
              </div>

              {/* Tahun Select */}
              <div className="flex flex-col gap-1.5">
                <Label className="font-semibold text-sm">Tahun</Label>
                <select
                  value={item.year}
                  onChange={(e) =>
                    updateSkillAchievement(index, {
                      year: e.target.value,
                    })
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-foreground bg-background"
                >
                  <option value="">Select year (optional)</option>
                  {Array.from({ length: 15 }, (_, i) => {
                    const yearVal = String(new Date().getFullYear() + 4 - i);
                    return (
                      <option key={yearVal} value={yearVal}>
                        {yearVal}
                      </option>
                    );
                  })}
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Hanya dibutuhkan apabila memilih Proyek / Pencapaian.
                </p>
              </div>
            </div>

            {/* Input custom category if selected Custom */}
            {(isCustomCategory || item.category === "") && (
              <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                <Label className="font-semibold text-sm">
                  Nama Kategori Kustom
                </Label>
                <Input
                  value={item.category}
                  placeholder="Ketik kategori kustom disini... (e.g. Sertifikasi Internasional)"
                  onChange={(e) =>
                    updateSkillAchievement(index, {
                      category: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* Penjelasan Textarea */}
            <div className="flex flex-col gap-1.5">
              <Label className="font-semibold text-sm font-medium">
                Penjelasan / Isi
              </Label>
              <Textarea
                rows={3}
                value={item.description}
                placeholder="Tuliskan keahlian, detail proyek, atau prestasi..."
                onChange={(e) =>
                  updateSkillAchievement(index, {
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
        );
      })}

      {skillsAchievements.length === 0 && (
        <span className="text-sm text-muted-foreground text-center my-4">
          Belum ada data keterampilan atau prestasi.
        </span>
      )}

      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={addSkillAchievement}
      >
        <PlusIcon className="mr-2 size-4" />
        Add Entry (Keterampilan / Prestasi)
      </Button>
    </div>
  );
}
