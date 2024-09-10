"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }
        const newUser = yield user_model_1.default.create({
            name,
            email,
            password,
            role,
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
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const user = yield user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const passwordMatch = yield user.comparePassword(password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password." });
        }
        const accessToken = `Bearer ${user.SignAccessToken()}`;
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
});
exports.login = login;
