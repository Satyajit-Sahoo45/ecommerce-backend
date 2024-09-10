import { Router } from "express";
import {
  createOrUpdateCart,
  deleteCart,
  getAllCarts,
} from "../controller/cart.controller";

const cartRouter = Router();

cartRouter.post("/cart", createOrUpdateCart);

cartRouter.get("/cart", getAllCarts);

cartRouter.delete("/cart", deleteCart);

export default cartRouter;
