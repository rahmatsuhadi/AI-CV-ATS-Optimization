import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Personal } from "@/types/cv";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: "std-app",
    name: "Standard Application",
    subject: "Application for [Position] - [Name]",
    body: "Dear hiring team at [Company],\n\nI am excited to submit my application for the [Position] position. Having reviewed the job requirements, I believe my background and technical skills align closely with what you are looking for.\n\nI have attached my tailored CV for your review.\n\nBest regards,\n[Name]\n[Email] | [Phone]",
  },
  {
    id: "prof-direct",
    name: "Professional & Direct",
    subject: "[Position] Role - [Name]",
    body: "Hello Team [Company],\n\nI am writing to express my interest in the [Position] opening. With my strong experience in software engineering and development, I am confident I can bring immediate value to your team.\n\nPlease find my attached resume outlining my qualifications.\n\nBest regards,\n[Name]\n[Email] | [Phone]",
  },
  {
    id: "creative",
    name: "Creative & High Impact",
    subject: "Passionate Developer for [Company] - [Name]",
    body: "Hi [Company] team,\n\nI've been following [Company]'s growth and would love to contribute as a [Position]. I believe my skills in modern tech stacks and problem-solving align perfectly with what you are building.\n\nHere is my tailored resume for your consideration. Let me know if we can chat!\n\nCheers,\n[Name]\n[Email] | [Phone]",
  },
];

export function useEmailGenerator(
  companyName: string,
  position: string,
  emailTo: string,
  personal: Personal,
) {
  const [templates, setTemplates] =
    useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState("std-app");
  const [emailForm, setEmailForm] = useState({
    to: emailTo || "hr@company.com",
    subject: "",
    body: "",
  });
  const [emailGenerated, setEmailGenerated] = useState(false);

  // Fetch custom templates from localStorage on mount
  useEffect(() => {
    const storedTemplates = JSON.parse(
      localStorage.getItem("cv_email_templates") || "[]",
    );
    if (storedTemplates.length > 0) {
      setTemplates([...DEFAULT_TEMPLATES, ...storedTemplates]);
    }
  }, []);

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

  return {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    emailForm,
    setEmailForm,
    emailGenerated,
    handleGenerateEmailDraft,
    handleSendEmail,
  };
}
