import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("otp", otpSchema);
