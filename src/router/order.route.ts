import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  checkout,
  getOrdersForUserWithProducts,
  paymentVerification,
} from "../controller/order.controller";

const orderRouter = Router();

orderRouter.post("/checkout", isAuthenticated, checkout);

orderRouter.post("/payment-verification", isAuthenticated, paymentVerification);

orderRouter.get("/all-orders", isAuthenticated, getOrdersForUserWithProducts);

export default orderRouter;
