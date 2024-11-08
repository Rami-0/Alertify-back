import express from "express";
import {
  getCurrentUser,
  getUserById,
  login,
  logout,
  register,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/userById/:userId", getUserById);

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/currentUser", authMiddleware, getCurrentUser);

export default router;
