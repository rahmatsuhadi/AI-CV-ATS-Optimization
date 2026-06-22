import { useState } from "react";
import { toast } from "sonner";
import {
  createOrUpdateEmailTemplate,
  deleteEmailTemplate,
} from "@/actions/email-template";
import {
  DEFAULT_TEMPLATES,
  type EmailTemplate,
} from "@/lib/constants/templates";

export function useEmailTemplatesManager(initialTemplates: EmailTemplate[]) {
  const mergedTemplates = (() => {
    const merged = [...initialTemplates];
    for (const dt of DEFAULT_TEMPLATES) {
      const exists = initialTemplates.some(
        (t) => t.id === dt.id || t.name === dt.name,
      );
      if (!exists) {
        merged.push(dt);
      }
    }
    return merged;
  })();

  const [templates, setTemplates] = useState<EmailTemplate[]>(mergedTemplates);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(
    mergedTemplates.length > 0 ? mergedTemplates[0].id : null,
  );
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeTemplate =
    templates.find((t) => t.id === activeTemplateId) || null;

  const handleSelectTemplate = (id: string) => {
    setActiveTemplateId(id);
  };

  const handleUpdateActiveTemplate = (
    field: keyof EmailTemplate,
    value: string,
  ) => {
    if (!activeTemplateId) return;
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === activeTemplateId ? { ...t, [field]: value } : t,
      ),
    );
  };

  const handleSaveActiveTemplate = async () => {
    if (!activeTemplate) return;

    if (!activeTemplate.name.trim()) {
      toast.error("Nama template tidak boleh kosong.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Menyimpan template email...");

    try {
      const res = await createOrUpdateEmailTemplate({
        id: activeTemplate.id,
        name: activeTemplate.name,
        subject: activeTemplate.subject,
        body: activeTemplate.body,
      });

      toast.dismiss(toastId);

      if (res.success && res.data) {
        const savedTemplate = res.data;
        // Update templates state to sync database ID if it was a temporary new template ID
        setTemplates((prev) =>
          prev.map((t) => (t.id === activeTemplateId ? savedTemplate : t)),
        );
        setActiveTemplateId(savedTemplate.id);
        toast.success("Template berhasil disimpan ke database!");
      } else {
        toast.error(res.error || "Gagal menyimpan template.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Terjadi kesalahan saat menyimpan template.");
    } finally {
      setSaving(false);
    }
  };

  const handleNewTemplate = () => {
    // Generate a temporary ID for client-side editing until saved in database
    const tempId = `temp-${Date.now()}`;
    const newTemplate: EmailTemplate = {
      id: tempId,
      name: "Template Kustom Baru",
      subject: "Lamaran Pekerjaan: [Position] - [Name]",
      body: "Halo Tim [Company],\n\nSaya tertarik dengan posisi [Position]...",
    };

    setTemplates((prev) => [...prev, newTemplate]);
    setActiveTemplateId(tempId);
    toast.info(
      "Template baru ditambahkan secara lokal. Klik Simpan untuk menyimpan ke database.",
    );
  };

  const handleDeleteTemplate = async (id: string) => {
    if (id.startsWith("temp-")) {
      // It's a temporary template, just remove from state
      const filtered = templates.filter((t) => t.id !== id);
      setTemplates(filtered);
      if (activeTemplateId === id) {
        setActiveTemplateId(filtered.length > 0 ? filtered[0].id : null);
      }
      toast.success("Template kustom dibatalkan.");
      return;
    }

    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus template ini?",
    );
    if (!confirmed) return;

    setDeletingId(id);
    const toastId = toast.loading("Menghapus template email...");

    try {
      const res = await deleteEmailTemplate(id);
      toast.dismiss(toastId);

      if (res.success) {
        const filtered = templates.filter((t) => t.id !== id);
        setTemplates(filtered);
        if (activeTemplateId === id) {
          setActiveTemplateId(filtered.length > 0 ? filtered[0].id : null);
        }
        toast.success("Template berhasil dihapus dari database.");
      } else {
        toast.error(res.error || "Gagal menghapus template.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Terjadi kesalahan saat menghapus template.");
    } finally {
      setDeletingId(null);
    }
  };

  const insertToken = (field: "subject" | "body", token: string) => {
    if (!activeTemplate) return;

    const activeElId =
      field === "subject" ? "template-subject" : "template-body";
    const element = document.getElementById(activeElId) as
      | HTMLInputElement
      | HTMLTextAreaElement;

    const currentValue =
      field === "subject" ? activeTemplate.subject : activeTemplate.body;

    if (element) {
      const start = element.selectionStart ?? 0;
      const end = element.selectionEnd ?? 0;
      const newValue =
        currentValue.substring(0, start) + token + currentValue.substring(end);

      handleUpdateActiveTemplate(field, newValue);

      // Refocus and place cursor after token
      setTimeout(() => {
        element.focus();
        element.setSelectionRange(start + token.length, start + token.length);
      }, 50);
    } else {
      // Fallback
      handleUpdateActiveTemplate(field, currentValue + token);
    }
  };

  return {
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
  };
}
