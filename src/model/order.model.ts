import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  cart: {
    totalQty: number;
    totalCost: number;
    items: {
      productId: mongoose.Schema.Types.ObjectId;
      qty: number;
      price: number;
      title?: string;
      productCode?: string;
    }[];
  };
  address: string;
  paymentId: string;
  createdAt?: Date;
  updatedAt?: Date;
  delivered: boolean;
}

const orderSchema: Schema<IOrder> = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: {
      totalQty: {
        type: Number,
        default: 0,
        required: true,
      },
      totalCost: {
        type: Number,
        default: 0,
        required: true,
      },
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          qty: {
            type: Number,
            default: 0,
            required: true,
          },
          price: {
            type: Number,
            default: 0,
            required: true,
          },
          title: {
            type: String,
          },
          productCode: {
            type: String,
          },
        },
      ],
    },
    address: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const OrderModel: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default OrderModel;
