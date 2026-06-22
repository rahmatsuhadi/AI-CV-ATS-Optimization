import { useState } from "react";
import { toast } from "sonner";
import {
  DEFAULT_TEMPLATES,
  type EmailTemplate,
} from "@/lib/constants/templates";
import type { Personal } from "@/types/cv";

export function useEmailGenerator(
  companyName: string,
  position: string,
  emailTo: string,
  personal: Personal,
  initialTemplates: EmailTemplate[] = [],
) {
  const [templates] = useState<EmailTemplate[]>(() => {
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
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState(() => {
    const merged = [...initialTemplates];
    for (const dt of DEFAULT_TEMPLATES) {
      const exists = initialTemplates.some(
        (t) => t.id === dt.id || t.name === dt.name,
      );
      if (!exists) {
        merged.push(dt);
      }
    }
    return merged[0]?.id || "std-app";
  });
  const [emailForm, setEmailForm] = useState({
    to: emailTo || "hr@company.com",
    subject: "",
    body: "",
  });
  const [emailGenerated, setEmailGenerated] = useState(false);

  const handleGenerateEmailDraft = () => {
    const template =
      templates.find((t) => t.id === selectedTemplateId) || templates[0];
    const candidateName = personal.name || "Kandidat Pekerjaan";
    const candidateEmail = personal.email || "email.saya@example.com";
    const candidatePhone = personal.phone || "+628123456789";

    const prefilledSubject = template.subject
      .replace(/\[Position\]/g, position)
      .replace(/\[Name\]/g, candidateName);

    const prefilledBody = template.body
      .replace(/\[Company\]/g, companyName)
      .replace(/\[Position\]/g, position)
      .replace(/\[Name\]/g, candidateName)
      .replace(/\[Email\]/g, candidateEmail)
      .replace(/\[Phone\]/g, candidatePhone);

    setEmailForm({
      to: emailTo || "hr@company.com",
      subject: prefilledSubject,
      body: prefilledBody,
    });
    setEmailGenerated(true);
    toast.success("Email aplikasi berhasil di-generate sesuai template!");
  };

  const handleSendEmail = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(emailForm.to)}?subject=${encodeURIComponent(emailForm.subject)}&body=${encodeURIComponent(emailForm.body)}`;
    window.open(mailtoUrl, "_blank");
    toast.success("Membuka Email Client...");
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailForm.body);
    toast.success("Pesan email berhasil disalin ke clipboard!");
  };

  return {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    emailForm,
    setEmailForm,
    emailGenerated,
    handleGenerateEmailDraft,
    handleSendEmail,
    handleCopyEmail,
  };
}
