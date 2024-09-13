import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import OrderModel from "../model/order.model";
import { razorpay } from "../server";
import crypto from "crypto";
import sendMail from "../utils/sendMail";
import ErrorHandler from "../utils/ErrorHandler";
import path from "path";
import ejs from "ejs";
require("dotenv").config();

const router = express.Router();

// Create an order on Razorpay
export const checkout = async (req: Request, res: Response) => {
  const { cart, address } = req.body;
  const userId = req?.user?.id;

  try {
    // Calculate total cost
    const totalCost = cart.totalCost * 100; // Razorpay expects the amount in paisa (INR)

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalCost,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save order in database
    const order = new OrderModel({
      user: new mongoose.Types.ObjectId(userId),
      cart,
      address,
      paymentId: razorpayOrder.id,
    });

    await order.save();

    // Send Razorpay order details to frontend
    res.status(200).json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
};

// Update payment details after success
export const paymentVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
    req.body;

  try {
    // Verify signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET as string)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpaySignature) {
      // Update order in the database with payment status
      const order = await OrderModel.findById(orderId)
        .populate({
          path: "cart.items.productId",
          model: "Product",
        })
        .exec();
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const mailData = {
        _id: order._id,
        username: req?.user?.name,
        createdAt: order.createdAt,
        totalCost: order.cart.totalCost,
        totalQty: order.cart.totalQty,
        items: order.cart.items.map((item) => ({
          title: item.title,
          productId: item.productId,
          qty: item.qty,
          price: item.price,
        })),
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        await sendMail({
          email: req?.user?.email as string,
          subject: "Order confirmation",
          template: "order-confirmation.ejs",
          data: mailData,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      order.paymentId = razorpayPaymentId;
      order.delivered = true;
      await order.save();

      res.status(200).json({ message: "Payment verified and order updated" });
    } else {
      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error verifying payment");
  }
};

export const getOrdersForUserWithProducts = async (
  req: Request,
  res: Response
) => {
  const userId = req?.user?.id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "User ID is required.",
    });
  }

  try {
    // Fetch orders for the specific user and populate the product data
    const orders = await OrderModel.find({ user: userId })
      .populate({
        path: "cart.items.productId",
        model: "Product", // Ensure this matches the name of your Product model
      })
      .exec();

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders for user:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching orders. Please try again later.",
    });
  }
};

export default router;
