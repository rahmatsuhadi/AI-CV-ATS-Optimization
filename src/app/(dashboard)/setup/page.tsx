import { ArrowRightIcon, PlusIcon, UploadIcon } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { Button } from "@/components/ui/button";

export default function SetupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-12">
        <Logo />
      </div>

      <div className="flex max-w-2xl flex-col items-center gap-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Let&apos;s build your Base CV
        </h1>
        <p className="text-muted-foreground">
          To unlock AI tailoring and match analysis, we need a baseline CV to
          work from. You can upload your existing resume, or build one from
          scratch.
        </p>

        <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="group flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <UploadIcon className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-heading font-semibold">
                Upload PDF/DOCX
              </span>
              <span className="text-xs text-muted-foreground">
                We&apos;ll parse it into structured data
              </span>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="group flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <PlusIcon className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-heading font-semibold">
                Build from Scratch
              </span>
              <span className="text-xs text-muted-foreground">
                Use our guided forms
              </span>
            </div>
          </Link>
        </div>

        <Button
          variant="ghost"
          className="mt-8 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/dashboard">
            Skip for now (Features will be limited)
            <ArrowRightIcon className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
