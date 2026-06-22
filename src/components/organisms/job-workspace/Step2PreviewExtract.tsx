import {
  AtSignIcon,
  BriefcaseIcon,
  BuildingIcon,
  CoinsIcon,
  Loader2Icon,
  MapPinIcon,
  SaveIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Step2PreviewExtractProps {
  companyName: string;
  setCompanyName?: (val: string) => void;
  location: string;
  setLocation?: (val: string) => void;
  position: string;
  setPosition?: (val: string) => void;
  emailTo: string;
  setEmailTo?: (val: string) => void;
  requirements: string[];
  setRequirements?: (val: string[]) => void;
  salaryRange?: string;
  setSalaryRange?: (val: string) => void;
  saving?: boolean;
  handleBack?: () => void;
  handleSave?: () => void;
  readOnly?: boolean;
}

export function Step2PreviewExtract({
  companyName,
  setCompanyName,
  location,
  setLocation,
  position,
  setPosition,
  emailTo,
  setEmailTo,
  requirements,
  setRequirements,
  salaryRange = "Tidak disebutkan",
  setSalaryRange,
  saving = false,
  handleBack,
  handleSave,
  readOnly = false,
}: Step2PreviewExtractProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-lg font-bold">
            Rincian Informasi Lowongan {readOnly && "(Read-Only)"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {readOnly
              ? "Informasi pekerjaan yang telah terekstrak di database."
              : "Informasi di bawah ini telah diekstrak secara otomatis oleh AI. Silakan sunting jika ada kekeliruan, lalu simpan ke Supabase."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="companyName"
              className="font-semibold text-xs text-muted-foreground uppercase tracking-wider"
            >
              Nama Perusahaan
            </Label>
            <div className="relative">
              <BuildingIcon className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => !readOnly && setCompanyName?.(e.target.value)}
                readOnly={readOnly}
                className="pl-10 rounded-xl bg-background"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="location"
              className="font-semibold text-xs text-muted-foreground uppercase tracking-wider"
            >
              Lokasi Pekerjaan
            </Label>
            <div className="relative">
              <MapPinIcon className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <Input
                id="location"
                value={location}
                onChange={(e) => !readOnly && setLocation?.(e.target.value)}
                readOnly={readOnly}
                className="pl-10 rounded-xl bg-background"
                placeholder="e.g. Jakarta, Indonesia"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="position"
              className="font-semibold text-xs text-muted-foreground uppercase tracking-wider"
            >
              Posisi Kerja
            </Label>
            <div className="relative">
              <BriefcaseIcon className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <Input
                id="position"
                value={position}
                onChange={(e) => !readOnly && setPosition?.(e.target.value)}
                readOnly={readOnly}
                className="pl-10 rounded-xl bg-background"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="emailTo"
              className="font-semibold text-xs text-muted-foreground uppercase tracking-wider"
            >
              Email Kontak HRD
            </Label>
            <div className="relative">
              <AtSignIcon className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <Input
                id="emailTo"
                value={emailTo}
                onChange={(e) => !readOnly && setEmailTo?.(e.target.value)}
                readOnly={readOnly}
                className="pl-10 rounded-xl bg-background"
                placeholder="hr@company.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label
              htmlFor="salaryRange"
              className="font-semibold text-xs text-muted-foreground uppercase tracking-wider"
            >
              Estimasi / Range Gaji
            </Label>
            <div className="relative">
              <CoinsIcon className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
              <Input
                id="salaryRange"
                value={salaryRange}
                disabled={true}
                className="pl-10 rounded-xl bg-muted/40 border-border text-muted-foreground cursor-not-allowed select-none font-medium"
                placeholder="Tidak disebutkan"
              />
            </div>
            <p className="text-[10.5px] text-muted-foreground leading-normal mt-0.5">
              * Info estimasi gaji dideteksi secara otomatis dari deskripsi
              lowongan. Input dikunci untuk menjaga integritas data.
            </p>
          </div>
        </div>

        {/* Requirements & Job Details Section (Markdown-friendly) */}
        <div className="flex flex-col gap-3 rounded-xl border bg-muted/5 p-5">
          <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
            Persyaratan & Detail Lowongan Kerja
          </span>
          {readOnly ? (
            requirements.length > 0 && requirements[0] ? (
              <div className="text-[13px] leading-relaxed text-foreground space-y-1">
                <ReactMarkdown
                  components={{
                    h1: ({ ...props }) => (
                      <h1
                        className="text-base font-heading font-bold mt-5 mb-2 text-foreground border-b border-border/20 pb-1"
                        {...props}
                      />
                    ),
                    h2: ({ ...props }) => (
                      <h2
                        className="text-sm font-heading font-bold mt-4 mb-1.5 text-foreground"
                        {...props}
                      />
                    ),
                    h3: ({ ...props }) => (
                      <h3
                        className="text-xs font-heading font-bold uppercase tracking-wider mt-3 mb-1 text-primary/95"
                        {...props}
                      />
                    ),
                    p: ({ ...props }) => (
                      <p
                        className="text-[13px] leading-relaxed text-muted-foreground my-1.5"
                        {...props}
                      />
                    ),
                    ul: ({ ...props }) => (
                      <ul
                        className="list-disc pl-5 my-2 space-y-1 text-muted-foreground"
                        {...props}
                      />
                    ),
                    ol: ({ ...props }) => (
                      <ol
                        className="list-decimal pl-5 my-2 space-y-1 text-muted-foreground"
                        {...props}
                      />
                    ),
                    li: ({ ...props }) => (
                      <li
                        className="text-[13px] leading-relaxed text-foreground/90 pl-0.5"
                        {...props}
                      />
                    ),
                    strong: ({ ...props }) => (
                      <strong
                        className="font-semibold text-foreground"
                        {...props}
                      />
                    ),
                    em: ({ ...props }) => (
                      <em
                        className="italic text-muted-foreground/90"
                        {...props}
                      />
                    ),
                  }}
                >
                  {requirements[0]}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Tidak ada persyaratan khusus yang terekstrak.
              </p>
            )
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                Teks hasil ekstraksi di bawah disajikan dalam format Markdown.
                Silakan sunting jika ada kekeliruan (tambahkan responsibilities,
                kualifikasi, atau info benefit).
              </p>
              <Textarea
                value={requirements[0] || ""}
                onChange={(e) => setRequirements?.([e.target.value])}
                rows={12}
                className="font-mono text-sm leading-relaxed rounded-xl"
                placeholder={`### Responsibilities\n- Develop server-side...\n\n### Requirements\n- Bachelor's degree...`}
              />
            </div>
          )}
        </div>

        {!readOnly && handleSave && handleBack && (
          <div className="flex justify-between items-center border-t border-border/40 pt-5 mt-2">
            <Button
              variant="outline"
              onClick={handleBack}
              className="rounded-xl border hover:bg-muted px-5 py-2 font-medium"
            >
              Kembali
            </Button>

            <Button
              onClick={handleSave}
              disabled={saving || !companyName.trim() || !position.trim()}
              className="rounded-xl bg-success hover:bg-success/95 text-success-foreground px-6 py-2 shadow-sm font-semibold"
            >
              {saving ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />{" "}
                  Menyimpan...
                </>
              ) : (
                <>
                  Simpan & Lanjutkan <SaveIcon className="ml-2 size-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
