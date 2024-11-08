import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies; // Read token from cookies

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || "sample"
      );

      req.user = decoded;

      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token." });
  }
};

export default authMiddleware;
