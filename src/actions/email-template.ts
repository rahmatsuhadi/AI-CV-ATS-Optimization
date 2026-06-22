"use server";

import { revalidatePath } from "next/cache";
import type { EmailTemplate } from "@/lib/constants/templates";
import { createClient } from "@/lib/supabase/server";

export async function getEmailTemplates() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch user's email templates
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return { success: true, data: data as EmailTemplate[] };
  } catch (error) {
    console.error("Error fetching email templates:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch email templates",
    };
  }
}

export async function createOrUpdateEmailTemplate(template: {
  id?: string;
  name: string;
  subject: string;
  body: string;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { id, name, subject, body } = template;
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (id && uuidRegex.test(id)) {
      // Update existing template
      const { data, error } = await supabase
        .from("email_templates")
        .update({
          name,
          subject,
          body,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      revalidatePath("/email-templates");
      return { success: true, data: data as EmailTemplate };
    } else {
      // Create new template
      const { data, error } = await supabase
        .from("email_templates")
        .insert({
          user_id: user.id,
          name,
          subject,
          body,
        })
        .select()
        .single();

      if (error) throw error;
      revalidatePath("/email-templates");
      return { success: true, data: data as EmailTemplate };
    }
  } catch (error) {
    console.error("Error saving email template:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to save email template",
    };
  }
}

export async function deleteEmailTemplate(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return { success: false, error: "Invalid ID format" };
    }

    const { error } = await supabase
      .from("email_templates")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/email-templates");
    return { success: true };
  } catch (error) {
    console.error("Error deleting email template:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete email template",
    };
  }
}
