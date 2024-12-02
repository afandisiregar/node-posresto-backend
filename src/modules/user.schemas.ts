import { z } from "zod";

export const userListSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    name: z.string().optional(),
    email : z.string().optional(),
  }),
});

export const userCreateSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({ message: "Email format is invalid" }),
    name: z.string().optional(),
  }),
});

export const userUpdateSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({ message: "Email format is invalid" }),
    name: z.string().optional(),
  }),
});

export const userDeleteSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
