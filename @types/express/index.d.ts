import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        name: string | null;
        email: string;
        is_active: boolean;
        access_token: string | null;
        refresh_token: string | null;
      };
    }
  }
}
