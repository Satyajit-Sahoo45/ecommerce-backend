import { NextFunction, Request, Response } from "express";
import userModel from "../model/user.model";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const newUser = await userModel.create({
      name,
      email,
      password,
      role,
    });

    res
      .status(201)
      .json({ message: "User registered successfully.", user: newUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const accessToken = `Bearer ${user.SignAccessToken()}`;

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
};

export const addAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { street, city, state, country, postalCode } = req.body.data;
    const userId = req?.user?.id;

    // Validate input
    if (!userId || !street || !city || !state || !country || !postalCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Append new address
    user.addresses.push({
      street,
      city,
      state,
      country,
      postalCode,
    });

    // Save the user with the new address
    await user.save();

    res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding address", error });
  }
};

export const getAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.id;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's addresses
    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses", error });
  }
};
