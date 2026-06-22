import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CvFormContextType } from "@/hooks/useCvForm";
import { useCvFormContext } from "@/hooks/useCvForm";
import { cn } from "@/lib/utils";
import type { Personal } from "@/types/cv";

interface ExtendedCvFormContext {
  activeHighlight?: string | null;
}

export function PersonalForm({ hideIsBase = false }: { hideIsBase?: boolean }) {
  const { personal, setPersonal, name, setName, isBase, setIsBase, activeHighlight } =
    useCvFormContext() as CvFormContextType & ExtendedCvFormContext;

  const handleChange = (field: keyof Personal, value: string) => {
    setPersonal((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
      {/* Document Properties */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-b border-border/60 pb-4 mb-2">
        <div
          className={cn(
            "flex flex-col gap-1.5",
            hideIsBase ? "col-span-2" : "col-span-2 sm:col-span-1",
          )}
        >
          <Label htmlFor="cvName" className="font-semibold text-primary">
            Nama Dokumen CV
          </Label>
          <Input
            id="cvName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Software Engineer (General)"
          />
        </div>
        {!hideIsBase && (
          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              id="isBase"
              checked={isBase}
              onCheckedChange={(checked) => setIsBase(checked === true)}
            />
            <Label htmlFor="isBase" className="cursor-pointer font-medium">
              Jadikan sebagai CV Utama (untuk tracking)
            </Label>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            value={personal.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={personal.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Nomor Telepon</Label>
          <Input
            id="phone"
            value={personal.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Lokasi</Label>
          <Input
            id="location"
            placeholder="e.g. Bantul, Yogyakarta"
            value={personal.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="linkedin">URL LinkedIn</Label>
          <Input
            id="linkedin"
            placeholder="e.g. linkedin.com/in/rahmat-suhadi"
            value={personal.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="website">Website / URL Portofolio</Label>
        <Input
          id="website"
          placeholder="e.g. https://mattz.my.id"
          value={personal.website}
          onChange={(e) => handleChange("website", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="personal-summary">Ringkasan Profesional</Label>
        <Textarea
          id="personal-summary"
          rows={4}
          value={personal.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          className={cn(
            activeHighlight === "personal-summary" &&
              "ring-2 ring-primary ring-offset-2 border-primary",
          )}
        />
      </div>
    </div>
  );
}
