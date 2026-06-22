"use client";

import { PlusIcon } from "lucide-react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Button } from "@/components/ui/button";
import { useEmailTemplatesManager } from "@/hooks/useEmailTemplatesManager";
import type { EmailTemplate } from "@/lib/constants/templates";
import { EmailTemplateEditor } from "./EmailTemplateEditor";
import { EmailTemplateList } from "./EmailTemplateList";

interface EmailTemplatesClientProps {
  initialTemplates: EmailTemplate[];
}

export function EmailTemplatesClient({
  initialTemplates,
}: EmailTemplatesClientProps) {
  const manager = useEmailTemplatesManager(initialTemplates);

  const {
    templates,
    activeTemplateId,
    activeTemplate,
    saving,
    deletingId,
    handleSelectTemplate,
    handleUpdateActiveTemplate,
    handleSaveActiveTemplate,
    handleNewTemplate,
    handleDeleteTemplate,
    insertToken,
  } = manager;

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <SectionHeader
        title="Template Email"
        subtitle="Kelola template email dasar yang digunakan AI untuk membuat draf surat lamaran kamu."
        action={
          <Button size="sm" onClick={handleNewTemplate} className="rounded-xl">
            <PlusIcon className="mr-2 size-4" />
            Template Baru
          </Button>
        }
      />

      <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-12 min-h-0">
        {/* Left: Template List */}
        <div className="lg:col-span-4 h-full overflow-hidden">
          <EmailTemplateList
            templates={templates}
            activeTemplateId={activeTemplateId}
            onSelectTemplate={handleSelectTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            deletingId={deletingId}
          />
        </div>

        {/* Right: Template Editor */}
        <div className="lg:col-span-8 h-full overflow-hidden">
          <EmailTemplateEditor
            activeTemplate={activeTemplate}
            onUpdateTemplate={handleUpdateActiveTemplate}
            onSaveTemplate={handleSaveActiveTemplate}
            saving={saving}
            onInsertToken={insertToken}
          />
        </div>
      </div>
    </div>
  );
}
