import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "mbuh-job",
  description:
    "Kelola lamaran kerja, optimalkan CV untuk ATS, dan pantau pipeline rekrutmen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", "font-sans", jakartaSans.variable)}
    >
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
