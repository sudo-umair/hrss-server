import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  resource: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Resource", ResourceSchema);
