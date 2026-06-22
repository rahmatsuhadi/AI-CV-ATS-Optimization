"use client";

import { Loader2Icon, PlusIcon, UploadIcon } from "lucide-react";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { CvCard } from "@/components/molecules/CvCard";
import { Button } from "@/components/ui/button";
import { useCvList } from "@/hooks/useCvList";
import type { CvData } from "@/types/cv";

interface CvListProps {
  cvs: CvData[];
}

export function CvList({ cvs }: CvListProps) {
  const {
    fileInputRef,
    actionLoading,
    triggerFileUpload,
    handleBuildScratch,
    handleFileUpload,
  } = useCvList({ initialCvsCount: cvs.length });

  return (
    <div className="flex flex-col gap-8">
      {/* Hidden file input for upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf"
        className="hidden"
      />

      <SectionHeader
        title="My CVs"
        subtitle="Upload or create a new CV to get started."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={triggerFileUpload}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : (
                <UploadIcon className="mr-2 size-4" />
              )}
              Upload CV (PDF)
            </Button>
            <Button
              size="sm"
              onClick={handleBuildScratch}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : (
                <PlusIcon className="mr-2 size-4" />
              )}
              Buat dari Awal
            </Button>
          </div>
        }
      />

      {cvs.length > 0 ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {cvs.map((cv) => {
              // Format tanggal update secara manusiawi
              const updatedAtStr = cv.updated_at || new Date().toISOString();
              const date = new Date(updatedAtStr);
              const timeDiff = Math.abs(Date.now() - date.getTime());
              const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              const formattedDate =
                diffDays <= 1
                  ? "Updated recently"
                  : `Updated ${diffDays} days ago`;

              return (
                <CvCard
                  key={cv.id}
                  id={cv.id}
                  name={cv.name + (cv.is_base ? " (Base)" : "")}
                  score={undefined}
                  updatedAt={formattedDate}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
          <UploadIcon className="mb-4 size-10 text-muted-foreground" />
          <p className="font-heading text-lg font-semibold tracking-tight">
            Belum ada CV yang diunggah
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Mulai dengan mengunggah resume yang ada atau buat baru dari awal
            untuk membuka fitur penyesuaian CV.
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={triggerFileUpload}
              disabled={actionLoading}
              className="rounded-xl shadow-sm"
            >
              Upload PDF CV
            </Button>
            <Button
              size="sm"
              onClick={handleBuildScratch}
              disabled={actionLoading}
              className="rounded-xl shadow-md"
            >
              Buat dari Awal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
