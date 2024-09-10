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
exports.deleteCart = exports.getAllCarts = exports.createOrUpdateCart = void 0;
const cart_model_1 = __importDefault(require("../model/cart.model"));
// Create or update a cart
const createOrUpdateCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, items, shippingAddress } = req.body;
    if (!userId || !items) {
        return res.status(400).json({ error: "User ID and items are required." });
    }
    try {
        // Find the existing cart for the user
        let cart = yield cart_model_1.default.findOne({ userId });
        if (cart) {
            // If the cart exists, update the items
            items.forEach((item) => {
                // Check if item already exists in the cart
                const existingItemIndex = cart.items.findIndex((i) => i.productId.toString() === item.productId);
                if (existingItemIndex !== -1) {
                    // Update quantity if item exists
                    cart.items[existingItemIndex].quantity = item.quantity;
                }
                else {
                    // Add new item if it doesn't exist
                    cart.items.push(item);
                }
            });
            // Update shipping address if provided
            if (shippingAddress) {
                cart.shippingAddress = shippingAddress;
            }
            // Save the updated cart
            cart = yield cart.save();
        }
        else {
            // If no cart exists, create a new one
            cart = yield cart_model_1.default.create({
                userId,
                items,
                shippingAddress,
            });
        }
        res.status(200).json({
            success: true,
            message: cart
                ? "Cart updated successfully."
                : "Cart created successfully.",
            cart,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "An error occurred while processing the cart. Please try again later.",
        });
    }
});
exports.createOrUpdateCart = createOrUpdateCart;
// Get all carts
const getAllCarts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carts = yield cart_model_1.default.find({})
            .populate("userId")
            .populate("items.productId");
        res.status(200).json({
            success: true,
            carts,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "An error occurred while retrieving carts. Please try again later.",
        });
    }
});
exports.getAllCarts = getAllCarts;
// Delete a cart by ID
const deleteCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedCart = yield cart_model_1.default.findByIdAndDelete(id);
        if (!deletedCart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        res.status(200).json({
            success: true,
            message: "Cart deleted successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "An error occurred while deleting the cart. Please try again later.",
        });
    }
});
exports.deleteCart = deleteCart;
