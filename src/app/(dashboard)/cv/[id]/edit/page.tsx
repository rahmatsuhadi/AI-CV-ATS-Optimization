import { notFound } from "next/navigation";
import { getCVById } from "@/actions/cv";
import { CvEditForm } from "@/components/organisms/cv-edit/CvEditForm";
import { parseCvStructuredJson } from "@/services/cv-parser";
import type { CvStructuredJson } from "@/types/cv";

interface CvEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function CvEditPage({ params }: CvEditPageProps) {
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
      <CvEditForm
        id={id}
        initialName={initialName}
        initialIsBase={initialIsBase}
        initialData={initialData}
      />
    );
  } catch (error) {
    console.error("Error loading CV data in SSR:", error);
    return (
      <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
        <p className="text-sm font-semibold text-danger">
          Gagal memuat data CV. Silakan coba beberapa saat lagi.
        </p>
      </div>
    );
  }
}
