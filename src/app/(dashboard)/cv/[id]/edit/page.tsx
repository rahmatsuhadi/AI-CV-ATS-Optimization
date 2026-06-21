"use client";

import { ArrowLeftIcon, PlusIcon, SaveIcon } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  bullets: string;
}

export default function CvEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [tab, setTab] = useState("personal");

  // Form State
  const [personal, setPersonal] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+62 812-3456-7890",
    summary:
      "Experienced Software Engineer with a passion for web development and AI.",
  });

  const [skills, setSkills] = useState<string[]>([
    "React",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
  ]);
  const [newSkill, setNewSkill] = useState("");

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      company: "Tech Corp",
      position: "Frontend Developer",
      duration: "2023 - Present",
      bullets: "Led development of core features. Mentored junior devs.",
    },
  ]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        company: "",
        position: "",
        duration: "",
        bullets: "",
      },
    ]);
  };

  const updateExperience = (index: number, fields: Partial<Experience>) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], ...fields };
    setExperiences(updated);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cv">
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <SectionHeader
          title={`Edit CV: CV #${id}`}
          subtitle="Form-based ATS friendly editor"
          action={
            <Button size="sm">
              <SaveIcon className="mr-2 size-4" />
              Save Changes
            </Button>
          }
        />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
        </TabsList>

        <TabsContent
          value="personal"
          className="mt-6 flex flex-col gap-4 rounded-xl border bg-card p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={personal.name}
                onChange={(e) =>
                  setPersonal({ ...personal, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={personal.email}
                onChange={(e) =>
                  setPersonal({ ...personal, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={personal.phone}
              onChange={(e) =>
                setPersonal({ ...personal, phone: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              rows={4}
              value={personal.summary}
              onChange={(e) =>
                setPersonal({ ...personal, summary: e.target.value })
              }
            />
          </div>
        </TabsContent>

        <TabsContent
          value="skills"
          className="mt-6 flex flex-col gap-4 rounded-xl border bg-card p-6"
        >
          <div className="flex gap-2">
            <Input
              placeholder="Add skill (e.g. Docker)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
            />
            <Button onClick={addSkill}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill, index) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="size-4 rounded-full text-primary hover:bg-primary/20"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experience" className="mt-6 flex flex-col gap-6">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="flex flex-col gap-4 rounded-xl border bg-card p-6"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(index, { company: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) =>
                      updateExperience(index, { position: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Duration</Label>
                  <Input
                    value={exp.duration}
                    placeholder="e.g. 2023 - Present"
                    onChange={(e) =>
                      updateExperience(index, { duration: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Responsibilities & Achievements</Label>
                <Textarea
                  rows={4}
                  value={exp.bullets}
                  onChange={(e) =>
                    updateExperience(index, { bullets: e.target.value })
                  }
                />
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full" onClick={addExperience}>
            <PlusIcon className="mr-2 size-4" />
            Add Experience
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
