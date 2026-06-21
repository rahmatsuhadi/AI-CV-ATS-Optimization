"use client";

import { PlusIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Template = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "1",
    name: "Standard Application",
    subject: "Application for [Position] - [Name]",
    body: "Dear Hiring Manager,\n\nI am writing to express my interest in the [Position] position at [Company]. With my background in React and frontend architecture, I believe I can make an immediate impact on your team.\n\nI have attached my tailored CV for your review. I look forward to the possibility of discussing this exciting opportunity with you.\n\nBest regards,\n[Name]",
  },
  {
    id: "2",
    name: "Referral / Warm Intro",
    subject: "Referred by [Referrer_Name] for [Position] role",
    body: "Hi [Hiring_Manager_Name],\n\n[Referrer_Name] suggested I reach out regarding the [Position] opening at [Company]. We worked together previously and they mentioned my experience would be a great fit for your team's current goals.\n\nI've attached my resume. I'd love to set up a brief chat to learn more about the role.\n\nBest,\n[Name]",
  },
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cv_email_templates");
    if (stored) {
      const parsed = JSON.parse(stored);
      setTemplates(parsed);
      if (parsed.length > 0) setActiveTemplateId(parsed[0].id);
    } else {
      setTemplates(DEFAULT_TEMPLATES);
      setActiveTemplateId(DEFAULT_TEMPLATES[0].id);
      localStorage.setItem(
        "cv_email_templates",
        JSON.stringify(DEFAULT_TEMPLATES),
      );
    }
  }, []);

  const activeTemplate = templates.find((t) => t.id === activeTemplateId);

  const handleUpdate = (field: keyof Template, value: string) => {
    setTemplates(
      templates.map((t) =>
        t.id === activeTemplateId ? { ...t, [field]: value } : t,
      ),
    );
  };

  const handleSave = () => {
    localStorage.setItem("cv_email_templates", JSON.stringify(templates));
    alert("Templates saved successfully!");
  };

  const handleNewTemplate = () => {
    const newId = Date.now().toString();
    const newTemplates = [
      ...templates,
      {
        id: newId,
        name: "New Custom Template",
        subject: "Subject here...",
        body: "Write your custom template body here. Use brackets like [Company] for AI replacement variables.",
      },
    ];
    setTemplates(newTemplates);
    setActiveTemplateId(newId);
    localStorage.setItem("cv_email_templates", JSON.stringify(newTemplates));
  };

  const handleDelete = (id: string) => {
    const filtered = templates.filter((t) => t.id !== id);
    setTemplates(filtered);
    if (activeTemplateId === id && filtered.length > 0) {
      setActiveTemplateId(filtered[0].id);
    } else if (filtered.length === 0) {
      setActiveTemplateId(null);
    }
    localStorage.setItem("cv_email_templates", JSON.stringify(filtered));
  };

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-8rem)]">
      <SectionHeader
        title="Email Templates"
        subtitle="Manage the base templates the AI uses to draft your application emails."
        action={
          <div className="flex gap-2">
            <Button size="sm" onClick={handleNewTemplate}>
              <PlusIcon className="mr-2 size-4" />
              New Template
            </Button>
            <Button size="sm" variant="outline" onClick={handleSave}>
              <SaveIcon className="mr-2 size-4" />
              Save All
            </Button>
          </div>
        }
      />

      <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Template List */}
        <div className="flex flex-col gap-3 lg:col-span-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm overflow-y-auto">
          <p className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2">
            Saved Templates
          </p>
          {templates.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => setActiveTemplateId(t.id)}
              className={cn(
                "group flex items-center justify-between cursor-pointer w-full text-left rounded-xl p-3 transition-colors",
                activeTemplateId === t.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted/50 border border-transparent",
              )}
            >
              <div className="flex flex-col overflow-hidden">
                <span
                  className={cn(
                    "text-sm font-semibold truncate",
                    activeTemplateId === t.id
                      ? "text-primary"
                      : "text-foreground",
                  )}
                >
                  {t.name}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  {t.subject}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 opacity-0 group-hover:opacity-100 shrink-0 hover:bg-danger/10 hover:text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(t.id);
                }}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </button>
          ))}
          {templates.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No templates found.
            </p>
          )}
        </div>

        {/* Right: Template Editor */}
        <div className="flex flex-col gap-6 lg:col-span-8 rounded-2xl border border-border/60 bg-card p-6 shadow-sm overflow-y-auto">
          {activeTemplate ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold tracking-tight">
                  Edit Template
                </h3>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Template Name
                  </Label>
                  <Input
                    value={activeTemplate.name}
                    onChange={(e) => handleUpdate("name", e.target.value)}
                    className="rounded-xl font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Default Subject
                  </Label>
                  <Input
                    value={activeTemplate.subject}
                    onChange={(e) => handleUpdate("subject", e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-end">
                    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Email Body
                    </Label>
                    <span className="text-[10px] text-muted-foreground">
                      Supports variables: [Company], [Position], [Name]
                    </span>
                  </div>
                  <Textarea
                    rows={12}
                    value={activeTemplate.body}
                    onChange={(e) => handleUpdate("body", e.target.value)}
                    className="rounded-xl font-mono text-sm leading-relaxed"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Select or create a template to edit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
