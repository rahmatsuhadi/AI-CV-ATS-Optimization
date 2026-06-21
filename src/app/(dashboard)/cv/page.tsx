"use client";

import { PlusIcon, UploadIcon } from "lucide-react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { CvCard } from "@/components/molecules/CvCard";
import { Button } from "@/components/ui/button";

export default function CvPage() {
  const hasBaseCv = true; // Temporary mock until DB state is connected

  const MOCK_CVS = hasBaseCv
    ? [
        {
          id: "1",
          name: "Software Engineer CV (Base)",
          score: undefined,
          updatedAt: "Updated 2 days ago",
        },
        {
          id: "2",
          name: "Backend Developer CV (Tailored)",
          score: undefined,
          updatedAt: "Updated 1 week ago",
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        title="My CVs"
        subtitle="Upload or create a new CV to get started."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <UploadIcon className="mr-2 size-4" />
              Upload CV
            </Button>
            <Button size="sm">
              <PlusIcon className="mr-2 size-4" />
              Build from Scratch
            </Button>
          </div>
        }
      />

      {MOCK_CVS.length > 0 ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {MOCK_CVS.map((cv) => (
              <CvCard key={cv.name} {...cv} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
          <UploadIcon className="mb-4 size-10 text-muted-foreground" />
          <p className="font-heading text-lg font-semibold tracking-tight">
            No CV uploaded yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Get started by uploading your existing resume or creating one from
            scratch to unlock AI tailoring.
          </p>
          <Button size="sm" className="mt-6 rounded-xl shadow-md">
            <PlusIcon className="mr-2 size-4" />
            Upload First CV
          </Button>
        </div>
      )}
    </div>
  );
}
