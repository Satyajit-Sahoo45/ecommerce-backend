"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controller/cart.controller");
const cartRouter = (0, express_1.Router)();
cartRouter.post("/cart", cart_controller_1.createOrUpdateCart);
cartRouter.get("/cart", cart_controller_1.getAllCarts);
cartRouter.delete("/cart", cart_controller_1.deleteCart);
exports.default = cartRouter;
