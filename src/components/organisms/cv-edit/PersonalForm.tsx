import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Personal } from "@/types/cv";

interface PersonalFormProps {
  personal: Personal;
  setPersonal: React.Dispatch<React.SetStateAction<Personal>>;
  name: string;
  setName: (name: string) => void;
  isBase: boolean;
  setIsBase: (isBase: boolean) => void;
}

export function PersonalForm({
  personal,
  setPersonal,
  name,
  setName,
  isBase,
  setIsBase,
}: PersonalFormProps) {
  const handleChange = (field: keyof Personal, value: string) => {
    setPersonal((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
      {/* Document Properties */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-b border-border/60 pb-4 mb-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cvName" className="font-semibold text-primary">
            CV Document Name
          </Label>
          <Input
            id="cvName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Software Engineer (General)"
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            id="isBase"
            checked={isBase}
            onChange={(e) => setIsBase(e.target.checked)}
            className="rounded border-border size-4 accent-primary cursor-pointer"
          />
          <Label htmlFor="isBase" className="cursor-pointer font-medium">
            Set as Base CV (untuk tracking utama)
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full Name</Label>
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
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={personal.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g. Bantul, Yogyakarta"
            value={personal.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            placeholder="e.g. linkedin.com/in/rahmat-suhadi"
            value={personal.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="website">Website / Portfolio URL</Label>
        <Input
          id="website"
          placeholder="e.g. https://mattz.my.id"
          value={personal.website}
          onChange={(e) => handleChange("website", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          rows={4}
          value={personal.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
        />
      </div>
    </div>
  );
}
