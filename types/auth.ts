import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export const onboardingSchema = z.object({
  workspaceName: z
    .string()
    .min(2, "Nome deve ter ao menos 2 caracteres")
    .max(50, "Nome muito longo"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
