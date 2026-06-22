import { getEmailTemplates } from "@/actions/email-template";
import { EmailTemplatesClient } from "@/components/organisms/email-templates/EmailTemplatesClient";

export const revalidate = 0; // Force dynamic rendering so user always gets latest data on load

export default async function EmailTemplatesPage() {
  const res = await getEmailTemplates();
  const initialTemplates = res.success && res.data ? res.data : [];

  return <EmailTemplatesClient initialTemplates={initialTemplates} />;
}
