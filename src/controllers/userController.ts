import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { generateToken } from "../utils/jwt";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { comparePassword, hashPassword } from "../utils/bcrypt";

const prisma = new PrismaClient();

export const register = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { username, password } = req.body;
  try {
    const userExists = await prisma.users.findUnique({ where: { username } });

    if (userExists) {
      throw new Error("User already exists.");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.users.create({
      data: { username, password: hashedPassword },
    });

    if (!newUser) {
      throw new Error("Creating user failed.");
    }

    const token = generateToken(String(newUser.id));

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });

    return res.status(201).json({ message: "User created!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { username, password } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { username } });

    if (!user) {
      throw new Error("Something went wrong. Please try again!");
    }

    const isPassword = await comparePassword(password, user.password);

    if (!isPassword) {
      throw new Error("Login failed. Please try again!");
    }

    const token = generateToken(String(user.id));

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });

    return res.status(200).json({ message: "Login Successful!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `${error}` });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  res.clearCookie("token");
  return res.status(200).json({ message: "User logged out!" });
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req.user;

  try {
    const currentUser = await prisma.users.findUnique({
      where: { id: Number(user.userId) },
    });

    res.status(200).json({
      id: currentUser?.id,
      username: currentUser?.username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: Number(req.params.userId) },
    });

    if (!user) {
      // Throw a custom error to pass to the error middleware
      const error = new Error("User not found!");
      throw error;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
