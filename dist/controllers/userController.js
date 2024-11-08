"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getCurrentUser = exports.logout = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
const bcrypt_1 = require("../utils/bcrypt");
const prisma = new client_1.PrismaClient();
const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userExists = await prisma.users.findUnique({ where: { username } });
        if (userExists) {
            throw new Error("User already exists.");
        }
        const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
        const newUser = await prisma.users.create({
            data: { username, password: hashedPassword },
        });
        if (!newUser) {
            throw new Error("Creating user failed.");
        }
        const token = (0, jwt_1.generateToken)(String(newUser.id));
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        });
        return res.status(201).json({ message: "User created!" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: `${error}` });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.users.findUnique({ where: { username } });
        if (!user) {
            throw new Error("Something went wrong. Please try again!");
        }
        const isPassword = await (0, bcrypt_1.comparePassword)(password, user.password);
        if (!isPassword) {
            throw new Error("Login failed. Please try again!");
        }
        const token = (0, jwt_1.generateToken)(String(user.id));
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        });
        return res.status(200).json({ message: "Login Successful!" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: `${error}` });
    }
};
exports.login = login;
const logout = async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out!" });
};
exports.logout = logout;
const getCurrentUser = async (req, res) => {
    const user = req.user;
    try {
        const currentUser = await prisma.users.findUnique({
            where: { id: Number(user.userId) },
        });
        res.status(200).json({
            id: currentUser?.id,
            username: currentUser?.username,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: `${error}` });
    }
};
exports.getCurrentUser = getCurrentUser;
const getUserById = async (req, res, next) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
