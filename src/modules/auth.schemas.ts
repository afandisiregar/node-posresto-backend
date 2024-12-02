import { z } from "zod";

export const signInSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    password: z.string().optional(),
  }),
});

export const signUpSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email(),
    name: z.string().optional(),
    password: z.string({ required_error: "Password is required" }).min(6),
  }),
});

export type SignInSchema = z.infer<typeof signInSchema.shape.body>;
export type SignUpSchema = z.infer<typeof signUpSchema.shape.body>;
