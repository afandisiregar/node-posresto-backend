import prisma from "../../index";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import CONFIG from "../config";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { AccessTokenPayload } from "../types/Auth";

export const checkEmailExistsDB = async (email: string) => {
  try {
    const countUser = await prisma.user.count({
      where: {
        email: email,
      },
    });

    if (countUser > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const signInDB = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the details",
      });
    }

    const passwordCompare = await bcrypt.hash(password, CONFIG.PASSWORD_SALT);

    if (!passwordCompare) {
      // throw new ResponseError(400, "Invalid email or password");
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // set cookie
    const cookieOptions = {
      expires: new Date(Date.now() + parseInt(CONFIG.COOKIE_EXPIRY)),
      httpOnly: true,
      domain: CONFIG.FRONTEND_DOMAIN_COOKIE,
      sameSite: false,
      secure: process.env.NODE_ENV == "production",
      path: "/",
    };

    const refreshTokenExpiry = new Date(
      Date.now() + parseInt(CONFIG.COOKIE_EXPIRY_REFRESH)
    );

    const userFound = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!userFound) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const payload = {
      email: userFound.email,
      password: userFound.password,
      name: userFound.name,
      is_active: userFound.is_active,
    } as AccessTokenPayload;

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("accessToken", accessToken);
    res.cookie("refreshToken", refreshToken);

    const updateUser = await prisma.user.update({
      where: {
        id: userFound.id,
      },
      data: {
        refresh_token: refreshToken,
        access_token: accessToken,
      },
    });

    const userData = {
      email: updateUser.email,
      name: updateUser.name,
      is_active: updateUser.is_active,
    };

    return {
      access_token: updateUser.access_token,
      refresh_token: updateUser.refresh_token,
      user: userData,
    };
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const signUpDB = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const name = req.body.name || "";
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the details",
      });
    }

    // check if email exits
    const emailExists = await checkEmailExistsDB(email);

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // encrypt the password
    const encryptedPassword = await bcrypt.hash(password, CONFIG.PASSWORD_SALT);

    const result = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: encryptedPassword,
      },
    });
    return result;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const meDB = async (req: Request, res: Response) => {
  try {
    const token = req.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        access_token: token,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    return {
      email: user.email,
      name: user.name,
      is_active: user.is_active,
    };
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const signOutDB = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const cookieOptions = {
      expires: new Date(Date.now() + parseInt(CONFIG.COOKIE_EXPIRY)),
      httpOnly: true,
      domain: CONFIG.FRONTEND_DOMAIN_COOKIE,
      sameSite: false,
      secure: process.env.NODE_ENV == "production",
      path: "/",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refresh_token: "",
        access_token: "",
      },
    });

    return res.status(200).json({
      success: true,
      message: "User signed out successfully",
      data: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
