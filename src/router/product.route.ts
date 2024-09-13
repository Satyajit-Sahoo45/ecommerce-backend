import { Router } from "express";
import {
  addProduct,
  addReview,
  deleteProduct,
  getAdminAllProducts,
  getAllProducts,
  getProductById,
  updateProduct,
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
  "/edit-product/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateProduct
);

productRouter.delete(
  "/delete-product/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteProduct
);

productRouter.get(
  "/get-admin-products",
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminAllProducts
);

productRouter.put("/add-review/:id", isAuthenticated, addReview);

export default productRouter;
