"use server";

import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import type { ParsedCvData } from "@/types/cv";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy",
  baseURL: process.env.OPENAI_BASE_URL || "http://localhost:20128/v1",
});

export interface JobData {
  id: string;
  company_name: string;
  position: string;
  location?: string | null;
  email_to?: string | null;
  status: "draft" | "applied" | "interview" | "offer" | "rejected";
  description?: string | null;
  requirements?: string[] | null;
  applied_at?: string;
  created_at?: string;
  salary_range?: string | null;
  ats_score?: number | null;
  matched_keywords?: string[] | null;
  missing_keywords?: string[] | null;
  ai_suggestions?: unknown | null;
}

export async function getJobById(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate if the ID is a valid UUID format.
    // If not, return a fallback mock job to prevent Supabase from throwing a 22P02 casting error.
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return {
        success: true,
        data: {
          id,
          company_name: "Mock Company (Transition)",
          position: "Frontend Developer",
          location: "Jakarta, Indonesia",
          email_to: "hr@mockcompany.com",
          status: "draft" as const,
          description: "Deskripsi pekerjaan transisi (mock)...",
          requirements: [
            "Pengalaman dengan React & TypeScript",
            "Familiar dengan Tailwind CSS",
          ],
          salary_range: "Rp 5,000,000 - Rp 7,500,000 (Negotiable)",
        },
      };
    }

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: data as JobData };
  } catch (error) {
    console.error("Error fetching job:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch job details",
    };
  }
}

export async function updateJob(id: string, updates: Partial<JobData>) {
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
      const { data, error } = await supabase
        .from("jobs")
        .insert({
          company_name: updates.company_name || "Unknown Company",
          position: updates.position || "Software Engineer",
          location: updates.location || "",
          email_to: updates.email_to || "",
          status: updates.status || "draft",
          description: updates.description || "",
          requirements: updates.requirements || [],
          salary_range: updates.salary_range || "",
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data as JobData, isNew: true };
    }

    const { data, error } = await supabase
      .from("jobs")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath(`/job/${id}`);
    return { success: true, data: data as JobData, isNew: false };
  } catch (error) {
    console.error("Error updating job:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update job details",
    };
  }
}

export async function createJob(job: Omit<JobData, "id">) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        ...job,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/job");
    return { success: true, data: data as JobData };
  } catch (error) {
    console.error("Error creating job:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create job",
    };
  }
}

export async function getJobs() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: data as JobData[] };
  } catch (error) {
    console.error("Error fetching jobs list:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch jobs list",
    };
  }
}

export async function extractJobDetails(rawText: string) {
  try {
    const systemPrompt = `You are an expert HR data extractor. Carefully parse the provided raw job description/posting text and extract:
- Company name (company_name)
- Position / role title (position)
- Location (location)
- Email for application submission or HR contact (email_to)
- A detailed and complete Markdown string containing all job qualifications, requirements, responsibilities, benefits, and relevant company info (requirements_markdown).
- Salary range, salary estimation, or monthly/hourly salary package if mentioned. Include indicators such as negotiable/fixed if detected (salary_range). Output "Tidak disebutkan" if no salary information is specified.

Ensure the requirements_markdown uses clean professional markdown styling with headers (e.g. ### Responsibilities, ### Requirements, ### Benefits, ### Other Info), bold text (**bold**), and bullet points (- item). Do not summarize or omit important details from the original post.

Output ONLY a valid JSON object matching this EXACT schema:
{
  "company_name": "string",
  "position": "string",
  "location": "string",
  "email_to": "string",
  "requirements_markdown": "string",
  "salary_range": "string"
}

Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.`;

    const response = await openai.chat.completions.create({
      model: "gemini/gemini-3.1-flash-lite-preview",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Here is the raw job description:\n\n${rawText}`,
        },
      ],
    });

    const aiResponseContent = response.choices[0]?.message?.content;

    if (!aiResponseContent) {
      return { success: false, error: "AI failed to generate a response." };
    }

    let jsonText = aiResponseContent.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText
        .replace(/^```(?:json)?\n?/, "")
        .replace(/\n?```$/, "");
    }

    const parsedData = JSON.parse(jsonText.trim());

    // Wrap the extracted markdown string inside a string[] array to maintain schema compatibility
    const requirementsArray = parsedData.requirements_markdown
      ? [parsedData.requirements_markdown]
      : [];

    return {
      success: true,
      data: {
        company_name: parsedData.company_name || "",
        position: parsedData.position || "",
        location: parsedData.location || "",
        email_to: parsedData.email_to || "",
        requirements: requirementsArray,
        salary_range: parsedData.salary_range || "Tidak disebutkan",
      },
    };
  } catch (error) {
    console.error("Error extracting job details with AI:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to extract job details with AI",
    };
  }
}

export async function analyzeCvMatch(
  companyName: string,
  position: string,
  description: string,
  requirements: string[],
  cvData: ParsedCvData,
) {
  try {
    const systemPrompt = `You are an ATS (Applicant Tracking System) optimizer and expert HR consultant.
Compare the candidate's CV against the job posting details and compute an ATS compatibility score, matched keywords, missing keywords, and detailed suggestions for optimization.
Additionally, you MUST detect critical qualification dealbreakers (e.g., language requirements like English/Japanese, minimum education level like S1/D3, age limits/requirements, or key certifications) that are required by the job but NOT satisfied by the candidate's CV.

Job Details:
- Company: ${companyName}
- Position: ${position}
- Description: ${description}
- Requirements: ${JSON.stringify(requirements)}

Candidate CV Data:
${JSON.stringify(cvData)}

Perform these tasks:
1. Compute a compatibility score (matchScore) from 0 to 100 representing how well the candidate's CV matches the job's qualifications.
2. Identify matchedKeywords: important professional keywords (skills, methodologies, technologies) present in both the job description/requirements and the CV.
3. Identify missingKeywords: important keywords requested or implied in the job description/requirements but NOT found in the candidate's CV.
4. Generate actionable suggestions to tailor the CV. Each suggestion must point to a specific field and tab.
   - field: must be one of: "personal-summary", "experience-1", "experience-2", "education", "skills-others"
   - tab: must be one of: "personal", "experience", "education", "skills-others"
   - issue: brief explanation of why this part needs tweaking (e.g. missing keyword, phrasing).
   - fix: detailed verbatim text to add or how to adjust that section.
5. Identify alerts/dealbreakers: mismatches in fundamental job requirements like education degree level (e.g., job requires S1, CV only has D3/SMA), language requirements (e.g., job requires English, CV has no English skills mentioned), or age limitations (e.g., job requires max 25 years old, CV shows candidate is older).

Output ONLY a valid JSON object matching this EXACT schema:
{
  "matchScore": number (0-100),
  "matchedKeywords": ["string"],
  "missingKeywords": ["string"],
  "suggestions": [
    {
      "field": "string (must match one of the field options)",
      "tab": "string (must match one of the tab options)",
      "issue": "string",
      "fix": "string"
    }
  ],
  "alerts": [
    {
      "type": "string (must be one of: 'education', 'language', 'age', 'generic')",
      "title": "string (brief title, e.g. 'Pendidikan Tidak Sesuai')",
      "message": "string (detailed explanation, e.g. 'Lowongan membutuhkan minimal S1, sedangkan CV kamu hanya mencantumkan D3.')"
    }
  ]
}

Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.`;

    const response = await openai.chat.completions.create({
      model: "gemini/gemini-3.1-flash-lite-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Analyze and compute matching details." },
      ],
    });

    const aiResponseContent = response.choices[0]?.message?.content;

    if (!aiResponseContent) {
      return { success: false, error: "AI failed to generate matching score." };
    }

    let jsonText = aiResponseContent.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText
        .replace(/^```(?:json)?\n?/, "")
        .replace(/\n?```$/, "");
    }

    const parsedData = JSON.parse(jsonText.trim());
    return { success: true, data: parsedData };
  } catch (error) {
    console.error("Error analyzing CV matching with AI:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to analyze CV matching with AI",
    };
  }
}

export async function applyCvSuggestion(
  tab: string,
  field: string,
  currentData: unknown,
  suggestionFix: string,
  suggestionIssue: string,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const systemPrompt = `You are an expert resume builder and editor.
Your task is to apply a specific CV suggestion (issue & fix/instruction) to a candidate's CV data and return the revised, updated data.
You must return only the updated data structure matching the exact same schema and type as the Current Data.

Tab: ${tab}
Field: ${field}
Suggestion Issue: ${suggestionIssue}
Suggestion Fix/Instruction: ${suggestionFix}

Current Data:
${JSON.stringify(currentData, null, 2)}

Instructions:
1. Carefully revise the Current Data using the Suggestion Fix/Instruction.
2. Maintain the exact same JSON format, fields, and structure as the Current Data.
3. Make sure the output is clean, professional, and directly incorporates the requested change. Do not invent unrelated details.
4. If the Current Data is a string wrapped in an object like { "text": "..." }, return the revised object with the revised "text" string.
5. If the Current Data is an object or array, return the revised object or array with the same properties.

Output ONLY the revised data as a JSON value. Do not include markdown formatting like \`\`\`json.`;

    const response = await openai.chat.completions.create({
      model: "gemini/gemini-3.1-flash-lite-preview",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: "Apply the suggestion and return the updated JSON.",
        },
      ],
    });

    const aiResponseContent = response.choices[0]?.message?.content;

    if (!aiResponseContent) {
      return { success: false, error: "AI failed to generate a response." };
    }

    let jsonText = aiResponseContent.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText
        .replace(/^```(?:json)?\n?/, "")
        .replace(/\n?```$/, "");
    }

    const parsedData = JSON.parse(jsonText.trim());
    return { success: true, data: parsedData };
  } catch (error) {
    console.error("Error applying CV suggestion with AI:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to apply CV suggestion with AI",
    };
  }
}
