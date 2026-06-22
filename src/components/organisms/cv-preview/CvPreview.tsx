"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ParsedCvData } from "@/types/cv";
import { toast } from "sonner";

interface CvPreviewProps {
  id: string;
  initialName: string;
  initialIsBase: boolean;
  initialData: ParsedCvData;
}

type FontType = "sans" | "serif" | "mono";
type SpacingType = "compact" | "normal" | "spacious";
type ColorType = "navy" | "charcoal" | "black";

export function CvPreview({ id, initialName, initialData }: CvPreviewProps) {
  // Set document title dynamically on mount
  useEffect(() => {
    if (typeof window !== "undefined" && initialName) {
      document.title = `ATS CV - ${initialName}`;
    }
  }, [initialName]);


  // Preview configuration states
  const [fontFamily, setFontFamily] = useState<FontType>("sans");
  const [spacing, setSpacing] = useState<SpacingType>("compact");
  const [colorTheme, setColorTheme] = useState<ColorType>("navy");

  const { personal, experiences, educations, skillsAchievements } = initialData;

  const handlePrint = () => {
    window.print();
  };

  // Styling helper classes based on configurations
  const fontClass = {
    sans: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
  }[fontFamily];

  const spacingClass = {
    compact: "p-8 gap-y-2 text-[11px] leading-[1.35]",
    normal: "p-10 gap-y-3.5 text-[13px] leading-[1.45]",
    spacious: "p-12 gap-y-5 text-[15px] leading-[1.55]",
  }[spacing];

  const itemSpacing = {
    compact: "gap-y-1",
    normal: "gap-y-2",
    spacious: "gap-y-3.5",
  }[spacing];

  const headingSpacing = {
    compact: "mt-3 mb-1",
    normal: "mt-4.5 mb-2",
    spacious: "mt-6 mb-3",
  }[spacing];

  // Headings color styling (Rahmat's resume uses a vibrant royal blue `#004ea2`)
  const headingColor = {
    navy: "text-[#004ea2]",
    charcoal: "text-[#2d3748] dark:text-[#2d3748]",
    black: "text-[#000000]",
  }[colorTheme];

  const borderColor = {
    navy: "border-[#004ea2]",
    charcoal: "border-[#2d3748]",
    black: "border-[#000000]",
  }[colorTheme];

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 dark:bg-background pb-12 print:pb-0 print:bg-white">
      {/* Dynamic Style injection for printing media to overwrite screen styling */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm 12mm 12mm 12mm;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            min-height: 0 !important;
            background-color: white !important;
          }
          .print-hidden-elements {
            display: none !important;
          }
        }
      `}</style>

      {/* TOP CONTROLS PANEL - GLASSMORPHISM */}
      <header className="print-hidden-elements sticky top-14 z-20 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/60 bg-background/85 px-6 py-4 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="rounded-xl">
            <Link href={`/cv/${id}/edit`}>
              <ArrowLeftIcon className="size-4" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="font-heading text-base font-bold tracking-tight">
              Pratinjau CV ATS
            </h1>
            <p className="text-xs text-muted-foreground">
              Kustomisasi tata letak sebelum mengunduh PDF
            </p>
          </div>
        </div>

        {/* Panel controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Font Family */}
          <div className="flex items-center gap-1.5 bg-muted/60 dark:bg-muted/30 p-1 rounded-xl border border-border/40">
            <button
              type="button"
              onClick={() => setFontFamily("sans")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                fontFamily === "sans"
                  ? "bg-background shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Sans-Serif
            </button>
            <button
              type="button"
              onClick={() => setFontFamily("serif")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                fontFamily === "serif"
                  ? "bg-background shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Serif
            </button>
            <button
              type="button"
              onClick={() => setFontFamily("mono")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                fontFamily === "mono"
                  ? "bg-background shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Mono
            </button>
          </div>

          {/* Spacing / Margin */}
          <div className="flex items-center gap-1.5 bg-muted/60 dark:bg-muted/30 p-1 rounded-xl border border-border/40">
            <button
              type="button"
              onClick={() => setSpacing("compact")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                spacing === "compact"
                  ? "bg-background shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Rapat
            </button>
            <button
              type="button"
              onClick={() => setSpacing("normal")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                spacing === "normal"
                  ? "bg-background shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setSpacing("spacious")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                spacing === "spacious"
                  ? "bg-background shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Longgar
            </button>
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1.5 bg-muted/60 dark:bg-muted/30 p-1 rounded-xl border border-border/40">
            <button
              type="button"
              onClick={() => setColorTheme("navy")}
              title="Classic Navy"
              className={cn(
                "size-5 rounded-full bg-[#004ea2] border border-border/60 transition-all scale-90 hover:scale-100",
                colorTheme === "navy" &&
                "ring-2 ring-primary ring-offset-2 scale-100",
              )}
            />
            <button
              type="button"
              onClick={() => setColorTheme("charcoal")}
              title="Charcoal Gray"
              className={cn(
                "size-5 rounded-full bg-[#2d3748] border border-border/60 transition-all scale-90 hover:scale-100",
                colorTheme === "charcoal" &&
                "ring-2 ring-primary ring-offset-2 scale-100",
              )}
            />
            <button
              type="button"
              onClick={() => setColorTheme("black")}
              title="Pure Black"
              className={cn(
                "size-5 rounded-full bg-black border border-border/60 transition-all scale-90 hover:scale-100",
                colorTheme === "black" &&
                "ring-2 ring-primary ring-offset-2 scale-100",
              )}
            />
          </div>

          {/* Print/Download Button */}
          <Button
            onClick={handlePrint}
            className="rounded-xl shadow-md font-semibold bg-primary hover:bg-primary/95 text-primary-foreground"
          >
            <PrinterIcon className="mr-2 size-4" /> Cetak / Simpan PDF
          </Button>
        </div>
      </header>

      {/* WORKSPACE PREVIEW - CENTRAL CONTAINER */}
      <main className="flex-1 flex justify-center items-start pt-8 px-4 overflow-x-auto print:p-0 print:m-0">
        {/* A4 SIMULATION CONTAINER */}
        <div
          className={cn(
            "print-container relative flex flex-col w-[210mm] min-h-[297mm] bg-white text-black border border-border/80 shadow-2xl rounded-sm transition-all duration-200 select-text",
            fontClass,
            spacingClass,
          )}
          style={{ contentVisibility: "auto" }}
        >
          {/* PERSONAL INFO HEADER */}
          <header className="flex flex-col text-left gap-1">
            <h1
              className={cn(
                "text-3xl font-extrabold tracking-tight uppercase",
                headingColor,
              )}
            >
              {personal.name || "NAMA LENGKAP"}
            </h1>

            {/* Contact details row */}
            <div className="flex flex-wrap items-center text-xs gap-x-2 gap-y-1 mt-1 text-gray-500 font-medium">
              {personal.email && (
                <>
                  <span>{personal.email}</span>
                  {(personal.phone ||
                    personal.linkedin ||
                    personal.website) && (
                      <span className="text-gray-300">|</span>
                    )}
                </>
              )}
              {personal.phone && (
                <>
                  <span>{personal.phone}</span>
                  {(personal.linkedin || personal.website) && (
                    <span className="text-gray-300">|</span>
                  )}
                </>
              )}
              {personal.linkedin && (
                <>
                  <span className="hover:underline">{personal.linkedin}</span>
                  {personal.website && <span className="text-gray-300">|</span>}
                </>
              )}
              {personal.website && (
                <span className="hover:underline">{personal.website}</span>
              )}
            </div>

            {/* Location row */}
            {personal.location && (
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Domisili: {personal.location}
              </p>
            )}

            {/* Summary Block */}
            {personal.summary && (
              <p
                className={cn(
                  "text-justify mt-3.5 leading-relaxed text-[#1f2937]",
                  fontFamily === "serif" ? "indent-4" : "",
                )}
              >
                {personal.summary}
              </p>
            )}
          </header>

          {/* WORK EXPERIENCE SECTION */}
          {experiences.length > 0 && (
            <section className="flex flex-col">
              <h2
                className={cn(
                  "text-lg font-bold border-b pb-0.5 tracking-wide",
                  headingColor,
                  borderColor,
                  headingSpacing,
                )}
              >
                Work Experiences
              </h2>

              <div className={cn("flex flex-col", itemSpacing)}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="flex flex-col">
                    {/* Header info */}
                    <div className="flex justify-between items-baseline w-full">
                      <h3 className="font-bold text-[#111827]">
                        {exp.company}
                        {exp.location && (
                          <span className="font-normal text-gray-500">
                            {" "}
                            - {exp.location}
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-[#4a5568] shrink-0 font-medium">
                        {exp.duration}
                      </span>
                    </div>

                    {/* Job Position Title */}
                    {exp.position && (
                      <p className="text-xs italic text-[#1f2937] font-semibold mb-1">
                        {exp.position}
                      </p>
                    )}

                    {/* Bullet descriptions */}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside pl-4 flex flex-col gap-1 text-[#1f2937] text-justify">
                        {exp.bullets
                          .filter((b) => b.trim() !== "")
                          .map((bullet, idx) => (
                            <li key={`${exp.id}-b-${idx}`} className="pl-1">
                              {bullet}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION LEVEL SECTION */}
          {educations.length > 0 && (
            <section className="flex flex-col">
              <h2
                className={cn(
                  "text-lg font-bold border-b pb-0.5 tracking-wide",
                  headingColor,
                  borderColor,
                  headingSpacing,
                )}
              >
                Education Level
              </h2>

              <div className={cn("flex flex-col", itemSpacing)}>
                {educations.map((edu) => (
                  <div key={edu.id} className="flex flex-col">
                    {/* Header info */}
                    <div className="flex justify-between items-baseline w-full">
                      <h3 className="font-bold text-[#111827]">
                        {edu.institution}
                      </h3>
                      <span className="text-xs text-[#4a5568] shrink-0 font-medium">
                        {edu.duration}
                      </span>
                    </div>

                    {/* Degree details */}
                    {edu.degree && (
                      <p className="text-xs italic text-[#1f2937] font-semibold mb-1">
                        {edu.degree}
                      </p>
                    )}

                    {/* Bullet descriptions */}
                    {edu.bullets &&
                      edu.bullets.length > 0 &&
                      edu.bullets.some((b) => b.trim() !== "") && (
                        <ul className="list-disc list-outside pl-4 flex flex-col gap-1 text-[#1f2937] text-justify">
                          {edu.bullets
                            .filter((b) => b.trim() !== "")
                            .map((bullet, idx) => (
                              <li key={`${edu.id}-b-${idx}`} className="pl-1">
                                {bullet}
                              </li>
                            ))}
                        </ul>
                      )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SKILLS & ACHIEVEMENTS SECTION */}
          {skillsAchievements.length > 0 && (
            <section className="flex flex-col">
              <h2
                className={cn(
                  "text-lg font-bold border-b pb-0.5 tracking-wide",
                  headingColor,
                  borderColor,
                  headingSpacing,
                )}
              >
                Skills, Achievements & Other Experience
              </h2>

              <div className="flex flex-col gap-1.5">
                {skillsAchievements.map((item) => {
                  if (!item.description.trim()) return null;
                  return (
                    <div key={item.id} className="text-[#1f2937] text-justify">
                      <strong className="font-semibold text-[#111827]">
                        {item.category}
                      </strong>
                      {item.year && (
                        <span className="text-gray-600"> ({item.year})</span>
                      )}
                      <span>: </span>
                      <span>{item.description}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {/* Page Break Guide Line (Screen only) - Rendered at the bottom of the DOM for correct paint order */}
          <div className="absolute top-[297mm] left-0 right-0 border-t-2 border-dashed border-red-500 print:hidden pointer-events-none z-30">
            <span className="absolute right-6 -top-3 bg-red-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-mono border border-red-700 font-bold shadow-sm">
              Batas Halaman 1 (A4)
            </span>
          </div>

          <div className="absolute top-[594mm] left-0 right-0 border-t-2 border-dashed border-red-500 print:hidden pointer-events-none z-30">
            <span className="absolute right-6 -top-3 bg-red-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-mono border border-red-700 font-bold shadow-sm">
              Batas Halaman 2 (A4)
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
