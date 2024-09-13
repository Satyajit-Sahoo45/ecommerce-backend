import { Router } from "express";
import {
  createOrUpdateCart,
  deleteCart,
  deleteCartItem,
  getAllCarts,
} from "../controller/cart.controller";
import { isAuthenticated } from "../middleware/auth";

const cartRouter = Router();

cartRouter.put("/cart", isAuthenticated, createOrUpdateCart);

cartRouter.get("/cart", isAuthenticated, getAllCarts);

cartRouter.delete("/cart/:id", isAuthenticated, deleteCartItem);

cartRouter.delete("/delete-cart/:cartId", isAuthenticated, deleteCart);

export default cartRouter;
