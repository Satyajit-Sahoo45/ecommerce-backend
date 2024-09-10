"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const signup = async (req, res, next) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role || "USER",
            },
        });
        res
            .status(201)
            .json({ message: "User registered successfully.", user: newUser });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred. Please try again later." });
    }
};
exports.signup = signup;
const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password." });
        }
        let JWTPayload = {
            id: user.id,
            email: email,
            role: user.role,
        };
        const accessToken = jsonwebtoken_1.default.sign(JWTPayload, process.env.JWT_SECRET, {
            expiresIn: "365d",
        });
        res.status(200).json({
            success: true,
            message: "Login successful.",
            user,
            accessToken,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred. Please try again later." });
    }
};
exports.login = login;
