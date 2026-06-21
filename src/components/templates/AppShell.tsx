import { Sidebar } from "@/components/organisms/Sidebar";
import { Topbar } from "@/components/organisms/Topbar";

interface AppShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function AppShell({ children, userEmail }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-[240px]">
        <Topbar userEmail={userEmail} />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
