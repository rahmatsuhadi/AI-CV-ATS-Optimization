import { CopyIcon, DownloadIcon, MailIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { EmailTemplate } from "@/lib/constants/templates";

interface Step4EmailGenProps {
  templates: EmailTemplate[];
  selectedTemplateId: string;
  setSelectedTemplateId: (val: string) => void;
  emailForm: { to: string; subject: string; body: string };
  setEmailForm: React.Dispatch<
    React.SetStateAction<{ to: string; subject: string; body: string }>
  >;
  emailGenerated: boolean;
  companyName: string;
  handleGenerateEmail: () => void;
  handleSendEmail: () => void;
  handleCopyEmail: () => void;
  handleBack: () => void;
}

export function Step4EmailGen({
  templates,
  selectedTemplateId,
  setSelectedTemplateId,
  emailForm,
  setEmailForm,
  emailGenerated,
  companyName,
  handleGenerateEmail,
  handleSendEmail,
  handleCopyEmail,
  handleBack,
}: Step4EmailGenProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm flex flex-col gap-6">
        {/* Grid: Email Generation Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Settings and Action Buttons */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-lg font-bold">
                Generate Email Pengantar
              </h3>
              <p className="text-xs text-muted-foreground">
                Pilih template email yang paling sesuai dengan kepribadian
                lowongan dan perusahaan.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="templateSelect"
                className="font-semibold text-xs text-muted-foreground uppercase tracking-wider"
              >
                Pilih Template Email
              </Label>
              <Select
                value={selectedTemplateId}
                onValueChange={setSelectedTemplateId}
              >
                <SelectTrigger
                  id="templateSelect"
                  className="h-9 w-full rounded-xl"
                >
                  <SelectValue placeholder="Pilih template..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerateEmail}
              className="w-full rounded-xl font-semibold shadow-md bg-primary hover:bg-primary/95"
            >
              <RefreshCwIcon className="mr-2 size-4" />
              Generate / Refresh Email Draft
            </Button>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 mt-2 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <DownloadIcon className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground truncate max-w-[170px]">
                    Tailored_CV_{companyName.replace(/\s+/g, "_")}.pdf
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    PDF Tailored untuk Lowongan • 1.2 MB
                  </span>
                </div>
              </div>
              <Separator className="bg-border/60" />
              <span className="text-[10px] text-muted-foreground leading-relaxed">
                CV akan diselaraskan otomatis dengan data yang kamu edit pada
                Step 3.
              </span>
            </div>
          </div>

          {/* Right Column: Email Form */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {emailGenerated ? (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Kirim Ke (To)
                  </Label>
                  <Input
                    value={emailForm.to}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, to: e.target.value })
                    }
                    className="rounded-xl shadow-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Subjek Email
                  </Label>
                  <Input
                    value={emailForm.subject}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, subject: e.target.value })
                    }
                    className="rounded-xl shadow-none font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Isi Surat / Pesan Lamaran
                  </Label>
                  <Textarea
                    rows={11}
                    value={emailForm.body}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, body: e.target.value })
                    }
                    className="rounded-xl shadow-none resize-none leading-relaxed font-sans text-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyEmail}
                    className="flex-1 rounded-xl border hover:bg-muted h-11 font-bold text-sm shadow-sm"
                  >
                    <CopyIcon className="mr-2 size-4" />
                    Salin Pesan
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSendEmail}
                    className="flex-1 rounded-xl bg-success text-success-foreground hover:bg-success/90 h-11 font-bold text-sm shadow-md"
                  >
                    <MailIcon className="mr-2 size-4" />
                    Kirim Email (Buka Client)
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[350px] border border-dashed border-border/80 rounded-xl bg-muted/10 text-center px-8">
                <MailIcon className="size-10 text-muted-foreground/50 mb-4" />
                <p className="font-heading text-sm font-semibold">
                  Draft email belum dibuat
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
                  Pilih template di kiri lalu klik tombol Generate untuk membuat
                  draft surat lamaran kamu.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Back and Forward */}
        <div className="flex justify-between items-center border-t border-border/40 pt-5 mt-2">
          <Button
            variant="outline"
            onClick={handleBack}
            className="rounded-xl border hover:bg-muted px-5 py-2 font-medium"
          >
            Kembali ke Analisis
          </Button>
          <div className="text-xs text-muted-foreground font-medium">
            Flow selesai — kamu siap mengirim lamaran.
          </div>
        </div>
      </div>
    </div>
  );
}
