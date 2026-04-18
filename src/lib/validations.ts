import { z } from "zod";

/* ── Company Request ── */
export const companyRequestSchema = z.object({
    companyName: z
        .string()
        .min(1, "Company name is required")
        .max(100, "Company name must be under 100 characters")
        .transform((v) => v.trim()),
    email: z
        .string()
        .email("Invalid email address")
        .optional()
        .or(z.literal(""))
        .transform((v) => v?.trim() ?? ""),
});

export type CompanyRequestInput = z.infer<typeof companyRequestSchema>;

/* ── Razorpay Order ── */
export const razorpayOrderSchema = z.object({
    amount: z
        .number()
        .min(1, "Amount must be at least ₹1")
        .max(500000, "Amount cannot exceed ₹5,00,000"),
});

export type RazorpayOrderInput = z.infer<typeof razorpayOrderSchema>;

/* ── Onboarding Profile ── */
export const profileSchema = z.object({
    industry: z.string().min(1, "Industry is required"),
    experience: z.string().min(1, "Experience is required"),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    bio: z.string().min(1, "Bio is required").max(1000, "Bio must be under 1000 characters"),
});

export type ProfileInput = z.infer<typeof profileSchema>;

/* ── AI Insights ── */
export const insightsRequestSchema = z.object({
    industry: z.string().min(1).default("Technology"),
    experience: z.string().optional().default("1"),
    skills: z.array(z.string()).optional().default([]),
});

export type InsightsRequestInput = z.infer<typeof insightsRequestSchema>;
