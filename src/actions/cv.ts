"use server";

// Polyfill Node.js environment for pdfjs-dist / pdf-parse module evaluation
if (typeof globalThis.DOMMatrix === "undefined") {
  // @ts-expect-error
  globalThis.DOMMatrix = class DOMMatrix {};
}
if (typeof globalThis.Path2D === "undefined") {
  // @ts-expect-error
  globalThis.Path2D = class Path2D {};
}

import path from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "@/lib/supabase/server";
import { generateChatCompletion } from "@/services/ai";

export async function parsePdfToCv(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    // Ubah Next.js File jadi Buffer agar bisa dibaca pdf-parse
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import pdf-parse so polyfills run first and prevent ESM import hoisting
    const { PDFParse } = await import("pdf-parse");
    const localWorkerPath = path.join(
      process.cwd(),
      "node_modules/pdf-parse/dist/pdf-parse/cjs/pdf.worker.mjs",
    );
    PDFParse.setWorker(pathToFileURL(localWorkerPath).href);

    const pdfParser = new PDFParse({ data: buffer });

    // Ekstrak teks dari PDF
    const textResult = await pdfParser.getText();
    const rawText = textResult.text;

    if (!rawText || rawText.trim().length === 0) {
      return { error: "Could not extract text from the PDF." };
    }

    // Panggil AI lokal untuk mengurai text menjadi JSON terstruktur
    const systemPrompt = `You are an expert HR data extractor. Carefully parse the provided raw CV text and extract all relevant information.
Note that contact details can be grouped together on a single line separated by pipe characters "|" (e.g., phone, email, LinkedIn, website URLs).
Extract the candidate's personal info, work experiences, education history, and all other items (like Hard Skills, Soft Skills, Achievements, Projects, Webinars, Interests) into the appropriate categories.

CRITICAL RULES:
1. Do NOT summarize, shorten, paraphrase, or omit any information. Extract all descriptions, responsibilities, accomplishments, skills, and details verbatim and in full.
2. For experiences and education, identify the bullet points (often denoted by "-" or "•" or similar bullet symbols) and extract each point as a separate item in the "bullets" array of strings.
3. Group all skills (Hard Skills, Soft Skills), achievements/certifications, and other experiences into the "skills_and_achievements" array. Classify them under categories like "Hard Skills", "Soft Skills", "Achievements", "Projects", "Modules Taken", "Webinars Attended", or "Interest". If a year is specified (e.g. for achievements or projects), populate the "year" field.

Output ONLY a valid JSON object matching this EXACT schema:
{
  "personal": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "summary": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string"
  },
  "experience": [
    {
      "id": "generate_unique_string",
      "company": "string",
      "location": "string",
      "position": "string",
      "duration": "string",
      "bullets": ["string (verbatim bullet point 1)", "string (verbatim bullet point 2)"]
    }
  ],
  "education": [
    {
      "id": "generate_unique_string",
      "institution": "string",
      "degree": "string",
      "duration": "string",
      "bullets": ["string (verbatim bullet point 1)", "string (verbatim bullet point 2)"]
    }
  ],
  "skills_and_achievements": [
    {
      "id": "generate_unique_string",
      "category": "string (e.g., Hard Skills, Soft Skills, Achievements, Projects, Webinars Attended, Interest)",
      "year": "string (optional, e.g. 2025)",
      "description": "string (list of skills or verbatim details of projects/achievements)"
    }
  ]
}

Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.`;

    const aiResponseContent = await generateChatCompletion(
      systemPrompt,
      `Here is the raw CV text:\n\n${rawText}`,
      { json: true },
    );

    if (!aiResponseContent) {
      return { error: "AI failed to generate a response." };
    }

    // Parsing string kembalian AI jadi objek JSON
    const parsedData = JSON.parse(aiResponseContent as string);
    return { success: true, data: parsedData };
  } catch (error) {
    console.error("Error parsing CV:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during parsing.",
    };
  }
}

export async function getCVs() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("cvs")
      .select("*, jobs(company_name, position)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching CVs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch CVs",
    };
  }
}

export async function getCVById(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data, error } = await supabase
      .from("cvs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching CV:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch CV",
    };
  }
}

export async function getBaseCV() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Cari CV yang ditandai sebagai base CV
    let { data, error } = await supabase
      .from("cvs")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_base", true)
      .maybeSingle();

    if (error) throw error;

    // Fallback: Jika tidak ada base CV, cari CV paling pertama/terbaru
    if (!data) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("cvs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fallbackError) throw fallbackError;
      data = fallbackData;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching base CV:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch base CV",
    };
  }
}

export async function getTailoredCVForJob(jobId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("cvs")
      .select("*")
      .eq("user_id", user.id)
      .eq("job_id", jobId)
      .maybeSingle();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching tailored CV for job:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch tailored CV",
    };
  }
}

export async function createCV(
  name: string,
  structuredJson: unknown,
  isBase = false,
  jobId?: string,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Jika ini ditandai sebagai base, set is_base = false untuk CV lainnya
    if (isBase) {
      await supabase
        .from("cvs")
        .update({ is_base: false })
        .eq("user_id", user.id);
    }

    const { data, error } = await supabase
      .from("cvs")
      .insert({
        user_id: user.id,
        name,
        structured_json: structuredJson,
        is_base: isBase,
        job_id: jobId || null,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error creating CV:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create CV",
    };
  }
}

export async function updateCV(
  id: string,
  name: string,
  structuredJson: unknown,
  isBase = false,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Jika ini ditandai sebagai base, set is_base = false untuk CV lainnya
    if (isBase) {
      await supabase
        .from("cvs")
        .update({ is_base: false })
        .eq("user_id", user.id)
        .neq("id", id);
    }

    const { data, error } = await supabase
      .from("cvs")
      .update({
        name,
        structured_json: structuredJson,
        is_base: isBase,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error updating CV:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update CV",
    };
  }
}

export async function deleteCV(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase.from("cvs").delete().eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting CV:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to delete CV",
    };
  }
}
