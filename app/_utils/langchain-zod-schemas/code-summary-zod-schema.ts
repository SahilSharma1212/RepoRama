import { z } from "zod";

export const CodeSummarySchema = z.object({
    description: z.array(z.string()),
    keyFeatures: z.array(z.string()),
    implementationDetails: z.array(z.string()),
    importantFunctionsUsed: z.array(z.string()),
    useCases: z.array(z.string()),
});
