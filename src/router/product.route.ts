import { Router } from "express";
import {
  addProduct,
  addReview,
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../controller/product.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const productRouter = Router();

productRouter.post(
  "/add-product",
  isAuthenticated,
  authorizeRoles("admin"),
  addProduct
);

productRouter.get("/products", getAllProducts);

productRouter.get("/product/:id", getProductById);

productRouter.put(
  "/product/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  getProductById
);

productRouter.delete(
  "/delete-product/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteProduct
);

productRouter.post("/add-review", isAuthenticated, addReview);

export default productRouter;
