import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { CodeSummarySchema } from "../langchain-zod-schemas/code-summary-zod-schema";

// ------------------------------------------------------------------
// TYPES
// ------------------------------------------------------------------
type CodeSummary = z.infer<typeof CodeSummarySchema>;

// ------------------------------------------------------------------
// ENV VALIDATION
// ------------------------------------------------------------------
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables");
}

// ------------------------------------------------------------------
// LLM SETUP
// ------------------------------------------------------------------
const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: GEMINI_API_KEY,
    maxOutputTokens: 2048,
    temperature: 0.3, // ↓ lower for consistency in structured output
});

// ------------------------------------------------------------------
// STRUCTURED OUTPUT MODEL
// ------------------------------------------------------------------
const modelWithStructure = model.withStructuredOutput(CodeSummarySchema, {
    name: "code_summary",
    strict: true,
});

// ------------------------------------------------------------------
// PROMPT (NO JSON INSTRUCTIONS NEEDED NOW)
// ------------------------------------------------------------------
const promptTemplate = new PromptTemplate({
    inputVariables: ["code"],
    template: `
You are an expert software engineer and code reviewer.

Analyze the following code and extract:

- What the file does
- Key features
- Implementation details
- Important functions used (explicit function / hook / handler names)
- Practical use cases

Rules:
- Be concise
- Each item must be a short bullet point
- Do not invent functions that do not exist

CODE:
{code}
`.trim(),
});

// ------------------------------------------------------------------
// CHAIN
// ------------------------------------------------------------------
const chain = promptTemplate.pipe(modelWithStructure);

// ------------------------------------------------------------------
// PUBLIC API
// ------------------------------------------------------------------
export async function summarizeCode(code: string): Promise<CodeSummary> {
    try {
        return await chain.invoke({ code });
    } catch (error) {
        console.error("Error summarizing code:", error);
        throw new Error("Failed to generate code summary");
    }
}
