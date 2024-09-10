"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controller/AuthController");
const userRouter = (0, express_1.Router)();
userRouter.post("/signup", AuthController_1.signup);
userRouter.post("/login", AuthController_1.login);
exports.default = userRouter;
