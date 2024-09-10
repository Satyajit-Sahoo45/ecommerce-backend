import { NextFunction, Request, Response } from "express";
import productModel from "../model/product.model";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, price, imageUrl } = req.body;

  if (!title || !description || !price) {
    return res
      .status(400)
      .json({ error: "All fields are required, including image details." });
  }

  try {
    let thumb = {
      url: "https://res.cloudinary.com/de2xhx2wy/image/upload/v1725597823/courses/i5gcvuunwphhbkakvfpq.png",
      public_id: "courses/i5gcvuunwphhbkakvfpq",
    };

    if (imageUrl) {
      try {
        const myCloud = await cloudinary.v2.uploader.upload(imageUrl, {
          folder: "courses",
        });

        thumb = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    const newProduct = await productModel.create({
      title,
      description,
      price,
      imageUrl: thumb,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error:
        "An error occurred while adding the product. Please try again later.",
    });
  }
};

// Get all products
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error:
        "An error occurred while retrieving products. Please try again later.",
    });
  }
};

// Get a specific product by ID
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error:
        "An error occurred while retrieving the product. Please try again later.",
    });
  }
};

// Update a product by ID
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title, description, price, imageUrl } = req.body;

  try {
    let updatedImage = null;

    if (imageUrl) {
      try {
        const myCloud = await cloudinary.v2.uploader.upload(imageUrl, {
          folder: "courses",
        });

        updatedImage = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        imageUrl: updatedImage || undefined,
      },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error:
        "An error occurred while updating the product. Please try again later.",
    });
  }
};

// Delete a product by ID
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Optionally delete the image from Cloudinary
    // if (product.imageUrl?.public_id) {
    //   try {
    //     await cloudinary.v2.uploader.destroy(product.imageUrl.public_id);
    //   } catch (error) {
    //     console.error("Error deleting image from Cloudinary:", error);
    //   }
    // }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error:
        "An error occurred while deleting the product. Please try again later.",
    });
  }
};

// Add or update a product review
export const addReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, productId, rating, review } = req.body;

  if (!productId || rating === undefined || !userId) {
    return res
      .status(400)
      .json({ error: "Product ID, rating, and user ID are required." });
  }

  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const existingReviewIndex = product.ratings.findIndex((r: any) =>
      r.userId.equals(userId)
    );

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (existingReviewIndex > -1) {
      product.ratings[existingReviewIndex] = {
        userId: userObjectId,
        rating,
        review,
      };
    } else {
      product.ratings.push({ userId: userObjectId, rating, review });
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Review added/updated successfully.",
      product,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the review." });
  }
};

// Get reviews for a product
export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required." });
  }

  try {
    const product = await productModel.findById(productId).select("ratings");
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    return res.status(200).json({
      success: true,
      reviews: product.ratings,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving reviews." });
  }
};
