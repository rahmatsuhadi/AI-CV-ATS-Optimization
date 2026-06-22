import { Sidebar } from "@/components/organisms/Sidebar";
import { Topbar } from "@/components/organisms/Topbar";

interface AppShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function AppShell({ children, userEmail }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col pl-[240px] print:pl-0">
        <div className="print:hidden">
          <Topbar userEmail={userEmail} />
        </div>
        <main className="flex-1 p-8 print:p-0">
          <div className="mx-auto max-w-7xl print:max-w-none">{children}</div>
        </main>
      </div>
    </div>
  );
}
