import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/atoms/Providers";
import { cn } from "@/lib/utils";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
    <html
      lang="en"
      className={cn(
        "h-full dark",
        "antialiased",
        bricolage.variable,
        dmSans.variable,
        jbMono.variable,
        "font-sans",
      )}
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
