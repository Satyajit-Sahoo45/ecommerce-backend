import { Request, Response, NextFunction } from "express";
import CartModel, { ICart } from "../model/cart.model";

// Create or update a cart
export const createOrUpdateCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, items, shippingAddress } = req.body;

  if (!userId || !items) {
    return res.status(400).json({ error: "User ID and items are required." });
  }

  try {
    // Find the existing cart for the user
    let cart: ICart | null = await CartModel.findOne({ userId });

    if (cart) {
      // If the cart exists, update the items
      items.forEach((item: any) => {
        // Check if item already exists in the cart
        const existingItemIndex = cart.items.findIndex(
          (i) => i.productId.toString() === item.productId
        );

        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          cart.items[existingItemIndex].quantity = item.quantity;
        } else {
          // Add new item if it doesn't exist
          cart.items.push(item);
        }
      });

      // Update shipping address if provided
      if (shippingAddress) {
        cart.shippingAddress = shippingAddress;
      }

      // Save the updated cart
      cart = await cart.save();
    } else {
      // If no cart exists, create a new one
      cart = await CartModel.create({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error:
        "An error occurred while processing the cart. Please try again later.",
    });
  }
};

// Get all carts
export const getAllCarts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const carts = await CartModel.find({})
      .populate("userId")
      .populate("items.productId");
    res.status(200).json({
      success: true,
      carts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error:
        "An error occurred while retrieving carts. Please try again later.",
    });
  }
};

// Delete a cart by ID
export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedCart = await CartModel.findByIdAndDelete(id);
    if (!deletedCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.status(200).json({
      success: true,
      message: "Cart deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error:
        "An error occurred while deleting the cart. Please try again later.",
    });
  }
};
