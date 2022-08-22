import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    default: "user",
  },
  resourceName: {
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
  notes: {
    type: String,
    default: "No Additional Notes Provided",
  },
  requestStatus: {
    type: String,
    default: "Pending",
  },
  requestApprovedBy: {
    type: String,
    default: "Pending",
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

export default mongoose.model("resources", resourceSchema);
