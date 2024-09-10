import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Product interface
export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  imageUrl: object;
  ratings: {
    userId: mongoose.Types.ObjectId;
    rating: number;
    review: string;
  }[];
}

const productSchema: Schema<IProduct> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required."],
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
    },
    price: {
      type: Number,
      required: [true, "Product price is required."],
    },
    imageUrl: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    ratings: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        review: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

const productModel: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default productModel;
