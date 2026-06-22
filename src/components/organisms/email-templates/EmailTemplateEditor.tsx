import { SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EmailTemplate } from "@/lib/constants/templates";

interface EmailTemplateEditorProps {
  activeTemplate: EmailTemplate | null;
  onUpdateTemplate: (field: keyof EmailTemplate, value: string) => void;
  onSaveTemplate: () => void;
  saving: boolean;
  onInsertToken: (field: "subject" | "body", token: string) => void;
}

const TOKENS = [
  { label: "Perusahaan", token: "[Company]" },
  { label: "Posisi", token: "[Position]" },
  { label: "Nama Anda", token: "[Name]" },
  { label: "Email Anda", token: "[Email]" },
  { label: "Telepon Anda", token: "[Phone]" },
];

export function EmailTemplateEditor({
  activeTemplate,
  onUpdateTemplate,
  onSaveTemplate,
  saving,
  onInsertToken,
}: EmailTemplateEditorProps) {
  if (!activeTemplate) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground border border-dashed border-border/80 rounded-2xl bg-muted/5 p-8">
        Silakan pilih template di sebelah kiri atau buat baru untuk diedit.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm h-full overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h3 className="font-heading text-base font-bold tracking-tight">
            Edit Template Email
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sesuaikan subjek dan pesan pembuka email lamaran kamu.
          </p>
        </div>
        <Button
          size="sm"
          onClick={onSaveTemplate}
          disabled={saving}
          className="rounded-xl bg-primary hover:bg-primary/95 text-xs font-semibold px-4 py-2"
        >
          <SaveIcon className="mr-2 size-3.5" />
          {saving ? "Menyimpan..." : "Simpan Ke DB"}
        </Button>
      </div>

      <div className="flex flex-col gap-5">
        {/* Template Name */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="template-name"
            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Nama Template
          </Label>
          <Input
            id="template-name"
            placeholder="Contoh: Lamaran Standard, Warm Referral"
            value={activeTemplate.name}
            onChange={(e) => onUpdateTemplate("name", e.target.value)}
            className="rounded-xl font-medium shadow-none h-10"
          />
        </div>

        {/* Default Subject */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="template-subject"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Default Subjek Email
            </Label>
            <div className="flex gap-1.5 items-center flex-wrap">
              <span className="text-[10px] text-muted-foreground pr-1">
                Variabel:
              </span>
              <button
                type="button"
                onClick={() => onInsertToken("subject", "[Position]")}
                className="text-[9px] font-mono px-2 py-0.5 bg-muted hover:bg-primary/10 hover:text-primary border border-border/60 rounded-md transition-colors font-medium"
              >
                [Position]
              </button>
              <button
                type="button"
                onClick={() => onInsertToken("subject", "[Name]")}
                className="text-[9px] font-mono px-2 py-0.5 bg-muted hover:bg-primary/10 hover:text-primary border border-border/60 rounded-md transition-colors font-medium"
              >
                [Name]
              </button>
            </div>
          </div>
          <Input
            id="template-subject"
            placeholder="Contoh: Lamaran Pekerjaan - [Position] - [Name]"
            value={activeTemplate.subject}
            onChange={(e) => onUpdateTemplate("subject", e.target.value)}
            className="rounded-xl shadow-none h-10"
          />
        </div>

        {/* Email Body */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <Label
              htmlFor="template-body"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Pesan / Tubuh Email
            </Label>
            <div className="flex gap-1.5 items-center flex-wrap">
              <span className="text-[10px] text-muted-foreground pr-1">
                Variabel:
              </span>
              {TOKENS.map((item) => (
                <button
                  key={item.token}
                  type="button"
                  onClick={() => onInsertToken("body", item.token)}
                  className="text-[9px] font-mono px-1.5 py-0.5 bg-muted hover:bg-primary/10 hover:text-primary border border-border/60 rounded-md transition-colors font-medium"
                  title={`Klik untuk menyisipkan ${item.label}`}
                >
                  {item.token}
                </button>
              ))}
            </div>
          </div>
          <Textarea
            id="template-body"
            rows={10}
            placeholder="Tulis pesan pengantar lamaran pekerjaan di sini..."
            value={activeTemplate.body}
            onChange={(e) => onUpdateTemplate("body", e.target.value)}
            className="rounded-xl shadow-none font-sans text-sm leading-relaxed p-4"
          />
          <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
            💡 <strong>Tips:</strong> Klik tombol variabel di atas untuk
            menyisipkan penanda otomatis. Penanda ini akan diisi secara dinamis
            oleh AI pada Step 4 proses lamaran berdasarkan data CV dan detail
            lowongan kerja kamu.
          </p>
        </div>
      </div>
    </div>
  );
}
