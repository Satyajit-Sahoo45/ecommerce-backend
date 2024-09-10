"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required."],
    },
    items: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product ID is required."],
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required."],
                min: [1, "Quantity must be at least 1."],
            },
        },
    ],
    shippingAddress: {
        type: [String],
        default: [],
    },
}, { timestamps: true });
const CartModel = mongoose_1.default.model("Cart", cartSchema);
exports.default = CartModel;
