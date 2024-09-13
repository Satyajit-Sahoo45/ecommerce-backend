import Razorpay from "razorpay";
import app from "./app";
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";

require("dotenv").config();

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY as string,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

//create server
app.listen(8000, () => {
  console.log(`Server is connected with port 8000}`);
  connectDB();
});
