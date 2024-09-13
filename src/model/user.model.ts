require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  addresses: IAddress[];
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
    addresses: [
      {
        street: {
          type: String,
          required: [true, "Please provide a street address"],
        },
        city: {
          type: String,
          required: [true, "Please provide a city"],
        },
        state: {
          type: String,
          required: [true, "Please provide a state"],
        },
        country: {
          type: String,
          required: [true, "Please provide a country"],
        },
        postalCode: {
          type: String,
          required: [true, "Please provide a postal code"],
        },
      },
    ],
  },
  { timestamps: true }
);

// Hash Password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// sign access token
userSchema.methods.SignAccessToken = function () {
  const payload = {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET || "", {
    expiresIn: "365d",
  });
};

// compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
