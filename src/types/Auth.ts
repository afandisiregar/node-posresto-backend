import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

const accessTokenPayloadSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
  is_active: z.boolean(),
});

export interface IRequest extends Request {
  user: {
    name: string | null;
    email: string;
    is_active: boolean;
  };
}

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
