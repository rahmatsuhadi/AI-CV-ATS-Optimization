import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { createCV, parsePdfToCv } from "@/actions/cv";

interface UseCvListProps {
  initialCvsCount: number;
}

export function useCvList({ initialCvsCount }: UseCvListProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Trigger file selection for Upload CV
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Build CV from scratch flow
  const handleBuildScratch = async () => {
    setActionLoading(true);
    toast.info("Sedang menyiapkan editor CV baru...");
    try {
      const defaultName = `Resume #${initialCvsCount + 1}`;
      const defaultJson = {
        personal: { name: "", email: "", phone: "", summary: "" },
        skills: [],
        experience: [],
      };

      // Default first CV to be base CV if there are no CVs
      const isBase = initialCvsCount === 0;

      const res = await createCV(defaultName, defaultJson, isBase);
      if (res.success && res.data) {
        toast.success("CV baru berhasil dibuat!");
        router.push(`/cv/${res.data.id}/edit`);
        router.refresh();
      } else {
        toast.error(res.error || "Gagal membuat CV baru.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat membuat CV.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle PDF file upload and parsing
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActionLoading(true);
    const toastId = toast.loading(
      "Sedang membaca dan mengurai PDF menggunakan AI...",
    );

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 1. Parse PDF using local LLM server
      const parseRes = await parsePdfToCv(formData);
      if (!parseRes || "error" in parseRes || !parseRes.data) {
        toast.dismiss(toastId);
        const errorMsg =
          parseRes && "error" in parseRes
            ? (parseRes.error as string)
            : "AI gagal mengurai dokumen CV.";
        toast.error(errorMsg);
        setActionLoading(false);
        return;
      }

      // 2. Save structured JSON to Supabase
      const isBase = initialCvsCount === 0;
      const cleanFileName = file.name.replace(/\.[^/.]+$/, ""); // hapus ekstensi file
      const saveRes = await createCV(cleanFileName, parseRes.data, isBase);

      if (saveRes.success && saveRes.data) {
        toast.dismiss(toastId);
        toast.success("CV berhasil diunggah dan diurai!");
        router.refresh();
      } else {
        toast.dismiss(toastId);
        toast.error(saveRes.error || "Gagal menyimpan CV hasil analisis.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Terjadi kesalahan saat memproses file PDF.");
    } finally {
      setActionLoading(false);
      // Reset input file value
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return {
    fileInputRef,
    actionLoading,
    triggerFileUpload,
    handleBuildScratch,
    handleFileUpload,
  };
}
