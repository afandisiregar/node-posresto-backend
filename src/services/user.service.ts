import prisma from "../../index";
import { Request, Response } from "express";
import { checkEmailExistsDB } from "./auth.service";
import bcrypt from "bcrypt";
import CONFIG from "../config";
import type { Query } from "../types/Http";
import type { ResponseList } from "../types/Http";

export const listUsersFromDB = async (
  req: Request,
  res: Response
): Promise<ResponseList> => {
  const queryParams = req.query;

  const filters: any[] = [];

  if (queryParams.name) {
    filters.push({
      name: {
        contains: queryParams.name as string,
      },
    });
  }

  if (queryParams.email) {
    filters.push({
      email: {
        contains: queryParams.email as string,
      },
    });
  }

  const query: Query = {
    where: {
      AND: filters,
    },
    select: {
      id: true,
      name: true,
      email: true,
      is_active: true,
      created_at: true,
      updated_at: true,
    },
  };

  if (queryParams.page && queryParams.limit) {
    const skip = (Number(queryParams.page) - 1) * Number(queryParams.limit);
    query.take = Number(queryParams.limit);
    query.skip = skip;
  }

  const users = await prisma.user.findMany(query);
  const total = await prisma.user.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: users,
    paging: {
      current_page: Number(queryParams.page),
      size: Number(queryParams.limit),
      total_page: Math.ceil(total / Number(queryParams.limit)),
      total: total,
    },
  };
};

export const createUserToDB = async (req: Request, res: Response) => {
  const email = req.body.email;

  const emailIsExists = await checkEmailExistsDB(email);
  if (emailIsExists) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const encryptedPassword = await bcrypt.hash("password", CONFIG.PASSWORD_SALT);

  const result = await prisma.user.create({
    data: {
      ...req.body,
      password: encryptedPassword,
    },
  });

  return {
    email: result.email,
    name: result.name,
    created_at: result.created_at,
    updated_at: result.updated_at,
  };
};

export const updateUserToDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const emailIsExists = await checkEmailExistsDB(email);
  if (emailIsExists) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const updateUser = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: req.body,
  });

  return {
    email: updateUser.email,
    name: updateUser.name,
    created_at: updateUser.created_at,
    updated_at: updateUser.updated_at,
  };
};

export const deleteUserFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const deleteUser = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });

  return {
    email: deleteUser.email,
    name: deleteUser.name,
    created_at: deleteUser.created_at,
    updated_at: deleteUser.updated_at,
  };
};
