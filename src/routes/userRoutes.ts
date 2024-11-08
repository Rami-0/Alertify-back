import express from "express";
import {
  getCurrentUser,
  getUserById,
  login,
  logout,
  register,
  updateUserConformation,
  updateUserPosition, // Import the new controller function
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/me/:userId", getUserById);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/currentUser", authMiddleware, getCurrentUser);
// @ts-ignore
router.put("/:userId/position", updateUserPosition); // New route to update user position
// @ts-ignore
router.post("/:userId/confirm", updateUserConformation); // New route to update user position

export default router;
