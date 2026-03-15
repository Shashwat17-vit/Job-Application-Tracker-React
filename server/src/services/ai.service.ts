import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

interface ParsedJobDescription {
  company: string;
  role: string;
  salary: string;
  location: string;
  techStack: string;
}

export async function parseJobDescription(description: string): Promise<ParsedJobDescription> {
  const result = await model.generateContent(
    `Extract the following fields from this job description. Return ONLY a JSON object with these keys: "company", "role", "salary", "location", "techStack". If a field is not found, use an empty string.

For "techStack", provide 3-4 short bullet points summarizing the key programming languages and technical skills required for the job. Format each point on a new line starting with "• ". Example: "• Python, Java, SQL\n• AWS, Docker, Kubernetes\n• React/TypeScript frontend". If no technical skills are mentioned, use an empty string.

No markdown, no code blocks, just the raw JSON object.

Job Description:
${description}`
  );

  const text = result.response.text();

  // Extract JSON from the response (handles markdown code blocks too)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { company: "", role: "", salary: "", location: "", techStack: "" };
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    company: String(parsed.company || ""),
    role: String(parsed.role || ""),
    salary: String(parsed.salary || ""),
    location: String(parsed.location || ""),
    techStack: String(parsed.techStack || ""),
  };
}
