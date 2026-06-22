import { Loader2Icon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Step1InputPlanProps {
  rawText: string;
  setRawText?: (val: string) => void;
  extracting?: boolean;
  handleAnalyzeText?: () => void;
  readOnly?: boolean;
}

export function Step1InputPlan({
  rawText,
  setRawText,
  extracting = false,
  handleAnalyzeText,
  readOnly = false,
}: Step1InputPlanProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-lg font-bold">
            Plan Pekerjaan / Info Lowongan {readOnly && "(Read-Only)"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {readOnly
              ? "Teks deskripsi lowongan kerja asli yang disimpan."
              : "Paste detail teks lowongan pekerjaan untuk mulai mengekstrak data otomatis."}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="planRawText" className="font-semibold text-sm">
            Teks Lowongan Pekerjaan
          </Label>
          <Textarea
            id="planRawText"
            rows={12}
            placeholder="Tempel deskripsi lowongan..."
            value={rawText}
            onChange={(e) => !readOnly && setRawText?.(e.target.value)}
            readOnly={readOnly}
            className="rounded-xl font-sans text-sm focus:ring-1 focus:ring-primary/40 focus:border-primary/40 leading-relaxed bg-background"
          />
        </div>

        {!readOnly && handleAnalyzeText && (
          <div className="flex justify-end gap-3 border-t border-border/40 pt-5">
            <Button
              onClick={handleAnalyzeText}
              disabled={extracting || !rawText.trim()}
              className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground px-6 py-2 shadow-sm font-semibold"
            >
              {extracting ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />{" "}
                  Mengekstrak...
                </>
              ) : (
                <>
                  <SparklesIcon className="mr-2 size-4" /> Analisis & Ekstrak
                  Data
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
