import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CV Optimizer AI",
  description: "Optimize your CV for ATS and track job applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", "font-sans")}>
      <body className="min-h-full flex flex-col selection:bg-primary/30 selection:text-primary">
        {/* Subtle noise texture overlay for high-end SaaS feel */}
        <div
          className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        ></div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
