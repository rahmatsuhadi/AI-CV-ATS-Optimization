import { redirect } from "next/navigation";
import { AppShell } from "@/components/templates/AppShell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // NOTE: For full onboarding/baseCV checking,
  // you might also query the database here to check if the user has a CV profile.
  // For now, we will pass user data to the shell.

  return <AppShell userEmail={user.email}>{children}</AppShell>;
}
