import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  createUserToDB,
  listUsersFromDB,
  updateUserToDB,
  deleteUserFromDB,
} from "../services/user.service";

export const list: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await listUsersFromDB(req, res);

    res.status(200).json({
      success: true,
      message: "List of users",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const create: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createUserToDB(req, res);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await updateUserToDB(req, res);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteUserFromDB(req, res);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
