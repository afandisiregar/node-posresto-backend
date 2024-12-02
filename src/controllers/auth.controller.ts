import { Request, Response, NextFunction } from "express";
import { signUpDB, signInDB, meDB, signOutDB } from "../services/auth.service";
import type { SignInSchema, SignUpSchema } from "../modules/auth.schemas";

const signIn = async (
  req: Request<{}, {}, SignInSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await signInDB(req, res);
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
    // res.status(500).json({
    //   success: false,
    //   message: "Internal server error",
    // });
  }
};

const signUp = async (
  req: Request<{}, {}, SignUpSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await signUpDB(req, res);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: "Internal server error",
    // });
    next(error);
  }
};

const me = async (
  req: Request<
    {},
    {},
    {
      user: {
        name: string | null;
        email: string;
        is_active: boolean;
      };
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await meDB(req, res);

    res.status(200).json({
      success: true,
      message: "User found",
      data: result,
    });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: "Internal server error",
    // });
    next(error);
  }
};

const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await signOutDB(req, res);

    res.status(200).json({
      success: true,
      message: "User signed out successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export { signUp, signIn, me, signOut };
