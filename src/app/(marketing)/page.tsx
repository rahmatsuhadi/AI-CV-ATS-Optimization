import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center md:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl">
          Get Past the ATS. <br />
          <span className="text-primary">Land the Interview.</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Turn your CV into a data-driven masterpiece. Our AI analyzes job
          descriptions, optimizes your resume for ATS systems, and tracks your
          applications—all in one place.
        </p>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="/register">Start Optimizing for Free</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base"
            asChild
          >
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
