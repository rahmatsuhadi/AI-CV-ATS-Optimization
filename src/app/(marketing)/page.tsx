import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center md:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl">
          Lolos ATS. <br />
          <span className="text-primary">Raih Interview.</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Ubah CV kamu jadi senjata yang tepat sasaran. Analisis deskripsi
          lowongan, optimalkan resume untuk sistem ATS, dan pantau semua
          lamaranmu — dalam satu tempat.
        </p>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="/register">Mulai Gratis</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base"
            asChild
          >
            <Link href="/login">Masuk</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
