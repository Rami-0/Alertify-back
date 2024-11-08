"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = async (req, res, next) => {
    const { token } = req.cookies; // Read token from cookies
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET || "sample");
            req.user = decoded;
            next();
        }
        catch (error) {
            res.status(400).json({ message: "Invalid token" });
        }
    }
    else {
        res.status(401).json({ message: "Not authorized, no token." });
    }
};
exports.default = authMiddleware;
