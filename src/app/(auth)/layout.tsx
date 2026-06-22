import { Logo } from "@/components/atoms/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
