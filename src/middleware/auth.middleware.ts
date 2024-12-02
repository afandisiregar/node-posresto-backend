import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import prisma from "../../index";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  let token = "";

  if (
    req.cookies.accessToken ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1]; // Use optional chaining
  }
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Login to access this area!",
    });
    return;
  }

  // set token in request
  req.token = token;
  next();
};

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.token;
    if (!accessToken) {
      res.status(401).json({
        success: false,
        message: "Login to access this area!",
      });
      return;
    }

    const decodedToken = verifyToken(accessToken);
    if (!decodedToken) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access!",
      });
      return;
    }

    // set user in request
    const user = await prisma.user.findFirst({
      where: {
        access_token: accessToken,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Unauthorized access!",
      });

      return;
    }

    const userObject = {
      id: user.id,
      email: user.email,
      name: user.name,
      is_active: user.is_active,
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    };

    req.user = userObject;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized access!",
    });
  }
};
