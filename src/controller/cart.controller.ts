import { Request, Response, NextFunction } from "express";
import CartModel, { ICart } from "../model/cart.model";
import mongoose from "mongoose";

// Create or update a cart
interface CartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export const createOrUpdateCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { items }: { items: CartItem[] } = req.body.data;
  const userId = req?.user?.id;

  if (!userId || !items || !Array.isArray(items)) {
    return res
      .status(400)
      .json({ error: "User ID and valid items array are required." });
  }

  try {
    // Find the existing cart for the user
    let cart = await CartModel.findOne({ userId }).exec();

    if (cart) {
      // If the cart exists, update the items
      items.forEach((item) => {
        // Check if item already exists in the cart
        const existingItemIndex = (cart as ICart).items.findIndex(
          (i) => i.productId.toString() === item.productId.toString()
        );

        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          (cart as ICart).items[existingItemIndex] = {
            ...(cart as ICart).items[existingItemIndex],
            quantity: item.quantity,
          };
        } else {
          // Add new item if it doesn't exist
          (cart as ICart).items.push(item);
        }
      });

      // Save the updated cart
      cart = await cart.save();
    } else {
      // If no cart exists, create a new one
      cart = await CartModel.create({
        userId,
        items,
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
    console.error("Error processing cart:", error);
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
  const userId = req?.user?.id;

  try {
    const userCarts = await CartModel.find({ userId }).populate({
      path: "items.productId",
      model: "Product",
      select: "title price imageUrl description",
    });

    if (userCarts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No carts found for the specified user.",
      });
    }

    res.status(200).json({
      success: true,
      carts: userCarts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error:
        "An error occurred while retrieving the user's carts. Please try again later.",
    });
  }
};

// Delete a cart by ID
export const deleteCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { cartId } = req.body;

  try {
    // Find the cart by its ID
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the index of the item to remove
    const itemIndex = cart.items.findIndex(
      (item: any) => item._id.toString() === id
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Remove the item from the items array
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error:
        "An error occurred while deleting the item. Please try again later.",
    });
  }
};

export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cartId } = req.params;

  if (!cartId) {
    return res.status(400).json({ error: "Cart ID is required." });
  }

  try {
    // Delete the cart with the given ID
    const result = await CartModel.deleteOne({ _id: cartId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Cart not found." });
    }

    res.status(200).json({
      success: true,
      message: "Cart deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({
      success: false,
      error:
        "An error occurred while deleting the cart. Please try again later.",
    });
  }
};
