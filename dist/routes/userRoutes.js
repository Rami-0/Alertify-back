"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.get("/me/:userId", userController_1.getUserById);
router.post("/register", userController_1.register);
router.post("/login", userController_1.login);
router.post("/logout", userController_1.logout);
router.get("/currentUser", authMiddleware_1.default, userController_1.getCurrentUser);
// @ts-ignore
router.put("/:userId/position", userController_1.updateUserPosition); // New route to update user position
// @ts-ignore
router.post("/:userId/confirm", userController_1.updateUserConformation); // New route to update user position
exports.default = router;
