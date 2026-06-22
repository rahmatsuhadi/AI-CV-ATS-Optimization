import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmailTemplate } from "@/lib/constants/templates";
import { cn } from "@/lib/utils";

interface EmailTemplateListProps {
  templates: EmailTemplate[];
  activeTemplateId: string | null;
  onSelectTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
  deletingId: string | null;
}

export function EmailTemplateList({
  templates,
  activeTemplateId,
  onSelectTemplate,
  onDeleteTemplate,
  deletingId,
}: EmailTemplateListProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm h-full overflow-y-auto">
      <p className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2">
        Daftar Template
      </p>

      <div className="flex flex-col gap-2">
        {templates.map((t) => {
          const isActive = activeTemplateId === t.id;
          const isDeleting = deletingId === t.id;

          return (
            <button
              type="button"
              key={t.id}
              onClick={() => onSelectTemplate(t.id)}
              className={cn(
                "group flex items-center justify-between cursor-pointer w-full text-left rounded-xl p-3.5 transition-all border",
                isActive
                  ? "bg-primary/10 border-primary/20 shadow-sm"
                  : "hover:bg-muted/50 border-transparent bg-background/30",
              )}
            >
              <div className="flex flex-col overflow-hidden min-w-0 pr-2">
                <span
                  className={cn(
                    "text-sm font-semibold truncate transition-colors",
                    isActive ? "text-primary" : "text-foreground",
                  )}
                >
                  {t.name}
                </span>
                <span className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {t.subject || "(Subjek Kosong)"}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                disabled={isDeleting}
                className={cn(
                  "size-8 shrink-0 hover:bg-danger/10 hover:text-danger rounded-lg transition-all",
                  isActive
                    ? "opacity-100 text-muted-foreground"
                    : "opacity-0 group-hover:opacity-100 text-muted-foreground/60",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTemplate(t.id);
                }}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </button>
          );
        })}

        {templates.length === 0 && (
          <div className="text-center py-10 px-4">
            <p className="text-sm font-medium text-muted-foreground">
              Tidak ada template email.
            </p>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Klik "Template Baru" untuk membuat template email kustom pertama
              kamu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
