import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: { productId: mongoose.Types.ObjectId; quantity: number }[];
  shippingAddress: string[];
}

const cartSchema: Schema<ICart> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

const CartModel: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export default CartModel;
