import { getCVs } from "@/actions/cv";
import { CvList } from "@/components/organisms/cv-list/CvList";
import type { CvData } from "@/types/cv";

export default async function CvPage() {
  try {
    const res = await getCVs();

    let cvs: CvData[] = [];
    if (res.success && res.data) {
      cvs = res.data as CvData[];
    }

    return <CvList cvs={cvs} />;
  } catch (error) {
    console.error("Error loading CVs list in SSR:", error);
    return (
      <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
        <p className="text-sm font-semibold text-danger">
          Gagal memuat daftar CV. Silakan coba beberapa saat lagi.
        </p>
      </div>
    );
  }
}
