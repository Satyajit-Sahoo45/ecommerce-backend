import { Router } from "express";
import {
  addAddress,
  getAddresses,
  login,
  signup,
} from "../controller/AuthController";
import { isAuthenticated } from "../middleware/auth";

const userRouter = Router();

userRouter.post("/signup", signup);

userRouter.post("/login", login);

userRouter.get("/get-address", isAuthenticated, getAddresses);

userRouter.post("/add-address", isAuthenticated, addAddress);

export default userRouter;
