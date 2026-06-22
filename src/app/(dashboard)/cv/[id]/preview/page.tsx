import { notFound } from "next/navigation";
import { getCVById } from "@/actions/cv";
import { CvPreview } from "@/components/organisms/cv-preview/CvPreview";
import { parseCvStructuredJson } from "@/services/cv-parser";
import type { CvStructuredJson } from "@/types/cv";

interface CvPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function CvPreviewPage({ params }: CvPreviewPageProps) {
  const { id } = await params;

  try {
    const res = await getCVById(id);

    if (!res.success || !res.data) {
      return notFound();
    }

    const cv = res.data;
    const initialName = cv.name || "Untitled CV";
    const initialIsBase = cv.is_base || false;
    const initialData = parseCvStructuredJson(
      cv.structured_json as CvStructuredJson | null,
    );

    return (
      <CvPreview
        id={id}
        initialName={initialName}
        initialIsBase={initialIsBase}
        initialData={initialData}
      />
    );
  } catch (error) {
    console.error("Error loading CV data in SSR Preview:", error);
    return (
      <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
        <p className="text-sm font-semibold text-danger">
          Gagal memuat data pratinjau CV. Silakan coba beberapa saat lagi.
        </p>
      </div>
    );
  }
}
