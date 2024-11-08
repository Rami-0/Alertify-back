import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET || "sample", {
    expiresIn: "7d",
  });
};
